import { Feature, FeatureCollection, Sketch, SketchCollection } from "./types";
import { GeoprocessingRequest } from "./types";
import isHostedOnLambda from "./isHostedOnLambda";
import "./fetchPolyfill";

/**
 * Given geoprocessing function request, fetches JSON, which can be a GeoJSON Feature|FeatureCollection
 * or the superset Sketch|SketchCollection
 * @returns the sketch JSON with geometry type optionally specified by request
 */
export const fetchGeoJSON = async <G>(
  request: GeoprocessingRequest<G>
): Promise<
  Feature<G> | FeatureCollection<G> | Sketch<G> | SketchCollection<G>
> => {
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
      if (isHostedOnLambda) {
        console.time(`Fetch sketch from ${request.geometryUri}`);
      }
      const response = await fetch(
        request.geometryUri,
        // only send Authorization header if token is provided
        request.token
          ? {
              headers: {
                Authorization: request.token,
              },
            }
          : {}
      );
      const sketch = await response.json();
      if (isHostedOnLambda) {
        console.timeEnd(`Fetch sketch from ${request.geometryUri}`);
      }
      return sketch;
    }
  } else {
    throw new Error("No geometry or geometryUri present on request");
  }
};
