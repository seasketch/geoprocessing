import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocument,
  ScanCommandInput,
  paginateScan,
  DynamoDBDocumentPaginationConfiguration,
} from "@aws-sdk/lib-dynamodb";

const MAX_BATCH_DELETE = 25; // 25 is the maximum number of items that can be deleted in a single batch

type TaskKey = { id: string; service: string };

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

  // console.log("projectName", projectName);
  // console.log("region", region);
  // console.log("serviceName", serviceName);

  const docClient = DynamoDBDocument.from(
    new DynamoDBClient({
      region: region,
    })
  );

  // Get all task keys.  Scans entire table, may take a while

  const paginatorConfig: DynamoDBDocumentPaginationConfiguration = {
    client: docClient,
    pageSize: 25,
  };

  const taskKeys: TaskKey[] = [];

  let query: ScanCommandInput = {
    TableName: tableName,
    ProjectionExpression: "id, service",
  };
  if (serviceName && serviceName !== "all") {
    query = {
      TableName: tableName,
      ProjectionExpression: "id, service",
      FilterExpression: "service = :pk",
      ExpressionAttributeValues: {
        ":pk": serviceName,
      },
    };
  }

  // console.log("query", query);

  // Pager will return a variable number of items, up to 1MB of data
  const pager = paginateScan(paginatorConfig, query);

  const promises: Promise<void>[] = [];
  let batchNum = 0;
  // Each page of results will often have less than number we can delete at a time so we build up batch until ready
  for await (const result of pager) {
    if (result && result.Items) {
      result.Items.forEach(async (item, index, result) => {
        taskKeys.push({
          id: item.id,
          service: item.service,
        });

        // When batch of tasks is ready, start their delete and continue
        if (taskKeys.length >= MAX_BATCH_DELETE) {
          const taskKeyBatch = taskKeys.splice(0, MAX_BATCH_DELETE); // deletes items from taskKeys array
          promises.push(
            batchDeleteTasks(docClient, taskKeyBatch, tableName, batchNum)
          );
          batchNum += 1;
        }
      });
    }
  }

  // Delete any remaining tasks
  if (taskKeys.length > 0 && taskKeys.length < MAX_BATCH_DELETE) {
    promises.push(batchDeleteTasks(docClient, taskKeys, tableName, batchNum));
  }

  if (batchNum === 0) {
    console.log(
      `No results found in DynamoDB table ${tableName} ${serviceName ? "for service " + serviceName : ""}`
    );
  }

  await Promise.all(promises);
}

/**
 * Batch delete tasks in single query
 */
async function batchDeleteTasks(
  docClient: DynamoDBDocument,
  taskKeys: TaskKey[],
  tableName: string,
  index: number
) {
  const deleteRequestChunk: object[] = taskKeys.map((taskKey) => {
    return {
      DeleteRequest: {
        Key: {
          id: taskKey.id,
          service: taskKey.service,
        },
      },
    };
  });

  const deleteRequest = {
    RequestItems: {
      [tableName]: deleteRequestChunk,
    },
  };
  const lowerBound = index * MAX_BATCH_DELETE + 1;
  // console.log("index", index);
  // console.log("deleteRequestChunk.length", deleteRequestChunk.length);
  // console.log("MAX_BATCH_DELETE", MAX_BATCH_DELETE);
  const upperBound =
    index * MAX_BATCH_DELETE +
    (deleteRequestChunk.length < MAX_BATCH_DELETE
      ? deleteRequestChunk.length
      : MAX_BATCH_DELETE);
  console.log(`Deleting items ${lowerBound} - ${upperBound}`);
  const deleteCommand = new BatchWriteCommand(deleteRequest);
  await docClient.send(deleteCommand);
}
