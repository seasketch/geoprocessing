// Based on https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
// and https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
// d3 esm export workaround see https://github.com/facebook/jest/issues/12036 to use umd

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["lib/"],
  preset: "ts-jest",
  // globals: {
  //   "ts-jest": {
  //     useESM: true,
  //     tsconfig: {
  //       allowJs: true,
  //     },
  //   },
  // },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    d3: "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  testEnvironment: "node",
  transform: {},
  // transform: {
  //   "^.+\\.[tj]s$": "ts-jest",
  // },
  // transformIgnorePatterns: [
  //   "<rootDir>/node_modules/(?!@seasketch/heatmap-core)",
  // ],
};
