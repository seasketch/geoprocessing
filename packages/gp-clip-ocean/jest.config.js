module.exports = {
  roots: ["src/"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
};
