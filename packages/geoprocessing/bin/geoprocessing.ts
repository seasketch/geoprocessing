#!/usr/bin/env node
import runTests from "../src/testing/runner";
import { init } from "./init";
import { createFunction } from "./createFunction";

if (process.argv.length < 3) {
  throw new Error("Missing command");
} else {
  const command = process.argv[2];
  switch (command) {
    case "test":
      runTests();
      break;
    case "init":
      init();
      break;
    case "create:function":
      createFunction();
    default:
      throw new Error(`Command ${command} not supported.`);
      break;
  }
}
