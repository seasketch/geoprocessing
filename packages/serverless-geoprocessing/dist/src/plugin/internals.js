"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Internal API accessible to geoprocessing function implementations
const tasks_1 = __importDefault(require("../tasks"));
const geometry_1 = require("../geometry");
exports.default = {
    TaskModel: tasks_1.default,
    fetchGeoJSON: geometry_1.fetchGeoJSON
};
