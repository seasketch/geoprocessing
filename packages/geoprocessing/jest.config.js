module.exports = {
  preset: "@shelf/jest-dynamodb",
  roots: ["src/"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/templates/"],
};
