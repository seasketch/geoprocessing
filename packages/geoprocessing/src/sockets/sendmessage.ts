// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License

import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocument,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

/**
 * Posts message to socket connection
 * Assumes socket connection already exists for given cacheKey
 * If connectionId found for cacheKey and post to socket fails, assumes stale and clears from DB
 */
export const sendHandler = async (event) => {
  let cacheKey: string;
  let serviceName: string;
  let failureMessage: string;
  let postData;
  let ddb: DynamoDBDocument;
  let responses: ScanCommandOutput;

  if (!process.env.SUBSCRIPTIONS_TABLE)
    throw new Error("SUBSCRIPTIONS_TABLE is undefined");

  try {
    postData = JSON.parse(event.body).data;
    const eventData = JSON.parse(postData);
    cacheKey = eventData["cacheKey"];
    serviceName = eventData["serviceName"];
    failureMessage = eventData["failureMessage"];

    const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    ddb = DynamoDBDocument.from(dbClient);

    console.log("eventData", JSON.stringify(eventData, null, 2));

    // Get all socket subscriptions
    responses = await ddb.send(
      new ScanCommand({
        TableName: process.env.SUBSCRIPTIONS_TABLE,
        ProjectionExpression: "serviceName, connectionId, cacheKey",
      })
    );
  } catch (e: unknown) {
    console.warn("Error finding socket connection: ", e);
    return {
      statusCode: 500,
      body: "Server Error" + (e instanceof Error ? ` - ${e.stack}` : ""),
    };
  }

  if (!responses || !responses.Items) {
    console.warn(
      `Search for socket connection returned no items for ${serviceName} service, cache key ${cacheKey}`
    );
    return {
      statusCode: 500,
      body: "Server Error",
    };
  }

  let endpoint =
    event.requestContext.domainName + "/" + event.requestContext.stage;

  const apigwManagementApi = new ApiGatewayManagementApi({
    endpoint: endpoint,
  });

  interface ResultItem {
    cacheKey: any;
    serviceName: any;
    failureMessage?: string;
  }

  console.log("items", JSON.stringify(responses.Items, null, 2));

  for (let responseItem of responses.Items) {
    const resultItem: ResultItem = {
      cacheKey: responseItem.cacheKey,
      serviceName: responseItem.serviceName,
    };
    if (failureMessage) {
      resultItem.failureMessage = failureMessage;
    }
    if (
      responseItem.cacheKey === cacheKey &&
      responseItem.serviceName == serviceName
    ) {
      try {
        let postData = JSON.stringify(resultItem);

        try {
          await apigwManagementApi.postToConnection({
            ConnectionId: responseItem.connectionId,
            Data: postData,
          });
        } catch (e: any) {
          if (e.statusCode && e.statusCode === 410) {
            console.log(
              `Found stale connection, deleting ${responseItem.connectionId}`
            );
            try {
              const command = new DeleteCommand({
                TableName: process.env.SUBSCRIPTIONS_TABLE,
                Key: {
                  connectionId: responseItem.connectionId,
                },
              });
              responses = await ddb.send(command);
            } catch (e) {
              console.info("failed to delete stale connection...");
            }
          }
        }
      } catch (e) {
        console.info("blowing up with send message: ", e);
      }
    }
  }

  return {
    statusCode: 200,
    body: "Data sent: " + JSON.parse(event.body).data,
  };
};
