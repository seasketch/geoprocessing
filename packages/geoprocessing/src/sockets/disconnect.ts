// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

/**
 * Clear socket connection record in DB given connectionId
 */
export const disconnectHandler = async (event) => {
  if (!process.env.SUBSCRIPTIONS_TABLE)
    throw new Error("SUBSCRIPTIONS_TABLE is undefined");

  console.warn("trying to disconnect");

  try {
    const connectionId = event.requestContext.connectionId;

    const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddb = DynamoDBDocument.from(dbClient);

    await ddb.send(
      new DeleteCommand({
        TableName: process.env.SUBSCRIPTIONS_TABLE,
        Key: {
          connectionId: connectionId,
        },
      }),
    );
  } catch (err) {
    console.warn(": error trying to disconnect: ", JSON.stringify(err));
    return { statusCode: 200, body: "Disconnected." };
  }

  return { statusCode: 200, body: "Disconnected." };
};
