import LocalFileServer from "./scripts/base/util/localServer.js";
import DynamoDbLocal from "dynamodb-local";

const dynamoPort = 8000;
const fileServerPort = 8001;

let fileServer: LocalFileServer;

export async function setup() {
  const dstPath = "../data/out";

  console.log(
    `Starting file server on port ${fileServerPort} to serve test files from data/out`
  );
  // Set reference in order to use during teardown
  fileServer = new LocalFileServer({
    path: dstPath,
    port: fileServerPort,
  });

  console.log(`Starting DynamoDb service on port ${dynamoPort}`);
  await DynamoDbLocal.launch(dynamoPort, null, ["-sharedDb"]);
}
export async function teardown() {
  if (fileServer) {
    console.log("Shutting down file server");
    fileServer.close();
  }
  DynamoDbLocal.stop(dynamoPort);
  console.log("Shutting down dynamodb service");
}
