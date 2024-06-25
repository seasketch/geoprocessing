import dynamodb, { ScanInput } from "aws-sdk/clients/dynamodb.js";
import awsSdk from "aws-sdk";
import { doScan } from "./doScan.js";

import fs from "fs";
import path from "path";

const packageJson = JSON.parse(
  fs.readFileSync(path.join("./", "package.json")).toString()
);

const geoprocessingJson = JSON.parse(
  fs.readFileSync(path.join("./", "project", "geoprocessing.json")).toString()
);

export async function clearResults() {
  await clearCachedResults();
}

function buildTaskTableName(projectName: string): string {
  return `gp-${projectName}-tasks`;
}

export async function clearCachedResults() {
  let projectName = packageJson.name;

  let regionName = geoprocessingJson.region;
  awsSdk.config.update({
    region: regionName,
  });

  let docClient = new dynamodb.DocumentClient();

  let tableName = buildTaskTableName(projectName);

  let params: ScanInput = { TableName: tableName };

  docClient.scan(params, (err, data) => {
    doScan(err, data, docClient, tableName);
  });
}

clearResults();
