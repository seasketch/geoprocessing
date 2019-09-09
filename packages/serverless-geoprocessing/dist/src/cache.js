"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function CacheModel(TableName, db) {
    return {
        get: async (cacheKey) => {
            return;
        }
    };
}
exports.default = CacheModel;
;
exports.hash = (geojson) => {
    return crypto_1.default
        .createHash("md5")
        .update(JSON.stringify(geojson))
        .digest("hex");
};
exports.makeCacheKey = (geojson, propNames = ["updatedAt"]) => {
    const filteredProperties = {};
    if (geojson.properties && filteredProperties) {
        for (const key in geojson.properties) {
            if (propNames.indexOf(key) !== -1) {
                filteredProperties[key] = geojson.properties[key];
            }
        }
    }
    return exports.hash({
        ...geojson,
        properties: filteredProperties
    });
};
