"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
function isSeaSketchFeatureCollection(obj) {
    return typeof obj.features === 'object';
}
exports.isSeaSketchFeatureCollection = isSeaSketchFeatureCollection;
function isSeaSketchFeature(obj) {
    return typeof obj.features === 'undefined';
}
exports.isSeaSketchFeature = isSeaSketchFeature;
exports.fetchGeoJSON = async (request) => {
    if (request.geometry) {
        return request.geometry;
    }
    else if (request.geometryUri) {
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
    else {
        throw new Error("No geometry or geometryUri present on request");
    }
};
