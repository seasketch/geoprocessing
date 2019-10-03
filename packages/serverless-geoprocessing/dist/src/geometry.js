"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
function isSeaSketchFeatureCollection(obj) {
    return typeof obj.features === "object";
}
exports.isSeaSketchFeatureCollection = isSeaSketchFeatureCollection;
function isSeaSketchFeature(obj) {
    return typeof obj.features === "undefined";
}
exports.isSeaSketchFeature = isSeaSketchFeature;
exports.fetchGeoJSON = async (request) => {
    if (request.geometry) {
        return request.geometry;
    }
    else if (request.geometryUri) {
        if (/^data:/.test(request.geometryUri)) {
            // data-uri
            const data = Buffer.from(request.geometryUri.split(",")[1], "base64");
            if (/application\/json/.test(request.geometryUri)) {
                // json
                return JSON.parse(data.toString());
            }
            else if (/application\/x-protobuf/.test(request.geometryUri)) {
                // protobuf
                // TODO: implement geobuf support
                throw new Error("application/x-protobuf not yet supported");
            }
            else {
                throw new Error("Unknown mime type in data-uri");
            }
        }
        else {
            // fetch geometry from endpoint
            const response = await fetch(request.geometryUri, 
            // only send Authorization header if token is provided
            request.token
                ? {
                    headers: {
                        Authorization: request.token
                    }
                }
                : {});
            return response.json();
        }
    }
    else {
        throw new Error("No geometry or geometryUri present on request");
    }
};
