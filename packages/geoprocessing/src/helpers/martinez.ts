import { Polygon, MultiPolygon, Feature } from "geojson";
import { getGeom } from "@turf/invariant";
import { feature, multiPolygon, polygon } from "@turf/helpers";
import * as martinez from "martinez-polygon-clipping";

/* Wrappers for martinez library */

export function difference(
  polygon1: Feature<Polygon | MultiPolygon>,
  polygon2: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null {
  var geom1 = getGeom(polygon1);
  var geom2 = getGeom(polygon2);
  var properties = polygon1.properties || {};

  if (!geom1) return null;
  if (!geom2) return feature(geom1, properties);

  var differenced = martinez.diff(geom1.coordinates, geom2.coordinates);
  if (differenced.length === 0) return null;
  // @ts-ignore
  if (differenced.length === 1) return polygon(differenced[0], properties);
  // @ts-ignore
  return multiPolygon(differenced, properties);
}

export function intersect(
  polygon1: Feature<Polygon | MultiPolygon>,
  polygon2: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null {
  var geom1 = getGeom(polygon1);
  var geom2 = getGeom(polygon2);
  var properties = polygon1.properties || {};

  if (!geom1) return null;
  if (!geom2) return feature(geom1, properties);

  var intersection = martinez.intersection(
    geom1.coordinates,
    geom2.coordinates
  );
  if (!intersection || intersection.length === 0) return null;
  // @ts-ignore
  if (intersection.length === 1) return polygon(intersection[0], properties);
  // @ts-ignore
  return multiPolygon(intersection, properties);
}
