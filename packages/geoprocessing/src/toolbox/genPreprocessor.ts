import {
  clip,
  isPolygonFeature,
  isPolygonFeatureArray,
} from "../helpers/index.js";
import { clipMultiMerge } from "../helpers/index.js";
import {
  ValidationError,
  Feature,
  Polygon,
  MultiPolygon,
} from "../types/index.js";
import {
  area,
  bbox,
  featureCollection as fc,
  flatten,
  kinks,
} from "@turf/turf";
import {
  ClipOptions,
  DatasourceClipOperation,
  FeatureClipOperation,
} from "../types/dataProcessor.js";
import {
  isExternalVectorDatasource,
  isInternalVectorDatasource,
} from "../datasources/helpers.js";
import { ProjectClientInterface } from "../project/ProjectClientBase.js";
import { getFeatures } from "../dataproviders/getFeatures.js";

/**
 * Returns feature untouched if it is valid and meets requirements set by options.
 * @throws if invalid with reason
 */
export function ensureValidPolygon(
  /** feature to clip  */
  feature: Feature,
  options: {
    /** minSize in square kilometers that polygon can be. Throws if smaller. */
    minSize?: number;
    /** Whether or not minSize should be enforced and throw if smaller */
    enforceMinSize?: boolean;
    /** maxSize in square kilometers that polygon can be.  Throws if larger. */
    maxSize?: number;
    /** Whether or not maxSize should be enforced and throw if larger */
    enforceMaxSize?: boolean;
  } = {},
): boolean {
  const {
    minSize = 0,
    enforceMinSize = false,
    maxSize = 500_000,
    enforceMaxSize = false,
  } = options;

  //// INITIAL CHECKS ////

  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const MIN_SIZE_KM = minSize * 1_000_000;
  const MAX_SIZE_KM = maxSize * 1_000_000;

  if (enforceMinSize && area(feature) < MIN_SIZE_KM) {
    throw new ValidationError(
      `Please limit sketches to under ${MIN_SIZE_KM} square km`,
    );
  }

  if (enforceMaxSize && area(feature) > MAX_SIZE_KM) {
    throw new ValidationError(
      `Please limit sketches to under ${MAX_SIZE_KM} square km`,
    );
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  return true;
}

/**
 * Returns a function that applies clip operations to a feature using other polygon features.
 * @throws if clipped feature is larger than maxSize, defaults to 500K km
 */
export const genClipToPolygonFeatures = (
  clipOperations: FeatureClipOperation[],
  options: ClipOptions = {},
) => {
  const func = async (feature: Feature): Promise<Feature> => {
    return clipToPolygonFeatures(feature, clipOperations, options);
  };
  return func;
};

/**
 * Takes a Polygon feature and returns the portion remaining after performing clipOperations against one or more Polygon features
 * If results in multiple polygons then returns the largest
 * @throws if input feature to clip is not a polygon or if enforceMaxSize is true and clipped feature is larger than maxSize, defaults to 500K km
 */
export async function clipToPolygonFeatures(
  /** feature to clip  */
  feature: Feature,
  clipOperations: FeatureClipOperation[],
  options: ClipOptions = {},
): Promise<Feature<Polygon | MultiPolygon>> {
  const {
    minSize = 0,
    enforceMinSize = false,
    maxSize = 500_000,
    enforceMaxSize = false,
    ensurePolygon = true,
  } = options;

  //// INITIAL CHECKS ////

  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const MIN_SIZE_KM = minSize * 1_000_000;
  const MAX_SIZE_KM = maxSize * 1_000_000;

  if (enforceMinSize && area(feature) < MIN_SIZE_KM) {
    throw new ValidationError(
      `Please limit sketches to under ${MIN_SIZE_KM} square km`,
    );
  }

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

  // const clipOperations = await clipLoader(feature);

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

/**
 * Returns a function that applies clip operations to a feature using polygon datasource features
 * @throws if clipped feature is larger than maxSize, defaults to 500K km
 */
export const genClipToPolygonDatasources = <P extends ProjectClientInterface>(
  project: P,
  /** Load clip features from datasources for clip operations */
  operations: DatasourceClipOperation[],
  options: ClipOptions = {},
) => {
  const func = async (feature: Feature): Promise<Feature> => {
    return clipToPolygonDatasources(project, feature, operations, options);
  };
  return func;
};

/**
 * Takes a Polygon feature and returns the portion remaining after performing clipOperations against one or more datasources
 * If results in multiple polygons then returns the largest
 * @throws if input feature to clip is not a polygon or if enforceMaxSize is true and clipped feature is larger than maxSize, defaults to 500K km
 */
export async function clipToPolygonDatasources<
  P extends ProjectClientInterface,
>(
  project: P,
  /** feature to clip  */
  feature: Feature,
  /** Load clip features from datasources for clip operations */
  operations: DatasourceClipOperation[],
  options: ClipOptions = {},
): Promise<Feature<Polygon | MultiPolygon>> {
  const {
    minSize = 0,
    enforceMinSize = false,
    maxSize = 500_000,
    enforceMaxSize = false,
    ensurePolygon = true,
  } = options;

  //// INITIAL CHECKS ////

  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const MIN_SIZE_KM = minSize * 1_000_000;
  const MAX_SIZE_KM = maxSize * 1_000_000;

  if (enforceMinSize && area(feature) < MIN_SIZE_KM) {
    throw new ValidationError(
      `Please limit sketches to under ${MIN_SIZE_KM} square km`,
    );
  }

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

  const clipOperations = await Promise.all(
    operations.map(async (o) => {
      const ds = project.getDatasourceById(o.datasourceId);
      if (!isInternalVectorDatasource(ds) && !isExternalVectorDatasource(ds)) {
        throw new Error(`Expected vector datasource for ${ds.datasourceId}`);
      }

      const url = project.getDatasourceUrl(ds);

      const featureBox = bbox(feature);
      const clipFeatures = await getFeatures(ds, url, {
        ...o.options,
        bbox: featureBox,
      });
      if (!isPolygonFeatureArray(clipFeatures)) {
        throw new Error("Expected array of Polygon features");
      }
      return {
        clipFeatures,
        operation: o.operation,
      };
    }),
  );

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
