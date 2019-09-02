"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("../handlers");
let settings;
let func;
exports.handler = handlers_1.lambdaService(func, settings);
