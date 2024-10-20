import { clip, isPolygonFeature } from "../helpers/index.js";
import { clipMultiMerge } from "../helpers/index.js";
import {
  ValidationError,
  Feature,
  Polygon,
  MultiPolygon,
} from "../types/index.js";
import { area, featureCollection as fc, flatten, kinks } from "@turf/turf";
import { ClipOptions, FeatureClipOperation } from "../types/dataProcessor.js";

/**
 * Returns a preprocessor function given clipLoader function
 * @throws if clipped feature is larger than maxSize, defaults to 500K km
 */
export const genPreprocessor = (
  /** Clip loader function */
  clipLoader: (
    feature: Feature<Polygon | MultiPolygon>,
  ) => Promise<FeatureClipOperation[]>,
  options: ClipOptions = {},
) => {
  const func = async (feature: Feature): Promise<Feature> => {
    return clipToPolygonFeatures(feature, clipLoader, options);
  };
  return func;
};

/**
 * Takes a Polygon feature and returns the portion remaining after performing clipOperations
 * If results in multiple polygons then returns the largest
 * @throws if input feature to clip is not a polygon or if enforceMaxSize is true and clipped feature is larger than maxSize, defaults to 500K km
 */
export async function clipToPolygonFeatures(
  /** feature to clip  */
  feature: Feature,
  /** Load clip features from datasources for clip operations */
  clipLoader: (
    feature: Feature<Polygon | MultiPolygon>,
  ) => Promise<FeatureClipOperation[]>,
  options: ClipOptions = {},
): Promise<Feature<Polygon | MultiPolygon>> {
  const {
    maxSize = 500_000,
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
      `Please limit sketches to under ${MAX_SIZE_KM} square km`,
    );
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  let clipped: Feature<Polygon | MultiPolygon> | null = feature; // Start with whole feature

  //// CLIP OPERATIONS ////

  const clipOperations = await clipLoader(feature);

  // Sequentially run clip operations in order.  If operation returns null at some point, don't do any more ops
  for (const clipOp of clipOperations) {
    if (clipped !== null && clipOp.clipFeatures.length > 0) {
      if (clipOp.operation === "intersection") {
        clipped = clipMultiMerge(
          clipped,
          fc(clipOp.clipFeatures),
          "intersection",
        );
      } else if (clipOp.operation === "difference") {
        clipped = clip(fc([clipped, ...clipOp.clipFeatures]), "difference");
      }
    }
  }

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Feature is outside of boundary");
  } else {
    if (ensurePolygon && clipped.geometry.type === "MultiPolygon") {
      // If multipolygon, keep only the biggest piece
      const flattened = flatten(clipped);
      let biggest = [0, 0];
      for (let i = 0; i < flattened.features.length; i++) {
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
