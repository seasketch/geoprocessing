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

export async function clearResults() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "tableName",
      message:
        "Name of the report function cache to clear. Enter 'all' to clear all cached reports",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
    },
  ]);
  await clearCachedResults(answers);
}

//@ts-ignore
async function doScan(err, data, serviceName, docClient, tableName) {
  if (err) {
    if (err.message === "Requested resource not found") {
      console.error("Error: Could not find table named ", tableName);
    } else {
      console.error(
        "Error: Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    }
  } else {
    if (data === undefined || data.length === 0) {
      console.log("no cached results for ", serviceName);
      return;
    }
    for (const d of data.Items) {
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
          console.log("Deleted results for ", serviceName);
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
        console.log("Scanning for more...");
        //@ts-ignore
        scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
        //@ts-ignore
        docClient.scan(scanParams, (err, data) => {
          doScan(err, data, serviceName, docClient, tableName);
        });
      }
      //TODO: add this back in?
    }
  }
}
export async function clearCachedResults(options: ClearCacheOptions) {
  let serviceName = options.tableName;
  let projectName = packageJson.name;
  console.log("projectName: ", projectName);
  AWS.config.update({
    region: "us-west-2",
  });

  let docClient = new AWS.DynamoDB.DocumentClient();

  //let tableName = "gp-fsm-next-reports-tasks";
  let tableName = `gp-${projectName}-tasks`;
  console.log("table name: ", tableName);
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
    if (data === undefined || data?.Items?.length === 0) {
      console.log("No cached service results found for", serviceName);
    }

    doScan(err, data, serviceName, docClient, tableName);
  });
}
interface GeoprocessingStackProps extends core.StackProps {
  tableName: string;
}
clearResults();
