import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocument,
  ScanCommandInput,
  paginateScan,
  DynamoDBDocumentPaginationConfiguration,
} from "@aws-sdk/lib-dynamodb";

const MAX_BATCH_DELETE = 25; // 25 is the maximum number of items that can be deleted in a single batch

type TaskKey = { id: string; service: string };
let tableName = "";

/**
 * Clear all results from task table
 * @param serviceName - Optional. If provided, only results for this service will be cleared.  If not provided, all results will be cleared.
 */
export async function deleteTasks(
  projectName: string,
  region: string,
  serviceName?: string
) {
  tableName = `gp-${projectName}-tasks`;

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

  // Pager will return a variable number of items, up to 1MB of data
  const pager = paginateScan(paginatorConfig, query);

  //
  let promises: Promise<void>[] = [];
  let taskKeys: TaskKey[] = [];
  let hasItems = false;
  // let batchNum: number = 0;
  // Each page of results will often have less than number we can delete at a time so we build up batch until ready
  for await (const result of pager) {
    if (result && result.Items && Object.keys(result.Items).length > 0) {
      hasItems = true;
      result.Items.forEach(async (item, batchNum, result) => {
        taskKeys.push({
          id: item.id,
          service: item.service,
        });

        // When batch of tasks is ready, start their delete and continue
        if (taskKeys.length >= MAX_BATCH_DELETE) {
          const taskKeyBatch = taskKeys.splice(0, MAX_BATCH_DELETE); // deletes items from taskKeys array
          await batchDeleteTasks(docClient, taskKeyBatch, tableName); // wait for delete of whole batch before continuing
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

  promises.forEach(async (p) => await p);
}

/**
 * Batch delete array of tasks
 */
async function batchDeleteTasks(
  docClient: DynamoDBDocument,
  taskKeys: TaskKey[],
  tableName: string
) {
  // const batchSize = taskKeys.length;
  // const lowerBound = batchNum * MAX_BATCH_DELETE + 1;
  // const upperBound =
  //   batchNum * MAX_BATCH_DELETE +
  //   (batchSize < MAX_BATCH_DELETE ? batchSize : MAX_BATCH_DELETE);
  // console.log(`Deleting items ${lowerBound} - ${upperBound}`);

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

  const deleteRequest: BatchWriteCommandInput = {
    RequestItems: {
      [tableName]: deleteRequestChunk,
    },
  };

  await batchDelete(docClient, deleteRequest, 0, 10);
  await wait(2000);
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function batchDelete(
  docClient: DynamoDBDocument,
  deleteCommandInput: BatchWriteCommandInput,
  retryCount: number = 0,
  maxRetries: number = 10
) {
  try {
    // console.log("deleting", JSON.stringify(deleteCommandInput, null, 2));
    const id =
      deleteCommandInput!.RequestItems![tableName!][0].DeleteRequest!.Key!.id;
    const service =
      deleteCommandInput!.RequestItems![tableName!][0].DeleteRequest!.Key!
        .service;
    console.log(
      `${retryCount > 0 ? "Retry #" + retryCount + " " : ""}Deleting batch starting with ${id} - ${service}`
    );
    const deleteCommand = new BatchWriteCommand(deleteCommandInput);
    const res = await docClient.send(deleteCommand);

    if (res.UnprocessedItems && Object.keys(res.UnprocessedItems).length > 0) {
      if (retryCount > maxRetries) {
        throw new Error(
          `${Object.keys(res.UnprocessedItems).length} items not deleted after ${maxRetries} retries`
        );
      }

      const id = res.UnprocessedItems[tableName!][0].DeleteRequest!.Key!.id;
      const service =
        res.UnprocessedItems[tableName!][0].DeleteRequest!.Key!.service;
      // console.log(
      //   `  ${Object.keys(res.UnprocessedItems[tableName]).length} unprocessed, retry batch in ${2 ** retryCount * 10}ms, starting with ${id} - ${service}`
      // );
      await wait(2 ** retryCount * 10); // wait time increases exponentially

      await batchDelete(
        docClient,
        { RequestItems: res.UnprocessedItems }, // call again with unprocessed items
        retryCount + 1,
        maxRetries
      );
    }
  } catch (e: any) {
    // console.log(JSON.stringify(e, null, 2));
    if (
      e.$metadata &&
      e.$metadata.httpStatusCode === 400 &&
      e.$metadata.totalRetryDelay
    ) {
      const id =
        deleteCommandInput!.RequestItems![tableName!][0].DeleteRequest!.Key!.id;
      const service =
        deleteCommandInput!.RequestItems![tableName!][0].DeleteRequest!.Key!
          .service;
      // console.log(
      //   ` ThroughputError, retry in ${e.$metadata.totalRetryDelay}ms starting with ${id} - ${service}`
      // );
      await wait(e.$metadata.totalRetryDelay);
      await batchDelete(docClient, deleteCommandInput, 0, maxRetries);
    } else {
      throw new Error(e);
    }
  }
}
