// Based on https://kulshekhar.github.io/ts-jest/docs/getting-started/installation
// and https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
// d3 esm export workaround see https://github.com/facebook/jest/issues/12036 to use umd

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  roots: ["lib/"],
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    d3: "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  testEnvironment: "node",
  transform: {},
};
