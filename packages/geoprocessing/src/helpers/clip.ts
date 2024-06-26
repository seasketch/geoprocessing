/**
 * Passthru to polygon-clipping methods
 */

import polygonClipping from "polygon-clipping";
import { multiPolygon, polygon } from "@turf/helpers";
import {
  Feature,
  MultiPolygon,
  Polygon,
  FeatureCollection,
  Position,
  GeoJsonProperties,
} from "../types/geojson.js";
import { geomEach } from "@turf/meta";
import { getGeom } from "@turf/invariant";
import { ValidationError } from "../types/index.js";

export function clip<
  P extends GeoJsonProperties | undefined = GeoJsonProperties
>(
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
export function clipMultiMerge<
  P extends GeoJsonProperties | undefined = GeoJsonProperties
>(
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
    //@ts-ignore
    return features2.features.reduce<MultiPolygon["coordinates"]>(
      (acc, poly) => {
        if (poly.geometry.type === "Polygon") {
          return [...acc, poly.geometry.coordinates];
        } else {
          return [...acc, ...poly.geometry.coordinates];
        }
      },
      []
    );
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
