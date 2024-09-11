/**
 * Passthru to polygon-clipping methods
 */

import polygonClipping from "polygon-clipping";
import { multiPolygon, polygon, geomEach, getGeom } from "@turf/turf";
import {
  Feature,
  MultiPolygon,
  Polygon,
  FeatureCollection,
  Position,
  GeoJsonProperties,
} from "../types/geojson.js";
import { ValidationError } from "../types/index.js";

/**
 * Performs clip operation on features
 * @param features - FeatureCollection of Polygons or MultiPolygons.  First feature is the subject, the rest are the clippers
 * @param operation - one of "union", "intersection", "xor", "difference"
 * @param options - optional properties to set on the resulting feature
 * @returns clipped Feature of Polygon or MultiPolygon
 * @deprecated - use turf modules instead, now with support for operating against an array of features
 */
export function clip<
  P extends GeoJsonProperties | undefined = GeoJsonProperties,
>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  operation: "union" | "intersection" | "xor" | "difference",
  options: {
    properties?: P;
  } = {},
): Feature<Polygon | MultiPolygon> | null {
  if (!features || !features.features || features.features.length === 0)
    throw new ValidationError("Missing or empty features for clip");
  const coords: (Position[][] | Position[][][])[] = [];
  geomEach(features, (geom) => {
    coords.push(geom.coordinates);
  });
  //@ts-expect-error type mismatch
  const clipped = polygonClipping[operation](coords[0], ...coords.slice(1));

  if (clipped.length === 0) return null;
  if (clipped.length === 1)
    return polygon(clipped[0], options.properties) as Feature<
      Polygon | MultiPolygon
    >;
  return multiPolygon(clipped, options.properties) as Feature<
    Polygon | MultiPolygon
  >;
}

/**
 * Performs clip by merging features2 coords into a single multipolygon.
 * Useful when you need features2 to be seen as a single unit when clipping feature1 (e.g. intersection)
 */
export function clipMultiMerge<
  P extends GeoJsonProperties | undefined = GeoJsonProperties,
>(
  feature1: Feature<Polygon | MultiPolygon>,
  features2: FeatureCollection<Polygon | MultiPolygon>,
  operation: "union" | "intersection" | "xor" | "difference",
  options: {
    properties?: P;
  } = {},
): Feature<Polygon | MultiPolygon> | null {
  if (
    !feature1 ||
    !features2 ||
    !features2.features ||
    features2.features.length === 0
  )
    throw new ValidationError("Missing or empty features for clip");

  const geom1 = getGeom(feature1);
  // Combine into one multipoly coordinate array
  const coords2 = (() => {
    return features2.features.reduce<MultiPolygon["coordinates"]>(
      (acc, poly) => {
        if (poly.geometry.type === "Polygon") {
          return [...acc, poly.geometry.coordinates];
        } else {
          return [...acc, ...poly.geometry.coordinates];
        }
      },
      [],
    );
  })();
  const result = polygonClipping[operation](
    geom1.coordinates as any,
    coords2 as any,
  );
  if (result.length === 0) return null;
  if (result.length === 1)
    return polygon(result[0], options.properties) as Feature<
      Polygon | MultiPolygon
    >;
  return multiPolygon(result, options.properties) as Feature<
    Polygon | MultiPolygon
  >;
}
