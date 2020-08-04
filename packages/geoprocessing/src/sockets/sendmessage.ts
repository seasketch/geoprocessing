//@ts-nocheck
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License
//import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
//import { AWS } from "aws-sdk";
exports.sendHandler = async function (event, context) {
  console.warn("trying to send a message...");
  let AWS = require("aws-sdk");

  let cacheKey: string;
  let serviceName: string;
  let responses;
  let postData;
  console.info("trying to send now>>>> ", event.body);
  try {
    console.info("?????? --->>> parsing body data...>>>>  ", event.body);
    postData = JSON.parse(event.body).data;
    console.info("sending message now:::: ", postData);
    let eventData = JSON.parse(postData);
    console.info("parsed is:-> ", eventData);
    cacheKey = eventData["cacheKey"];
    serviceName = eventData["serviceName"];
    console.info("cachekey: ", cacheKey);
    console.info("servicename: ", serviceName);
    let connectionId = event.requestContext.connectionId;
    console.info("connection id--->>>>>>>>>  ", connectionId);
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

  console.info("---->>>> all -->> responses: ", responses);
  let endpoint =
    event.requestContext.domainName + "/" + event.requestContext.stage;
  console.log("endpoint to connect:-> ", endpoint);
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",

    endpoint: endpoint,
  });

  let postCalls = [];
  for (let responseItem of responses.Items) {
    console.info("response: ", responseItem);
    let d = {
      cacheKey: responseItem.cacheKey,
      serviceName: responseItem.serviceName,
    };
    if (
      responseItem.cacheKey === cacheKey &&
      responseItem.serviceName == serviceName
    ) {
      try {
        console.info("--->>>>> found a matching response item: ", responseItem);
        let postData = JSON.stringify(d);
        //let postCall;
        try {
          console.info(
            "sending finished message at ",
            new Date().toISOString()
          );
          await apigwManagementApi
            .postToConnection({
              ConnectionId: responseItem.connectionId,
              Data: postData,
            })
            .promise();
        } catch (e) {
          console.info(
            "couldnt send message to ",
            responseItem.connectionId,
            " it was closed? ",
            e
          );
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
              console.info("deleted stale connection...");
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

  //Promise.all(postCalls);

  return {
    statusCode: 200,
    body: "Data sent: " + JSON.parse(event.body).data,
  };
};
