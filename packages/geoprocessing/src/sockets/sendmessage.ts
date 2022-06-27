// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License

import { ApiGatewayManagementApi, AWSError } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";

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
  let ddb: DocumentClient;
  let responses: PromiseResult<DocumentClient.ScanOutput, AWSError>;

  if (!process.env.SUBSCRIPTIONS_TABLE)
    throw new Error("SUBSCRIPTIONS_TABLE is undefined");

  try {
    postData = JSON.parse(event.body).data;
    const eventData = JSON.parse(postData);
    cacheKey = eventData["cacheKey"];
    serviceName = eventData["serviceName"];
    failureMessage = eventData["failureMessage"];

    ddb = new DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    responses = await ddb
      .scan({
        TableName: process.env.SUBSCRIPTIONS_TABLE,
        ProjectionExpression: "serviceName, connectionId, cacheKey",
      })
      .promise();
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
    apiVersion: "2018-11-29",
    endpoint: endpoint,
  });

  interface ResultItem {
    cacheKey: any;
    serviceName: any;
    failureMessage?: string;
  }

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
          await apigwManagementApi
            .postToConnection({
              ConnectionId: responseItem.connectionId,
              Data: postData,
            })
            .promise();
        } catch (e: any) {
          if (e.statusCode && e.statusCode === 410) {
            console.log(
              `Found stale connection, deleting ${responseItem.connectionId}`
            );
            try {
              await ddb
                .delete({
                  //@ts-ignore
                  TableName: process.env.SUBSCRIPTIONS_TABLE,
                  Key: {
                    connectionId: responseItem.connectionId,
                  },
                })
                .promise();
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
