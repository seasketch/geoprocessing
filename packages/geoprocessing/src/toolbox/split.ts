import {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  Sketch,
  SketchCollection,
} from "../types";
import { cleanCoords } from "./cleanCoords";
import splitGeojson from "geojson-antimeridian-cut";

/**
 * Splits a Feature or FeatureCollection on the 180 degree antimeridian
 * @param feature
 * @returns
 */
export function splitFeature<G = Polygon | MultiPolygon>(
  feature: Feature<G> | FeatureCollection<G>
): Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon> {
  // Ensure coordinate positions are within -180 to 180 longitude, -90 to 90 latitude
  const cleanFeatures = cleanCoords(feature) as Feature<Polygon | MultiPolygon>;

  // Split feature on antimeridian.  If it doesn't cross simply returns original polygon
  return splitGeojson(cleanFeatures) as
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>;
}

/**
 * Splits a Sketch or SketchCollection on the 180 degree antimeridian
 * @param sketch
 * @returns
 */
export function splitSketch<G = Polygon | MultiPolygon>(
  sketch: Sketch<G> | SketchCollection<G>
): Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon> {
  // Ensure coordinate positions are within -180 to 180 longitude, -90 to 90 latitude
  const cleanFeatures = cleanCoords(sketch) as Sketch<Polygon | MultiPolygon>;

  // Split sketch on antimeridian.  If it doesn't cross simply returns original polygon
  return splitGeojson(cleanFeatures, { mutate: true }) as
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>;
}
