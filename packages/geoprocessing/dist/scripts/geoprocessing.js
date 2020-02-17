#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = __importDefault(require("./testing/runner"));
const init_1 = require("./init/init");
const child_process_1 = require("child_process");
if (process.argv.length < 3) {
    throw new Error("Missing command");
}
else {
    const command = process.argv[2];
    switch (command) {
        case "test":
            runner_1.default();
            break;
        case "init":
            init_1.init();
            break;
        case "create:function":
            child_process_1.spawn("node", [`${__dirname}/init/createFunction.js`], {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        case "create:client":
            child_process_1.spawn("node", [`${__dirname}/init/createClient.js`], {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        case "build:lambda":
            child_process_1.spawn(`${__dirname}/../../scripts/build/build.sh`, {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        case "build:client":
            child_process_1.spawn(`${__dirname}/../../scripts/build/build-client.sh`, {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        case "deploy":
            child_process_1.spawn(`${__dirname}/../../scripts/deploy/deploy.sh`, {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        case "bootstrap":
            child_process_1.spawn(`${__dirname}/../../scripts/deploy/bootstrap.sh`, {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        case "storybook":
            child_process_1.spawn(`${__dirname}/../../scripts/storybook.sh`, {
                cwd: process.cwd(),
                stdio: "inherit"
            });
            break;
        default:
            throw new Error(`Command ${command} not supported.`);
            break;
    }
}
//# sourceMappingURL=geoprocessing.js.map