import * as core from "@aws-cdk/core";

import fs from "fs";
import path from "path";
import { Manifest } from "../manifest";
import dynamodb = require("@aws-cdk/aws-dynamodb");
import slugify from "slugify";
import inquirer from "inquirer";
import * as AWS from "aws-sdk";
import { ScanInput } from "aws-sdk/clients/dynamodb";

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
  await clearCachedResults();
}

//@ts-ignore
async function doScan(
  err: AWS.AWSError,
  data: AWS.DynamoDB.DocumentClient.ScanOutput,
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

          //@ts-ignore
          scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
          //@ts-ignore
          docClient.scan(scanParams, (err, data) => {
            doScan(err, data, docClient, tableName);
          });
        }
      }
    } else {
      console.log("No cached results found for all services");
    }
  }
}
function buildProjectName(projectName: string): string {
  return `gp-${projectName}-tasks`;
}
export async function clearCachedResults() {
  let projectName = packageJson.name;

  let regionName = geoprocessingJson.region;
  AWS.config.update({
    region: regionName,
  });

  let docClient = new AWS.DynamoDB.DocumentClient();

  //let tableName = "gp-fsm-next-reports-tasks";
  let tableName = buildProjectName(projectName);

  let params: ScanInput = { TableName: tableName };

  docClient.scan(params, (err, data) => {
    doScan(err, data, docClient, tableName);
  });
}
interface GeoprocessingStackProps extends core.StackProps {
  tableName: string;
}
clearResults();
