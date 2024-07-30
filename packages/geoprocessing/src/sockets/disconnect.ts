// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Removes socket connection record from DB given connectionId
 */
export const disconnectHandler = async (event) => {
  if (!process.env.SUBSCRIPTIONS_TABLE)
    throw new Error("SUBSCRIPTIONS_TABLE is undefined");

  console.warn("trying to disconnect");

  try {
    const connectionId = event.requestContext.connectionId;

    const dbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const ddb = DynamoDBDocumentClient.from(dbClient);

    const deleteParams = {
      TableName: process.env.SUBSCRIPTIONS_TABLE,
      Key: {
        connectionId: connectionId,
      },
    };

    const command = new DeleteCommand(deleteParams);
    await ddb.send(command);
  } catch (err) {
    console.warn(": error trying to disconnect: ", JSON.stringify(err));
    return { statusCode: 200, body: "Disconnected." };
  }

  return { statusCode: 200, body: "Disconnected." };
};
