#!/usr/bin/env node
import runTests from "./testing/runner.js";
import { spawn } from "child_process";

if (process.argv.length < 3) {
  throw new Error("Missing command");
} else {
  const command = process.argv[2];
  switch (command) {
    case "test":
      runTests();
      break;
    case "init":
      spawn("node", [`${import.meta.dirname}/init/bin.js`, ...process.argv.slice(2)], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "init:testProjects":
      spawn(`${import.meta.dirname}/../../scripts/testing/initTestProjects.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "add:template":
      spawn("node", [`${import.meta.dirname}/template/addTemplate.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "import:data":
      spawn(`${import.meta.dirname}/../../scripts/dataPrep/import-data.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "reimport:data":
      spawn(
        `${import.meta.dirname}/../../scripts/dataPrep/reimport-data.sh`,
        process.argv.slice(2),
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "precalc:data":
      spawn(
        `${import.meta.dirname}/../../scripts/dataPrep/precalc-data.sh`,
        process.argv.slice(2),
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "precalc:data:clean":
      spawn(
        `${import.meta.dirname}/../../scripts/dataPrep/precalc-data-clean.sh`,
        process.argv.slice(2),
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "publish:data":
      spawn(
        `${import.meta.dirname}/../../scripts/dataPrep/publish-data.sh`,
        process.argv.slice(2),
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "create:function":
      spawn("node", [`${import.meta.dirname}/init/createFunction.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "create:client":
      spawn("node", [`${import.meta.dirname}/init/createClient.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "build:lambda":
      spawn(`${import.meta.dirname}/../../scripts/build/build.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "start:client":
      spawn(`${import.meta.dirname}/../../scripts/build/start-client.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "build:client":
      spawn(`${import.meta.dirname}/../../scripts/build/build-client.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "synth":
      spawn(`${import.meta.dirname}/../../scripts/deploy/synth.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "deploy":
      spawn(`${import.meta.dirname}/../../scripts/deploy/deploy.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "destroy":
      spawn(`${import.meta.dirname}/../../scripts/deploy/destroy.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "bootstrap":
      spawn(`${import.meta.dirname}/../../scripts/deploy/bootstrap.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "start-storybook":
      spawn(`${import.meta.dirname}/../../scripts/start-storybook.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "url":
      spawn(`${import.meta.dirname}/../../scripts/deploy/url.sh`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "bundle-features":
      spawn(
        "node",
        [`${import.meta.dirname}/dataPrep/bin.js`, ...process.argv.slice(2)],
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "bundle-rasters":
      spawn(
        "node",
        [`${import.meta.dirname}/dataPrep/bundleRasterData.js`, ...process.argv.slice(2)],
        {
          cwd: process.cwd(),
          stdio: "inherit",
        }
      );
      break;
    case "clear-results":
      spawn("node", [`${import.meta.dirname}/clear/clearResults.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "clear-all-results":
      spawn("node", [`${import.meta.dirname}/clear/clearAllResults.js`], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      break;
    case "data":
      spawn(
        "node",
        [`${import.meta.dirname}/dataPrep/data.js`, ...process.argv.slice(3)],
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
