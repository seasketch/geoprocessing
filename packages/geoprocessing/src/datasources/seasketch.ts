import {
  Feature,
  FeatureCollection,
  GeoprocessingRequestModel,
  Sketch,
  SketchCollection,
  Geometry,
  GeoprocessingRequest,
} from "../types/index.js";
import geobuf from "geobuf";
import Pbf from "pbf";
import isHostedOnLambda from "./isHostedOnLambda.js";
// Seasketch client

/**
 * Given geoprocessing function request, fetches the GeoJSON, which can also be sketch JSON
 * @param request
 * @returns the JSON with geometry type optionally specified by request
 */
export const fetchGeoJSON = async <G extends Geometry>(
  request: GeoprocessingRequest<G> | GeoprocessingRequestModel<G>,
): Promise<
  Feature<G> | FeatureCollection<G> | Sketch<G> | SketchCollection<G>
> => {
  if (request.geometryGeobuf) {
    const sketchU8 = new Uint8Array(
      Buffer.from(request.geometryGeobuf, "base64"),
    );
    return geobuf.decode(new Pbf(sketchU8)) as
      | Feature<G>
      | FeatureCollection<G>
      | Sketch<G>
      | SketchCollection<G>;
  }
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
          : {},
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
