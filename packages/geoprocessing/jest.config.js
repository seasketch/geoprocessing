module.exports = {
  name: "core",
  displayName: "GP Core",
  preset: "@shelf/jest-dynamodb",
  roots: ["src/"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/templates/"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  runner: "groups",
};
