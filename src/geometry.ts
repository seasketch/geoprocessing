import { Feature, BBox, GeoJsonProperties } from "geojson";
import { GeoprocessingRequest } from "./request";
import 'isomorphic-fetch';

export interface SeaSketchFeature extends Feature {
  properties: GeoJsonProperties;
  bbox: BBox;
}

export interface SeaSketchFeatureCollection {
  type: "FeatureCollection";
  properties: GeoJsonProperties;
  features: Array<SeaSketchFeature | SeaSketchFeatureCollection>;
  bbox: BBox;
}

export type Sketch = SeaSketchFeature | SeaSketchFeatureCollection;

export function isSeaSketchFeatureCollection(obj: any): obj is SeaSketchFeatureCollection {
  return typeof obj.features === 'object';
}

export function isSeaSketchFeature(obj: any): obj is SeaSketchFeature {
  return typeof obj.features === 'undefined';
}

export const fetchGeoJSON = async (
  request: GeoprocessingRequest
): Promise<SeaSketchFeature | SeaSketchFeatureCollection> => {
  if (request.geometry) {
    return request.geometry;
  } else if (request.geometryUri) {
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
  } else {
    throw new Error("No geometry or geometryUri present on request");
  }
};
