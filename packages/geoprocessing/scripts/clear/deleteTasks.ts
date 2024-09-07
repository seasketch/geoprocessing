import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import {
  TaskKey,
  batchDeleteTasks,
} from "../../src/aws/dynamodb/batchDeleteTasks.js";
import { scanTasks } from "../../src/aws/dynamodb/scanTasks.js";
import { wait } from "../../src/helpers/wait.js";

const MAX_BATCH_DELETE = 25; // 25 is the maximum number of items that can be deleted in a single batch
const WAIT_TIME = 2000; // 2 seconds between batch deletes, to avoid throttling

/**
 * Clear all results from task table
 * @param serviceName - Optional. If provided, only results for this service will be cleared.  If not provided, all results will be cleared.
 */
export async function deleteTasks(
  projectName: string,
  region: string,
  serviceName?: string
) {
  const tableName = `gp-${projectName}-tasks`;
  const docClient = DynamoDBDocument.from(
    new DynamoDBClient({
      region: region,
    })
  );

  const pager = scanTasks(docClient, tableName, serviceName);

  let taskKeys: TaskKey[] = [];
  let hasItems = false;
  // let batchNum: number = 0;
  // Each page of results will often have less than number we can delete at a time so we build up batch until ready
  for await (const result of pager) {
    if (result && result.Items && Object.keys(result.Items).length > 0) {
      hasItems = true;
      result.Items.forEach(async (item) => {
        taskKeys.push({
          id: item.id,
          service: item.service,
        });

        // When batch of tasks is ready, start their delete and continue
        if (taskKeys.length >= MAX_BATCH_DELETE) {
          const taskKeyBatch = taskKeys.splice(0, MAX_BATCH_DELETE); // deletes items from taskKeys array
          await batchDeleteTasks(docClient, taskKeyBatch, tableName);
          await wait(WAIT_TIME);
        }
      });
    }
  }

  // Delete any remaining tasks
  if (taskKeys.length > 0 && taskKeys.length < MAX_BATCH_DELETE) {
    await batchDeleteTasks(docClient, taskKeys, tableName);
  }

  if (hasItems === false) {
    console.log(
      `No results found in DynamoDB table ${tableName} ${serviceName ? "for service " + serviceName : ""}`
    );
  }
}
