#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = __importDefault(require("../src/testing/runner"));
const init_1 = require("./init");
const createFunction_1 = require("./createFunction");
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
            createFunction_1.createFunction();
        default:
            throw new Error(`Command ${command} not supported.`);
            break;
    }
}
//# sourceMappingURL=geoprocessing.js.map