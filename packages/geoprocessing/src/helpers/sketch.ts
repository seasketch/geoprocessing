import { Feature } from "geojson";
import { Sketch, SketchCollection } from "../types";
import bbox from "@turf/bbox";

/**
 * Given sketch feature(s), filter out non-overlapping features from another set
 */
export function filterByBbox(
  feature: Sketch | SketchCollection,
  vectorFeatures: Feature[]
): Feature[] {
  const a = feature.bbox || bbox(feature);
  return vectorFeatures.filter((feature) => {
    const b = feature.bbox || bbox(feature);
    return a[2] >= b[0] && b[2] >= a[0] && a[3] >= b[1] && b[3] >= a[1];
  });
}
