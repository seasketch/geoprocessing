import { clip, isPolygonFeature } from "../helpers";
import { clipMultiMerge } from "../helpers";
import { ValidationError, Feature, Polygon, MultiPolygon } from "../types";

import area from "@turf/area";
import { featureCollection as fc } from "@turf/helpers";
import flatten from "@turf/flatten";
import kinks from "@turf/kinks";
import { ClipOptions, FeatureClipOperation } from "../types/dataProcessor";

/**
 * Returns an preprocessor function that uses opsLoad to fetch features
 * for clip operations, then clips input feature against polygon/multipolygon features using one or more clipOperations.
 * @throws if clipped features is larger than maxSize, defaults to 500K km
 */
export const genClipToPolygonPreprocessor = (
  /** Loads clip operations with clipFeatures using feature to clip as filter */
  opsLoad: (
    feature: Feature<Polygon | MultiPolygon>
  ) => Promise<FeatureClipOperation[]>,
  options: ClipOptions = {}
) => {
  const func = async (feature: Feature): Promise<Feature> => {
    return clipToPolygonFeatures(feature, opsLoad, options);
  };
  return func;
};

/**
 * Takes a Polygon feature and returns the portion remaining after performing clipOperations
 * If results in multiple polygons then returns the largest
 * @throws if clipped features is larger than maxSize, defaults to 500K km
 */
export async function clipToPolygonFeatures(
  /** List of clip operations to run on feature in sequential order against given datasource  */
  feature: Feature,
  /** Loads clip operations with clipFeatures using feature to clip as filter */
  opsLoad: (
    feature: Feature<Polygon | MultiPolygon>
  ) => Promise<FeatureClipOperation[]>,
  options: ClipOptions = {}
): Promise<Feature<Polygon | MultiPolygon>> {
  const {
    maxSize = 500000,
    enforceMaxSize = false,
    ensurePolygon = true,
  } = options;

  //// INITIAL CHECKS ////

  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const MAX_SIZE_KM = maxSize * 1000 ** 2;

  if (enforceMaxSize && area(feature) > MAX_SIZE_KM) {
    throw new ValidationError(
      `Please limit sketches to under ${MAX_SIZE_KM} square km`
    );
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  let clipped: Feature<Polygon | MultiPolygon> | null = feature; // Start with whole feature

  //// CLIP OPERATIONS ////

  const clipOperations = await opsLoad(feature);

  // Sequentially run clip operations in order.  If operation returns null at some point, don't do any more ops
  for (const clipOp of clipOperations) {
    if (clipped !== null) {
      if (clipOp.operation === "intersection") {
        clipped = clipMultiMerge(
          clipped,
          fc(clipOp.clipFeatures),
          "intersection"
        );
      } else if (clipOp.operation === "difference") {
        clipped = clip(fc([clipped, ...clipOp.clipFeatures]), "difference");
      }
    }
  }

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Sketch is outside of boundary");
  } else {
    if (ensurePolygon && clipped.geometry.type === "MultiPolygon") {
      // If multipolygon, keep only the biggest piece
      const flattened = flatten(clipped);
      let biggest = [0, 0];
      for (var i = 0; i < flattened.features.length; i++) {
        const a = area(flattened.features[i]);
        if (a > biggest[0]) {
          biggest = [a, i];
        }
      }
      return flattened.features[biggest[1]] as Feature<Polygon>;
    } else {
      return clipped;
    }
  }
}
