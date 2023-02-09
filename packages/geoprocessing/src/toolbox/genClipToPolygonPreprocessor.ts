import { isPolygonFeature } from "../helpers";
import { Feature, Polygon, MultiPolygon } from "geojson";
import { clipMultiMerge } from "../helpers";
import { ValidationError } from "../types";

import area from "@turf/area";
import { featureCollection as fc } from "@turf/helpers";
import flatten from "@turf/flatten";
import kinks from "@turf/kinks";

/** Parameters for single preprocessor clip operation */
export type ClipOperations = "intersect";
export interface ClipOperation {
  clipFeatures: Feature<Polygon>[];
  /** Supported clip operations */
  operation: "intersect";
}

/** Optional parameters for preprocessor function */
export interface ClipOptions {
  /** Ensures result is a polygon. If clip results in multipolygon, returns the largest component */
  ensurePolygon?: boolean;
  /** maxSize in square kilometers that clipped polygon result can be.  Preprocessor function will throw if larger. */
  maxSize?: number;
  /** Whether or not maxSize should be enforced and throw */
  enforceMaxSize?: boolean;
}

/**
 * Returns an preprocessor function that clips a given
 * sketch against polygon/multipolygon features using one or more clipOperations.
 * @throws if clipped features is larger than maxSize, defaults to 500K km
 */
export const genClipToPolygonPreprocessor = (
  clipOperations: Array<ClipOperation>,
  options: ClipOptions = {}
) => {
  const func = (feature: Feature): Promise<Feature | null> =>
    clipToPolygonFeatures(clipOperations, feature, options);
  return func;
};

/**
 * Takes a Polygon feature and returns the portion remaining after performing clipOperations
 * If results in multiple polygons then returns the largest
 * @throws if clipped features is larger than maxSize, defaults to 500K km
 */
export async function clipToPolygonFeatures(
  /** List of clip operations to run on feature in sequential order against given datasource  */
  clipOperations: Array<ClipOperation>,
  feature: Feature,
  options: ClipOptions = {}
): Promise<Feature<Polygon | MultiPolygon> | null> {
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

  // Sequentially run clip operations in order.  If operation returns null at some point, don't do any more ops
  for (const clipOp of clipOperations) {
    if (clipped !== null && clipOp.operation === "intersect") {
      clipped = clipMultiMerge(
        feature,
        fc(clipOp.clipFeatures),
        "intersection"
      );
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
