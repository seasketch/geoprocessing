import {
  BBox,
  Feature,
  MultiPolygon,
  Polygon,
  Sketch,
  SketchCollection,
} from "../types/index.js";
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
 * Ideally, there is a feature.id property set. If not the caller can provide a
 * uniqueIdProperty to de-dupe features. If neither is provided, a hash of the
 * feature coordinates will be used.
 *
 * If feature.id is not available, and uniqueIdProperty is not provided, there
 * is the potential for elimination of features that are geometrically identical
 * but have different properties.
 *
 * @param sketch Sketch or SketchCollection
 * @param fgbUrl FlatGeobuf location
 * @param uniqueIdProperty Used to de-dupe features when feature.id is not
 * available
 * @returns array of Features
 */
export async function getFeaturesForSketchBBoxes(
  sketch: Sketch | SketchCollection,
  fgbUrl: string,
  options: { uniqueIdProperty?: string } = {},
) {
  const { uniqueIdProperty } = options;
  const features: Feature<Polygon | MultiPolygon>[] = [];
  const addedIdentifiers = new Set<string>();
  await Promise.all(
    toSketchArray(sketch).map(async (sketch) => {
      const box = bbox(sketch);
      const splitBoxes = splitBBoxAntimeridian(box) as BBox[];
      const results = (
        await Promise.all(
          splitBoxes.map(async (box) => {
            return await loadFgb<Feature<Polygon | MultiPolygon>>(fgbUrl, box);
          }),
        )
      ).flat();
      for (const feature of results) {
        let id = feature.id?.toString();
        if (!id) {
          if (uniqueIdProperty) {
            id = feature.properties?.[uniqueIdProperty];
          } else {
            id = md5.hash(JSON.stringify(feature.geometry.coordinates));
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
