import { config } from "aws-sdk";
import { DocumentClient, ScanInput } from "aws-sdk/clients/dynamodb.js";
import { StackProps } from "aws-cdk-lib";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";

interface ClearCacheOptions {
  tableName: string;
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join("./", "package.json")).toString()
);

const geoprocessingJson = JSON.parse(
  fs.readFileSync(path.join("./", "geoprocessing.json")).toString()
);

export async function clearResults() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "tableName",
      message:
        "Name of the report function cache to clear. Enter 'all' to clear all cached reports:",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
    },
  ]);
  await clearCachedResults(answers);
}
async function checkForProjectName(
  err: AWS.AWSError,
  data: AWS.DynamoDB.DocumentClient.ScanOutput,
  serviceName: string,
  docClient: AWS.DynamoDB.DocumentClient,
  tableName: string
) {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "tableName",
      message:
        "Could not find dynamodb table named " +
        tableName +
        ". Enter the target project name:",
    },
  ]);
  let projectName = buildProjectName(answers.tableName);
  let scanParams: ScanInput = { TableName: projectName };
  if (serviceName !== "all") {
    scanParams = {
      TableName: projectName,
      FilterExpression: "service = :val",

      ExpressionAttributeValues: {
        //@ts-ignore
        ":val": serviceName,
      },
    };
  }
  docClient.scan(scanParams, (err, data) => {
    doScan(err, data, serviceName, docClient, projectName);
  });
}

//@ts-ignore
async function doScan(
  err: AWS.AWSError,
  data: AWS.DynamoDB.DocumentClient.ScanOutput,
  serviceName: string,
  docClient: AWS.DynamoDB.DocumentClient,
  tableName: string
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

        //@ts-ignore
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

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data

        if (typeof data.LastEvaluatedKey != "undefined") {
          let scanParams: ScanInput = { TableName: tableName };
          if (serviceName !== "all") {
            scanParams = {
              TableName: tableName,
              FilterExpression: "service = :val",

              ExpressionAttributeValues: {
                //@ts-ignore
                ":val": serviceName,
              },
            };
          }

          //@ts-ignore
          scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
          //@ts-ignore
          docClient.scan(scanParams, (err, data) => {
            doScan(err, data, serviceName, docClient, tableName);
          });
        }
      }
    } else {
      console.log("No cached results found for service:", serviceName);
    }
  }
}
function buildProjectName(projectName: string): string {
  return `gp-${projectName}-tasks`;
}
export async function clearCachedResults(options: ClearCacheOptions) {
  let serviceName = options.tableName;
  let projectName = packageJson.name;

  let regionName = geoprocessingJson.region;
  config.update({
    region: regionName,
  });

  let docClient = new DocumentClient();

  //let tableName = "gp-fsm-next-reports-tasks";
  let tableName = buildProjectName(projectName);

  let params: ScanInput = { TableName: tableName };
  if (serviceName !== "all") {
    params = {
      TableName: tableName,
      FilterExpression: "service = :val",

      ExpressionAttributeValues: {
        //@ts-ignore
        ":val": serviceName,
      },
    };
  }

  docClient.scan(params, (err, data) => {
    doScan(err, data, serviceName, docClient, tableName);
  });
}
interface GeoprocessingStackProps extends StackProps {
  tableName: string;
}
clearResults();
