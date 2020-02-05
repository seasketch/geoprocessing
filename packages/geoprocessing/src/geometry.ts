import { Sketch, SketchCollection } from "./types";
import { isCollection } from "./index";
import { Feature, BBox, GeoJsonProperties } from "geojson";
import { GeoprocessingRequest } from "./types";
import "isomorphic-fetch";

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
      return response.json();
    }
  } else {
    throw new Error("No geometry or geometryUri present on request");
  }
};
