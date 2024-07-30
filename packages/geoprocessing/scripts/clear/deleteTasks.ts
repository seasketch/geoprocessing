import {
  BatchWriteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocument,
  QueryCommandInput,
  paginateScan,
  DynamoDBDocumentPaginationConfiguration,
} from "@aws-sdk/lib-dynamodb";
import { chunk } from "../../src/helpers/chunk.js";

const MAX_BATCH_UPDATE = 25; // 25 is the maximum number of items that can be deleted in a single batch

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

  // Get all task keys.  Scans entire table, may take a while

  const paginatorConfig: DynamoDBDocumentPaginationConfiguration = {
    client: docClient,
    pageSize: 25,
  };

  const taskKeys: { id: string; service: string }[] = [];

  let query: QueryCommandInput = {
    TableName: tableName,
  };
  if (serviceName && serviceName !== "all") {
    query = {
      TableName: tableName,
      FilterExpression: "service = :pk",
      ExpressionAttributeValues: {
        ":pk": serviceName,
      },
    };
  }

  const pager = paginateScan(paginatorConfig, query);

  for await (const result of pager) {
    if (result && result.Items) {
      taskKeys.push({
        id: result.Items[0].id,
        service: result.Items[0].service,
      });
    }
  }

  // Convert task keys to chunks of delete requests

  const deleteRequestChunks: object[][] = chunk(taskKeys, MAX_BATCH_UPDATE).map(
    (chunk) => {
      return chunk.map((taskKey) => {
        return {
          DeleteRequest: {
            Key: {
              id: taskKey.id,
              service: taskKey.service,
            },
          },
        };
      });
    }
  );

  // create and execute batch command for each chunk of items to delete

  deleteRequestChunks.forEach(async (deleteRequestChunk) => {
    const deleteRequest = {
      RequestItems: {
        [tableName]: deleteRequestChunk,
      },
    };
    const deleteCommand = new BatchWriteItemCommand(deleteRequest);
    await docClient.send(deleteCommand);
  });
}
