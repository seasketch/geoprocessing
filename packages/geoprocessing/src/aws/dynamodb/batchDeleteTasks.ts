import {
  BatchWriteCommandInput,
  DynamoDBDocument,
} from "@aws-sdk/lib-dynamodb";
import { batchDelete } from "./batchDelete.js";

export type TaskKey = { id: string; service: string };

/**
 * Batch delete array of tasks
 */
export async function batchDeleteTasks(
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

  await batchDelete(docClient, tableName, deleteRequest, 0, 10);
}
