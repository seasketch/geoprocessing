#!/usr/bin/env node
import runTests from "./testing/runner";
import { init } from "./init/init";
import { spawn, exec } from "child_process";

// TODO: Need a command for clearing results

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
        stdio: "inherit",
      });
      break;
    case "create:client":
      spawn("node", [`${__dirname}/init/createClient.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "build:lambda":
      spawn(`${__dirname}/../../scripts/build/build.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "build:client":
      spawn(`${__dirname}/../../scripts/build/build-client.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "deploy":
      spawn(`${__dirname}/../../scripts/deploy/deploy.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "bootstrap":
      spawn(`${__dirname}/../../scripts/deploy/bootstrap.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "storybook":
      spawn(`${__dirname}/../../scripts/storybook.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "url":
      spawn(`${__dirname}/../../scripts/deploy/url.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "bundle-features":
      spawn(
        "node",
        [`${__dirname}/dataPrep/bin.js`, ...process.argv.slice(2)],
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
    case "clear-results":
      spawn("node", [`${__dirname}/clear/clearResults.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    default:
      throw new Error(`Command ${command} not supported.`);
  }
}
