/**
 * Passthru to polygon-clipping methods
 */

import polygonClipping from "polygon-clipping";
import {
  Feature,
  multiPolygon,
  MultiPolygon,
  polygon,
  Polygon,
  Position,
  Properties,
  FeatureCollection,
} from "@turf/helpers";
import { geomEach } from "@turf/meta";
import { getGeom } from "@turf/invariant";
import { ValidationError } from "../types";

export function clip<P = Properties>(
  features: FeatureCollection<Polygon | MultiPolygon>,
  operation: "union" | "intersection" | "xor" | "difference",
  options: {
    properties?: P;
  } = {}
): Feature<Polygon | MultiPolygon> | null {
  if (!features || !features.features || features.features.length === 0)
    throw new ValidationError("Missing or empty features for clip");
  const coords: (Position[][] | Position[][][])[] = [];
  geomEach(features, (geom) => {
    coords.push(geom.coordinates);
  });
  //@ts-ignore
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
export function clipMultiMerge<P = Properties>(
  feature1: Feature<Polygon | MultiPolygon>,
  features2: FeatureCollection<Polygon | MultiPolygon>,
  operation: "union" | "intersection" | "xor" | "difference",
  options: {
    properties?: P;
  } = {}
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
    return features2.features.map((poly) => getGeom(poly).coordinates);
  })();
  const result = polygonClipping[operation](
    geom1.coordinates as any,
    coords2 as any
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
