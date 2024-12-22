import { area, flatten } from "@turf/turf";
import { Feature, MultiPolygon, Polygon } from "geojson";

/**
 * If feature is a MultiPolygon, scans and returns the polygon with the largest area.
 */
export function biggestPolygon(feature: Feature<Polygon | MultiPolygon>) {
  if (feature.geometry.type === "MultiPolygon") {
    // If multipolygon clip result, keep only the biggest piece
    const flattened = flatten(feature);
    let biggest = [0, 0];
    for (let i = 0; i < flattened.features.length; i++) {
      const a = area(flattened.features[i]);
      if (a > biggest[0]) {
        biggest = [a, i];
      }
    }
    return flattened.features[biggest[1]] as Feature<Polygon>;
  } else {
    return feature;
  }
}
