// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

/**
 * Puts new socket connection record in DB
 */
export const connectHandler = async (event) => {
  try {
    if (!process.env.SUBSCRIPTIONS_TABLE)
      throw new Error("SUBSCRIPTIONS_TABLE is undefined");

    const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddb = DynamoDBDocument.from(dbClient);

    const serviceName = event.queryStringParameters["serviceName"];
    const cacheKey = event.queryStringParameters["cacheKey"];

    console.log("SUBSCRIPTIONS_TABLE", process.env.SUBSCRIPTIONS_TABLE);
    console.log("connectionId", event.requestContext.connectionId);
    console.log("serviceName", serviceName);
    console.log("cacheKey", cacheKey);

    await ddb.send(
      new PutCommand({
        TableName: process.env.SUBSCRIPTIONS_TABLE,
        Item: {
          connectionId: event.requestContext.connectionId,
          cacheKey: cacheKey,
          serviceName: serviceName,
        },
      })
    );
  } catch (err) {
    return {
      statusCode: 500,
      body:
        "Error with connect " +
        err +
        " ---> " +
        process.env.SUBSCRIPTIONS_TABLE +
        " ---> " +
        event.requestContext,
    };
  }

  return {
    statusCode: 200,
    body:
      process.env.SUBSCRIPTIONS_TABLE +
      " :: " +
      process.env.AWS_REGION +
      ":: " +
      JSON.stringify(event),
  };
};
