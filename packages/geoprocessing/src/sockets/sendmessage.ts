//@ts-nocheck
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License
//import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
//import { AWS } from "aws-sdk";
exports.sendHandler = async function (event, context) {
  let AWS = require("aws-sdk");

  let cacheKey: string;
  let serviceName: string;
  let failureMessage: string;
  let responses;
  let postData;
  try {
    postData = JSON.parse(event.body).data;
    let eventData = JSON.parse(postData);
    cacheKey = eventData["cacheKey"];
    serviceName = eventData["serviceName"];
    failureMessage = eventData["failureMessage"];
    let connectionId = event.requestContext.connectionId;
    //@ts-ignore
    ddb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });
    //@ts-ignore
    responses = await ddb
      .scan({
        TableName: process.env.SOCKETS_TABLE,
        ProjectionExpression: "serviceName, connectionId, cacheKey",
      })
      .promise();
  } catch (e) {
    console.warn("error getting values: ", e);
    return { statusCode: 500, body: "PROBLEM::::::" + e.stack };
  }

  let endpoint =
    event.requestContext.domainName + "/" + event.requestContext.stage;

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",

    endpoint: endpoint,
  });

  for (let responseItem of responses.Items) {
    let d = {
      cacheKey: responseItem.cacheKey,
      serviceName: responseItem.serviceName,
    };
    if (failureMessage) {
      d.failureMessage = failureMessage;
    }
    if (
      responseItem.cacheKey === cacheKey &&
      responseItem.serviceName == serviceName
    ) {
      try {
        let postData = JSON.stringify(d);

        try {
          await apigwManagementApi
            .postToConnection({
              ConnectionId: responseItem.connectionId,
              Data: postData,
            })
            .promise();
        } catch (e) {
          if (e.statusCode === 410) {
            console.log(
              `Found stale connection, deleting ${responseItem.connectionId}`
            );
            try {
              await ddb
                .delete({
                  //@ts-ignore
                  TableName: process.env.SOCKETS_TABLE,
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
