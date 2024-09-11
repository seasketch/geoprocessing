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
    // console.log("event", JSON.stringify(event, null, 2));
    const eventData = JSON.parse(postData);
    // console.log("eventData", JSON.stringify(eventData, null, 2));

    if (!eventData.cacheKey) {
      throw new Error("Missing cacheKey in event body");
    }
    if (!eventData.serviceName) {
      throw new Error("Missing serviceName in event body");
    }

    cacheKey = eventData["cacheKey"];
    serviceName = eventData["serviceName"];
    failureMessage = eventData["failureMessage"];

    const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    ddb = DynamoDBDocument.from(dbClient);

    // console.log("eventData", JSON.stringify(eventData, null, 2));

    // Get all socket subscriptions
    responses = await ddb.send(
      new ScanCommand({
        TableName: process.env.SUBSCRIPTIONS_TABLE,
        ProjectionExpression: "serviceName, connectionId, cacheKey",
      }),
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
      `Search for socket connection returned no items for ${serviceName} service, cache key ${cacheKey}`,
    );
    return {
      statusCode: 500,
      body: "Server Error",
    };
  }

  const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

  // console.log("endpoint", endpoint);

  const apigwManagementApi = new ApiGatewayManagementApi({
    endpoint: endpoint,
  });

  interface ResultItem {
    cacheKey: string;
    serviceName: string;
    failureMessage?: string;
  }

  // Find subscription matching serviceName and cacheKey
  // Send connectionId from that subscription
  for (const responseItem of responses.Items) {
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
        const postData = JSON.stringify(resultItem);

        // console.log("connectionId", responseItem.connectionId);
        // console.log("data", postData);

        try {
          // Send socket message with cacheKey to clients listening so they can fetch result
          await apigwManagementApi.postToConnection({
            ConnectionId: responseItem.connectionId,
            Data: Buffer.from(postData),
          });
          // console.log("postResult", JSON.stringify(JSON.stringify(postResult)));
        } catch (e: any) {
          if (e.statusCode && e.statusCode === 410) {
            console.log(
              `Found stale connection, deleting ${responseItem.connectionId}`,
            );
            try {
              const command = new DeleteCommand({
                TableName: process.env.SUBSCRIPTIONS_TABLE,
                Key: {
                  connectionId: responseItem.connectionId,
                },
              });
              responses = await ddb.send(command);
            } catch {
              console.info("failed to delete stale connection...");
            }
          }
          console.log("postToConnection failed", e);
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
