import { FeatureCollection, Feature } from "geojson";
import { GeoprocessingRequest } from "./request";

export interface SeaSketchFeature extends Feature {
  properties: object;
}

export interface SeaSketchFeatureCollection extends FeatureCollection {
  properties: Map<string, any>;
}

export type Sketch = SeaSketchFeature | SeaSketchFeatureCollection;

export const fetchGeoJSON = async (
  request: GeoprocessingRequest
): Promise<SeaSketchFeature | SeaSketchFeatureCollection> => {
  if (request.geometry) {
    return request.geometry;
  } else {
    // fetch geometry from endpoint 
    const response = await fetch(request.geometryUri);
    return response.json();
  }
};
