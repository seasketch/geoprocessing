module.exports = async function (globalConfig, projectConfig) {
  // Set reference in order to use during teardown
  globalThis.__server__.close();
};
