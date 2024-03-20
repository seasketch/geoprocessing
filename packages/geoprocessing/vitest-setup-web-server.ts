import LocalFileServer from "./scripts/base/util/localServer.js";

let server: LocalFileServer;

export async function setup() {
  const dstPath = "../data/out";
  const tempPort = 8001;

  console.log(
    `Starting file server on port ${tempPort} to serve test files from data/out`
  );
  // Set reference in order to use during teardown
  server = new LocalFileServer({
    path: dstPath,
    port: tempPort,
  });
}
export async function teardown() {
  if (server) {
    console.log("Shutting down file server");
    server.close();
  }
}
