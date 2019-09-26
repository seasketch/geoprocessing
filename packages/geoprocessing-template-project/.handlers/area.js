"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const area_1 = __importDefault(require("@turf/area"));
const serverless_geoprocessing_1 = require("@seasketch/serverless-geoprocessing");
const totalArea = (sketch, sum = 0) => {
    if (serverless_geoprocessing_1.isSeaSketchFeatureCollection(sketch)) {
        sum += totalArea(sketch);
    }
    else {
        sum += area_1.default(sketch);
    }
    return sum;
};
const area = (sketch) => {
    return {
        areaKm: totalArea(sketch) / 1000
    };
};
exports.default = area;
