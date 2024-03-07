module.exports = {
  // name: "core",
  displayName: "GP Core",
  preset: "@shelf/jest-dynamodb",
  roots: ["src/"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  runner: "groups",
  transform: {},
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testPathIgnorePatterns: [],
  verbose: true,
};
