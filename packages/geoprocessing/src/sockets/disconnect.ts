//@ts-nocheck

const AWS = require("aws-sdk");
//import { DynamoDB } from "aws-sdk";
//import { APIGatewayProxyEvent } from "aws-lambda";

exports.disconnectHandler = async function (event, context) {
  try {
    let connectionId = event.requestContext.connectionId;
    console.info("trying to remove: ", connectionId);
    console.log("from table: ", process.env.SOCKETS_TABLE);
    const ddb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    const deleteParams = {
      TableName: process.env.SOCKETS_TABLE,
      Key: { connectionId },
    };
    //@ts-ignore
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    console.warn("ERRROR: ", JSON.stringify(err));
    return {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Disconnected." };
};
