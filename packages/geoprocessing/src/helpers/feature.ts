import { Feature, FeatureCollection } from "../types";
import { isFeature } from "./types";

/** Helper to convert a Feature or a FeatureCollection to a Feature array */
export function toFeatureArray(input: Feature | FeatureCollection) {
  if (isFeature(input)) {
    return [input];
  } else {
    return input.features;
  }
}
