// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DocumentClient } from "aws-sdk/clients/dynamodb";

/**
 * Removes socket connection record from DB given connectionId
 */
export const disconnectHandler = async (event) => {
  if (!process.env.SUBSCRIPTIONS_TABLE)
    throw new Error("SUBSCRIPTIONS_TABLE is undefined");

  console.warn("trying to disconnect");

  try {
    const connectionId = event.requestContext.connectionId;

    const ddb = new DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    const deleteParams = {
      TableName: process.env.SUBSCRIPTIONS_TABLE,
      Key: {
        connectionId: connectionId,
      },
    };
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    console.warn(": error trying to disconnect: ", JSON.stringify(err));
    return { statusCode: 200, body: "Disconnected." };
  }

  return { statusCode: 200, body: "Disconnected." };
};
