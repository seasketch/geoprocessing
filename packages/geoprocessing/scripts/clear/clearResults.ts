import awsSdk from "aws-sdk";
import dynamodb, { ScanInput } from "aws-sdk/clients/dynamodb.js";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { doScan } from "./doScan.js";

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

function buildTableName(projectName: string): string {
  return `gp-${projectName}-tasks`;
}

export async function clearCachedResults(options: ClearCacheOptions) {
  let serviceName = options.tableName;
  let projectName = packageJson.name;

  let regionName = geoprocessingJson.region;
  awsSdk.config.update({
    region: regionName,
  });

  let docClient = new dynamodb.DocumentClient();

  //let tableName = "gp-fsm-next-reports-tasks";
  let tableName = buildTableName(projectName);

  let params: ScanInput = { TableName: tableName };
  if (serviceName !== "all") {
    params = {
      TableName: tableName,
      FilterExpression: "service = :val",

      ExpressionAttributeValues: {
        ":val": { S: serviceName },
      },
    };
  }

  docClient.scan(params, (err, data) => {
    doScan(err, data, docClient, tableName, serviceName);
  });
}

clearResults();
