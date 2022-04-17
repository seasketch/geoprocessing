import { Feature, FeatureCollection, Polygon } from "../types";
import { isFeature } from "./geo";

/** Helper to convert a Feature or a FeatureCollection to a Feature array */
export function toFeatureArray(input: Feature | FeatureCollection) {
  if (isFeature(input)) {
    return [input];
  } else {
    return input.features;
  }
}

export function toFeaturePolygonArray(
  input: Feature<Polygon> | FeatureCollection<Polygon>
) {
  if (isFeature(input)) {
    return [input];
  } else {
    return input.features;
  }
}
