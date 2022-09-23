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
      spawn("node", [`${__dirname}/init/bin.js`, ...process.argv.slice(2)], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "init:testProjects":
      spawn(`${__dirname}/../../scripts/testing/initTestProjects.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "add:template":
      spawn("node", [`${__dirname}/template/addTemplate.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "import:data":
      spawn(`${__dirname}/../../scripts/dataPrep/import-data.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
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
    case "start:client":
      spawn(`${__dirname}/../../scripts/build/start-client.sh`, {
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
    case "synth":
      spawn(`${__dirname}/../../scripts/deploy/synth.sh`, {
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
    case "destroy":
      spawn(`${__dirname}/../../scripts/deploy/destroy.sh`, {
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
    case "start-storybook":
      spawn(`${__dirname}/../../scripts/start-storybook.sh`, {
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
      break;
    case "bundle-rasters":
      spawn(
        "node",
        [`${__dirname}/dataPrep/bundleRasterData.js`, ...process.argv.slice(2)],
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "clear-results":
      spawn("node", [`${__dirname}/clear/clearResults.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "clear-all-results":
      spawn("node", [`${__dirname}/clear/clearAllResults.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "data":
      spawn(
        "node",
        [`${__dirname}/dataPrep/data.js`, ...process.argv.slice(3)],
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    default:
      throw new Error(`Command ${command} not supported.`);
  }
}
