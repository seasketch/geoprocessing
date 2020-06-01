import * as core from "@aws-cdk/core";

import fs from "fs";
import path from "path";
import { Manifest } from "../manifest";
import dynamodb = require("@aws-cdk/aws-dynamodb");
import slugify from "slugify";
import inquirer from "inquirer";
import * as AWS from "aws-sdk";
/*
if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH env var not specified");
}*/

//const PROJECT_PATH = process.env.PROJECT_PATH;
interface ClearCacheOptions {
  tableName: string;
}
/*
const manifest: Manifest = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
);*/

export async function clearResults() {
  console.log("clearing now!!!!");
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "tableName",
      message: "Name of the report function cache to clear",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
    },
  ]);
  await clearCachedResults(answers);
}

//@ts-ignore
async function doScan(err, data, funcName, docClient) {
  if (err) {
    console.error(
      "Unable to scan the table. Error JSON:",
      JSON.stringify(err, null, 2)
    );
  } else {
    // print all the movies
    console.log("Scan succeeded.");
    //@ts-ignore
    data.Items.forEach(function (value) {
      console.log(value);
    });
    for (const d of data.Items) {
      console.log("d: ", d.id);
      let deleteParams = {
        TableName: "gp-fsm-next-reports-tasks",
        Key: {
          id: d.id,
        },
      };
      console.log("Attempting a conditional delete of id ", d);
      console.log("with delete params: ", deleteParams);

      //@ts-ignore
      docClient.delete(deleteParams, (err, data) => {
        if (err) {
          console.error(
            "Unable to delete item. Error JSON:",
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
      });

      // continue scanning if we have more movies, because
      // scan can retrieve a maximum of 1MB of data
      /*
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        //@ts-ignore
        deleteParams.ExclusiveStartKey = data.LastEvaluatedKey;
        //@ts-ignore
        docClient.scan(deleteParams, (err, data) => {
          doScan(err, data, funcName, docClient);
        });
      }
      */
      //TODO: add this back in?
    }
  }
}
export async function clearCachedResults(options: ClearCacheOptions) {
  console.log("options: ", options);
  let tableName = options.tableName;

  AWS.config.update({
    region: "us-west-2",
  });

  let docClient = new AWS.DynamoDB.DocumentClient();

  let table = "gp-fsm-next-reports-tasks";
  var params = {
    TableName: table,
    FilterExpression: "service = :val",

    ExpressionAttributeValues: {
      ":val": tableName,
    },
  };
  docClient.scan(params, (err, data) => {
    console.log("doing scan with tableName ", tableName);
    doScan(err, data, tableName, docClient);
  });

  /*
  //const projectName = manifest.title;
  const region = "us-west-2";
  //const stackName = `${projectName}-geoprocessing-stack`;

  const app = new core.App();
  const stack = new GeoprocessingCdkStack(app, {
    env: { region },
    tableName: tableName,
  });
  //core.Tag.add(stack, "Author", slugify(manifest.author.replace(/\<.*\>/, "")));
  core.Tag.add(stack, "Cost Center", "seasketch-geoprocessing");
  //core.Tag.add(stack, "Geoprocessing Project", manifest.title);
  stack;
  */
}
interface GeoprocessingStackProps extends core.StackProps {
  tableName: string;
}

class GeoprocessingCdkStack extends core.Stack {
  constructor(scope: core.App, props: GeoprocessingStackProps) {
    super(scope, undefined, props);
    let funcName = props.tableName;

    // dynamodb
    const tasksTbl = new dynamodb.Table(this, `gp-${funcName}-tasks`, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "service", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${funcName}-tasks`,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}
clearResults();
