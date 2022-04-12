// Based on https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
// and https://kulshekhar.github.io/ts-jest/docs/guides/esm-support

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ["lib/"],
  preset: "ts-jest",
  // globals: {
  //   "ts-jest": {
  //     useESM: true,
  //   },
  // },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  transform: {},
};
