import LocalFileServer from "./base/util/localServer";

module.exports = async function (globalConfig, projectConfig) {
  const dstPath = "data/testing/output";
  const tempPort = 8001;

  // Set reference in order to use during teardown
  globalThis.__server__ = new LocalFileServer({
    path: dstPath,
    port: tempPort,
  });
};
