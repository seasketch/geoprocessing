//@ts-nocheck
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-route-keys-connect-disconnect.html
// The $disconnect route is executed after the connection is closed.
// The connection can be closed by the server or by the client. As the connection is already closed when it is executed,
// $disconnect is a best-effort event.
// API Gateway will try its best to deliver the $disconnect event to your integration, but it cannot guarantee delivery.

i; //mport * as AWS from "aws-sdk";
const AWS = require("aws-sdk");
//import { DynamoDB } from "aws-sdk";
//import { APIGatewayProxyEvent } from "aws-lambda";

exports.disconnectHandler = async function (event, context) {
  try {
    const ddb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });
    let connectionId = event.requestContext.connectionId;
    const deleteParams = {
      TableName: process.env.SOCKET_TABLE,
      Key: { connectionId },
    };
    //@ts-ignore
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Disconnected." };
};
