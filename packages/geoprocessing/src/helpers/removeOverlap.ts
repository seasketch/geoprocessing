import { area, featureCollection, flatten } from "@turf/turf";
import { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { clip } from "../toolbox/clip.js";
import { toMultiPolygon } from "./toMultiPolygon.js";

/**
 * Removes overlap between polygons and returns result as a single polygon or multipolygon
 * @param input
 * @returns
 */
export const removeOverlap = (
  input:
    | FeatureCollection<Polygon | MultiPolygon>
    | Feature<Polygon | MultiPolygon>[],
): Feature<Polygon | MultiPolygon> => {
  const fc = Array.isArray(input) ? featureCollection(input) : input;
  // If sketches have overlap, remove it with union
  const flatColl = flatten(fc);
  const collArea = area(flatColl);
  const collUnion = clip(flatColl, "union");
  const collUnionArea = collUnion ? area(collUnion) : 0;
  const isOverlap = collUnionArea < collArea;
  const noOverlapPolygons =
    fc.features.length > 1 && isOverlap && collUnion
      ? collUnion // multipolygon
      : toMultiPolygon(flatColl); // collection of polygons
  return noOverlapPolygons;
};
