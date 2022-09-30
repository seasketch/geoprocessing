module.exports = {
  name: "scripts",
  displayName: "GP Scripts",
  roots: ["."],
  testPathIgnorePatterns: ["/__test__/"],
  testEnvironment: "node",
  globalSetup: "./jest.setup.ts",
  globalTeardown: "./jest.teardown.ts",
};
