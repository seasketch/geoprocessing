/**
 * Temporary fork of turf-intersect, until upgrades to use polygon-clipping with martinez 0.7.0 underneath.
 */

import polygonClipping from "polygon-clipping";
import {
  Feature,
  multiPolygon,
  MultiPolygon,
  polygon,
  Polygon,
  Properties,
  Geometries,
} from "@turf/helpers";
import { getGeom } from "@turf/invariant";

/**
 * Finds the difference between two {@link Polygon|polygons} by clipping the second polygon from the first.
 *
 * @name difference
 * @param {Feature<Polygon|MultiPolygon>} poly1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} poly2 Polygon feature to difference from poly1
 * @returns {Feature<Polygon|MultiPolygon>|null} a Polygon or MultiPolygon feature showing the area of `poly1` excluding the area of `poly2` (if empty returns `null`)
 * @example
 * var poly1 = turf.polygon([[
 *   [128, -26],
 *   [141, -26],
 *   [141, -21],
 *   [128, -21],
 *   [128, -26]
 * ]], {
 *   "fill": "#F00",
 *   "fill-opacity": 0.1
 * });
 * var poly2 = turf.polygon([[
 *   [126, -28],
 *   [140, -28],
 *   [140, -20],
 *   [126, -20],
 *   [126, -28]
 * ]], {
 *   "fill": "#00F",
 *   "fill-opacity": 0.1
 * });
 *
 * var difference = turf.difference(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, difference];
 */
export function difference<P = Properties>(
  poly1: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
  poly2:
    | Feature<Polygon | MultiPolygon>
    | Polygon
    | MultiPolygon
    | Feature<Polygon | MultiPolygon>[]
    | Polygon[]
    | MultiPolygon[],
  options: {
    properties?: P;
  } = {}
): Feature<Polygon | MultiPolygon, any> | null {
  var geom1 = getGeom(poly1);
  const coords2 = (() => {
    if (Array.isArray(poly2)) {
      return poly2.map((poly) => getGeom(poly).coordinates);
    } else {
      return getGeom(poly2).coordinates;
    }
  })();
  const differenced = polygonClipping.difference(
    geom1.coordinates as any,
    coords2 as any
  );

  if (differenced.length === 0) return null;
  if (differenced.length === 1)
    return polygon(differenced[0], options.properties);
  return multiPolygon(differenced, options.properties);
}
