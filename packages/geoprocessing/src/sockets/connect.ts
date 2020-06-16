//@ts-nocheck
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
//import * as AWS from "aws-sdk";

const AWS = require("aws-sdk");
// Set the region
//AWS.config.update({region: 'REGION'});

// Create the DynamoDB service object
//import { DynamoDB } from "aws-sdk";
AWS.config.update({ region: process.env.AWS_REGION });

exports.connectHandler = async function (event, context) {
  try {
    const ddb = new AWS.DynamoDB({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    const putParams = {
      TableName: process.env.SOCKETS_TABLE,
      Item: {
        connectionId: { S: event.requestContext.connectionId },
      },
    };

    //@ts-ignore
    await ddb.putItem(putParams).promise();
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
