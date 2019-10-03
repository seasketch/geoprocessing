import { Feature, BBox, GeoJsonProperties } from "geojson";
import { GeoprocessingRequest } from "./handlers";
import "isomorphic-fetch";

export interface SketchProperties {
  /** string id of parent collection, if any */
  parent?: string;
  sketchClassId: string;
  name: string;
  /** ISO 8601 date string */
  updatedAt: string;
  [name: string]: any;
}

export interface SeaSketchFeature extends Feature {
  properties: SketchProperties;
  bbox: BBox;
}

export interface SeaSketchFeatureCollection {
  type: "FeatureCollection";
  properties: SketchProperties;
  features: Array<SeaSketchFeature | SeaSketchFeatureCollection>;
  bbox: BBox;
}

export type Sketch = SeaSketchFeature | SeaSketchFeatureCollection;

export function isSeaSketchFeatureCollection(
  obj: any
): obj is SeaSketchFeatureCollection {
  return typeof obj.features === "object";
}

export function isSeaSketchFeature(obj: any): obj is SeaSketchFeature {
  return typeof obj.features === "undefined";
}

export const fetchGeoJSON = async (
  request: GeoprocessingRequest
): Promise<SeaSketchFeature | SeaSketchFeatureCollection> => {
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
