// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";

const ddb = new DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

exports.handler = async (event: APIGatewayProxyEvent) => {
  const putParams = {
    TableName: process.env.SOCKETS_TABLE,
    Item: {
      connectionId: event.requestContext.connectionId,
    },
  };

  try {
    //@ts-ignore
    await ddb.put(putParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Connected." };
};
