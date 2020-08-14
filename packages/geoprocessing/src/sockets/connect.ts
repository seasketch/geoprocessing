//@ts-nocheck
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
//import * as AWS from "aws-sdk";
//@ts-ignore
let AWS = require("aws-sdk");
//import { DynamoDB } from "aws-sdk";
//import { AWS } from "aws-sdk";

exports.connectHandler = async function (event, context) {
  try {
    const ddb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    let serviceName = event.queryStringParameters["serviceName"];
    let cacheKey = event.queryStringParameters["cacheKey"];

    const putParams = {
      TableName: process.env.SOCKETS_TABLE,
      Item: {
        connectionId: event.requestContext.connectionId,
        cacheKey: cacheKey,
        serviceName: serviceName,
      },
    };
    //@ts-ignore
    await ddb.put(putParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body:
        "Error with connect " +
        err +
        " ---> " +
        process.env.SOCKETS_TABLE +
        " ---> " +
        event.requestContext,
    };
  }

  return {
    statusCode: 200,
    body:
      process.env.SOCKETS_TABLE +
      " :: " +
      process.env.AWS_REGION +
      ":: " +
      JSON.stringify(event),
  };
};
