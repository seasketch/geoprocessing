#!/usr/bin/env node
import runTests from "./testing/runner";
import { init } from "./init/init";
import { spawn, exec } from "child_process";

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
      spawn("node", [`${__dirname}/init/createFunction.js`], {
        cwd: process.cwd(),
        stdio: "inherit"
      });
      break;
    case "build":
      spawn(`${__dirname}/../../scripts/build/build.sh`, {
        cwd: process.cwd(),
        stdio: "inherit"
      });
      break;
    case "deploy":
      spawn(`${__dirname}/../../scripts/deploy/deploy.sh`, {
        cwd: process.cwd(),
        stdio: "inherit"
      });
      break;
    case "bootstrap":
      spawn(`${__dirname}/../../scripts/deploy/bootstrap.sh`, {
        cwd: process.cwd(),
        stdio: "inherit"
      });
      break;
    default:
      throw new Error(`Command ${command} not supported.`);
      break;
  }
}
