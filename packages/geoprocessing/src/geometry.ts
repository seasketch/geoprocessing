import { Sketch, SketchCollection } from "./types";
import { GeoprocessingRequest } from "./types";
import isHostedOnAWS from "./isHostedOnAWS";
import "./fetchPolyfill";

export const fetchGeoJSON = async (
  request: GeoprocessingRequest
): Promise<Sketch | SketchCollection> => {
  if (request.geometry) {
    return request.geometry;
  } else if (request.geometryUri) {
    if (/^data:/.test(request.geometryUri)) {
      // data-uri
      const data = Buffer.from(request.geometryUri.split(",")[1], "base64");
      if (/application\/json/.test(request.geometryUri)) {
        // json
        return JSON.parse(data.toString());
      } else if (/application\/x-protobuf/.test(request.geometryUri)) {
        // protobuf
        // TODO: implement geobuf support
        throw new Error("application/x-protobuf not yet supported");
      } else {
        throw new Error("Unknown mime type in data-uri");
      }
    } else {
      // fetch geometry from endpoint
      if (isHostedOnAWS) {
        console.time(`Fetch sketch from ${request.geometryUri}`);
      }
      const response = await fetch(
        request.geometryUri,
        // only send Authorization header if token is provided
        request.token
          ? {
              headers: {
                Authorization: request.token
              }
            }
          : {}
      );
      const sketch = await response.json();
      if (isHostedOnAWS) {
        console.timeEnd(`Fetch sketch from ${request.geometryUri}`);
      }
      return sketch;
    }
  } else {
    throw new Error("No geometry or geometryUri present on request");
  }
};
