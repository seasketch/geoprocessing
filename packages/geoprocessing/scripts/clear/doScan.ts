import dynamodb, { ScanInput } from "aws-sdk/clients/dynamodb.js";
import { AWSError } from "aws-sdk";

export async function doScan(
  err: AWSError,
  data: dynamodb.DocumentClient.ScanOutput,
  docClient: dynamodb.DocumentClient,
  tableName: string,
  serviceName?: string
) {
  if (err) {
    console.error(
      "Error: Unable to scan the table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    if (data?.Items !== undefined && data?.Items?.length > 0) {
      for (const d of data?.Items) {
        let deleteParams = {
          TableName: tableName,
          Key: {
            id: d.id,
            service: d.service,
          },
        };

        docClient.delete(deleteParams, (err, data) => {
          if (err) {
            console.error(
              "Unable to delete item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
          } else {
            console.log("Deleted results for ", d.service);
          }
        });

        // continue scanning if we have more, because
        // scan can retrieve a maximum of 1MB of data

        if (typeof data.LastEvaluatedKey != "undefined") {
          let scanParams: ScanInput = { TableName: tableName };
          if (serviceName && serviceName !== "all") {
            scanParams = {
              TableName: tableName,
              FilterExpression: "service = :val",

              ExpressionAttributeValues: {
                //@ts-ignore
                ":val": serviceName,
              },
            };
          }

          scanParams.ExclusiveStartKey = data.LastEvaluatedKey;

          docClient.scan(scanParams, (err, data) => {
            doScan(err, data, docClient, tableName, serviceName);
          });
        }
      }
    } else {
      console.log(
        `No cached results found ${serviceName ? "for service " + serviceName : ""}`
      );
    }
  }
}
