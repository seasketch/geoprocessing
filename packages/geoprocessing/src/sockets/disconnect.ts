//@ts-nocheck

exports.disconnectHandler = async function (event, context) {
  console.warn("trying to disconnect");
  let AWS = require("aws-sdk");

  try {
    let connectionId = event.requestContext.connectionId;

    const ddb = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10",
      region: process.env.AWS_REGION,
    });

    const deleteParams = {
      TableName: process.env.SOCKETS_TABLE,
      Key: {
        connectionId: connectionId,
      },
    };
    //@ts-ignore
    await ddb.delete(deleteParams).promise();
  } catch (err) {
    console.warn(": error trying to disconnect: ", JSON.stringify(err));
    return { statusCode: 200, body: "Disconnected." };
  }

  return { statusCode: 200, body: "Disconnected." };
};
