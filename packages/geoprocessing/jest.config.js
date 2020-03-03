module.exports = {
  preset: "@shelf/jest-dynamodb",
  roots: ["src/"],
  testEnvironment: "jsdom",
  setupFiles: ["./setupJest.js"]
};
