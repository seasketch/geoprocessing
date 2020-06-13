// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";

const ddb = new DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

exports.handler = async (event: APIGatewayProxyEvent) => {
  let connectionData;

  if (process.env.SOCKETS_TABLE) {
    try {
      connectionData = await ddb
        .scan({
          TableName: process.env.SOCKETS_TABLE,
          ProjectionExpression: "connectionId",
        })
        .promise();
    } catch (e) {
      return { statusCode: 500, body: e.stack };
    }

    const apigwManagementApi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint:
        event.requestContext.domainName + "/" + event.requestContext.stage,
    });
    if (event.body) {
      const postData = JSON.parse(event.body).data;

      const postCalls = connectionData?.Items?.map(async ({ connectionId }) => {
        try {
          await apigwManagementApi
            .postToConnection({ ConnectionId: connectionId, Data: postData })
            .promise();
        } catch (e) {
          if (e.statusCode === 410) {
            console.log(`Found stale connection, deleting ${connectionId}`);
            await ddb
              .delete({
                //@ts-ignore
                TableName: process.env.SOCKETS_TABLE,
                Key: { connectionId },
              })
              .promise();
          } else {
            throw e;
          }
        }
      });
      if (postCalls) {
        try {
          //@ts-ignore
          //TODO: check this, why is it unhappy with postCalls
          await Promise.all(postCalls);
        } catch (e) {
          return { statusCode: 500, body: e.stack };
        }
      }
    }

    return { statusCode: 200, body: "Data sent." };
  } else {
    return { statusCode: 200, body: "No table name in env" };
  }
};
