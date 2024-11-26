import { bbox } from "@turf/turf";
import {
  Geometry,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  Sketch,
  SketchCollection,
  BBox,
} from "../types/index.js";
import { cleanCoords } from "./cleanCoords.js";
import splitGeojson from "geojson-antimeridian-cut";

/**
 * Splits a Feature or FeatureCollection on the 180 degree antimeridian.
 * The bbox property of the result will have longitude coordinates that are
 * shifted/normalized to be within the range of -180 to 180.
 * @param feature the feature or feature collection to split
 * @returns the split feature or feature collection
 */
export function splitFeatureAntimeridian<
  G extends Geometry = Polygon | MultiPolygon,
>(
  feature: Feature<G> | FeatureCollection<G>,
): Feature<Polygon | MultiPolygon> | FeatureCollection<Polygon | MultiPolygon> {
  // Ensure coordinate positions are within -180 to 180 longitude, -90 to 90 latitude
  const cleanFeatures = cleanCoords(feature) as
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>;
  cleanFeatures.bbox = bbox(cleanFeatures);

  // Split feature on antimeridian.  If it doesn't cross simply returns original polygon
  const splitFeatures = splitGeojson(cleanFeatures) as
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>;
  splitFeatures.bbox = bbox(cleanFeatures);
  return splitFeatures;
}

/**
 * Splits a Sketch or SketchCollection on the 180 degree antimeridian
 * The bbox property of the result will have longitude coordinates that are
 * shifted/normalized to be within the range of -180 to 180.
 * @param sketch the sketch or sketch collection to split
 * @returns the split sketch or sketch collection
 */
export function splitSketchAntimeridian<G = Polygon | MultiPolygon>(
  sketch: Sketch<G> | SketchCollection<G>,
): Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon> {
  // Ensure coordinate positions are within -180 to 180 longitude, -90 to 90 latitude
  const cleanFeatures = cleanCoords(sketch) as Sketch<Polygon | MultiPolygon>;

  // Split sketch on antimeridian.  If it doesn't cross simply returns original polygon
  const splitFeatures = splitGeojson(cleanFeatures, { mutate: true }) as
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>;
  splitFeatures.bbox = bbox(cleanFeatures);
  return splitFeatures;
}

/**
 * If bounding box crosses antimeridian (and extends outside the range of -180 to 180),
 * split it into two bounding boxes at the antimeridian.
 * @param bbox the bounding box to split
 * @returns array of one or two bounding boxes
 */
export function splitBBoxAntimeridian(bbox: BBox) {
  const [minX, minY, maxX, maxY] = cleanBBox(bbox);

  // If the normalized bbox crosses the antimeridian, splitting is needed
  if (minX > maxX) {
    return [
      [minX, minY, 180, maxY],
      [-180, minY, maxX, maxY],
    ];
  } else {
    return [bbox];
  }
}

/**
 * Normalizes bounding box longitude values to the [-180, 180] range if they cross the antimeridian
 * @param bbox the bounding box to clean
 * @returns the cleaned bounding box
 */
export function cleanBBox(bbox: BBox) {
  const [minX, minY, maxX, maxY] = bbox;

  // Normalize longitudes to the [-180, 180] range if needed
  const normMinX = ((((minX + 180) % 360) + 360) % 360) - 180;
  const normMaxX = ((((maxX + 180) % 360) + 360) % 360) - 180;

  return [normMinX, minY, normMaxX, maxY];
}
