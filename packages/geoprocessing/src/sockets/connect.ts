// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { DocumentClient } from "aws-sdk/clients/dynamodb";

/**
 * Puts new socket connection record in DB
 */
export const connectHandler = async (event) => {
  try {
    if (!process.env.SOCKETS_TABLE)
      throw new Error("SOCKETS_TABLE is undefined");

    const ddb = new DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    const serviceName = event.queryStringParameters["serviceName"];
    const cacheKey = event.queryStringParameters["cacheKey"];

    const putParams = {
      TableName: process.env.SOCKETS_TABLE,
      Item: {
        connectionId: event.requestContext.connectionId,
        cacheKey: cacheKey,
        serviceName: serviceName,
      },
    };
    await ddb.put(putParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body:
        "Error with connect " +
        err +
        " ---> " +
        process.env.SOCKETS_TABLE +
        " ---> " +
        event.requestContext,
    };
  }

  return {
    statusCode: 200,
    body:
      process.env.SOCKETS_TABLE +
      " :: " +
      process.env.AWS_REGION +
      ":: " +
      JSON.stringify(event),
  };
};
