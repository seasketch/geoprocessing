import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocument,
} from "@aws-sdk/lib-dynamodb";
import { wait } from "../../../src/helpers/wait.js";

export async function batchDelete(
  docClient: DynamoDBDocument,
  tableName: string,
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
        tableName,
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
      await batchDelete(
        docClient,
        tableName,
        deleteCommandInput,
        0,
        maxRetries
      );
    } else {
      throw new Error(e);
    }
  }
}
