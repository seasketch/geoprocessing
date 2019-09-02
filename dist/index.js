"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geometry_1 = require("./src/geometry");
exports.isSeaSketchFeature = geometry_1.isSeaSketchFeature;
exports.isSeaSketchFeatureCollection = geometry_1.isSeaSketchFeatureCollection;
// @ts-ignore
const internals_1 = __importDefault(require("./src/plugin/internals"));
exports.pluginInternals = internals_1.default;
// module.exports = plugin;
