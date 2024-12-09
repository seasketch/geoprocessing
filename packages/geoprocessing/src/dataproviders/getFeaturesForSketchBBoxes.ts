import { BBox, Sketch, SketchCollection } from "../types/index.js";
import {
  Feature,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
} from "geojson";
import { loadFgb } from "./flatgeobuf.js";
import { toSketchArray } from "../helpers/index.js";
import md5 from "spark-md5";
import { bbox } from "@turf/turf";
import { splitBBoxAntimeridian } from "../toolbox/antimeridian.js";

/**
 * Loads features from a FlatGeobuf referenced by URL, which intersect the
 * bounding boxes of each individual sketch in a SketchCollection, or a single
 * Sketch.
 *
 * In the case of a SketchCollection, it is possible that duplicate features may
 * be fetched in the case of overlapping bounding boxes or very large features
 * that span multiple bounding boxes. This function will de-dupe those features.
 * The caller can
 * provide a uniqueIdProperty to de-dupe features (faster), otherwise a hash of
 * the feature coordinates will be used (slower).
 *
 * If uniqueIdProperty is not provided, there is the potential for elimination
 * of features that are geometrically identical but have different properties.
 *
 * @param sketch Sketch or SketchCollection
 * @param fgbUrl FlatGeobuf location
 * @param options.uniqueIdProperty name of unique ID property to de-dupe
 * features
 * @returns array of Features
 */
export async function getFeaturesForSketchBBoxes<
  G extends
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon,
>(
  sketch: Sketch | SketchCollection,
  fgbUrl: string,
  options: { uniqueIdProperty?: string } = {},
): Promise<Feature<G>[]> {
  const sketchBoxes = toSketchArray(sketch).map((sketch) => bbox(sketch));
  const features: Feature<G>[] = await getFeaturesForBBoxes(
    sketchBoxes,
    fgbUrl,
    options,
  );
  return features;
}

/**
 * Loads features from a FlatGeobuf referenced by URL, which intersect the
 * bounding boxes. Deduplicates features given uniqueIdProperty (faster) or
 * using md5 hash of feature coordinates (slower).
 *
 * It is possible that duplicate features may be fetched in the case of
 * overlapping bounding boxes. This function will de-dupe those features. The caller can
 * provide a uniqueIdProperty to de-dupe features (faster), otherwise a hash of
 * the feature coordinates will be used (slower).
 *
 * If uniqueIdProperty is not provided, there is the potential for elimination
 * of features that are geometrically identical but have different properties.
 *
 * @param bboxes the bounding boxes to fetch features for
 * @param fgbUrl the URL of the FlatGeobuf file
 * @param options.uniqueIdProperty name of unique ID property to de-dupe
 * features
 * @returns array of Features
 */
export async function getFeaturesForBBoxes<
  G extends
    | Point
    | MultiPoint
    | LineString
    | MultiLineString
    | Polygon
    | MultiPolygon,
>(
  bboxes: BBox[],
  fgbUrl: string,
  options: { uniqueIdProperty?: string } = {},
): Promise<Feature<G>[]> {
  const { uniqueIdProperty } = options;
  const features: Feature<G>[] = [];
  const addedIdentifiers = new Set<string>();
  await Promise.all(
    bboxes.map(async (box) => {
      const splitBoxes = splitBBoxAntimeridian(box) as BBox[];
      const results = (
        await Promise.all(
          splitBoxes.map(async (box) => {
            return await loadFgb<Feature<G>>(fgbUrl, box);
          }),
        )
      ).flat();
      for (const feature of results) {
        // feature.id is not supported in flatgeobuf format on creation, but we can look for user-defined
        let id: string | undefined;
        if (!id) {
          if (uniqueIdProperty) {
            if (feature.properties?.[uniqueIdProperty] === undefined) {
              throw new Error(
                `uniqueIdProperty ${uniqueIdProperty} not found in feature properties`,
              );
            }
            id = feature.properties?.[uniqueIdProperty];
          } else {
            id = md5.hash(JSON.stringify(feature.geometry.coordinates!));
          }
        }
        if (id && !addedIdentifiers.has(id)) {
          addedIdentifiers.add(id);
          features.push(feature);
        }
      }
    }),
  );
  return features;
}
