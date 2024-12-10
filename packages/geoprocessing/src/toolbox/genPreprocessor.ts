import {
  isPolygonFeature,
  isPolygonFeatureArray,
  numberFormat,
} from "../helpers/index.js";
import { clipMultiMerge } from "./clip.js";
import {
  ValidationError,
  Feature,
  Polygon,
  MultiPolygon,
  BBox,
} from "../types/index.js";
import {
  area,
  bbox,
  featureCollection as fc,
  flatten,
  kinks,
  booleanValid,
} from "@turf/turf";
import {
  isExternalVectorDatasource,
  isInternalVectorDatasource,
} from "../datasources/helpers.js";
import { ProjectClientInterface } from "../project/ProjectClientBase.js";
import { getDatasourceFeatures } from "../dataproviders/getDatasourceFeatures.js";
import { clip } from "./clip.js";

/** Supported clip operations */
export type ClipOperations = "intersection" | "difference";

/** Parameters for clip operation using polygon features */
export interface FeatureClipOperation {
  clipFeatures: Feature<Polygon | MultiPolygon>[];
  operation: ClipOperations;
}

export interface DatasourceOptions {
  /** Fetches features overlapping with bounding box */
  bbox?: BBox;
  /** Filter features by property having one or more specific values */
  propertyFilter?: {
    property: string;
    values: (string | number)[];
  };
  /** Provide if you have subdivided dataset and want to rebuild (union) subdivided polygons based on having same value for this property name */
  unionProperty?: string;
}

/** Parameters for clip operation using a datasource */
export interface DatasourceClipOperation {
  datasourceId: string;
  operation: ClipOperations;
  options?: DatasourceOptions;
}

/** Optional parameters for polygon clip preprocessor */
export interface ClipOptions {
  /** Ensures result is a polygon. If clip results in multipolygon, returns the largest component */
  ensurePolygon?: boolean;
}

/**
 * Returns true if feature is valid and meets requirements set by options.
 * @param feature - feature to validate
 * @param options - validation options
 * @param options.minSize - minimum size in square kilometers that polygon can be. Throws if smaller.
 * @param options.enforceMinSize - Whether or not minSize should be enforced and throw if smaller
 * @param options.maxSize - maxSize in square kilometers that polygon can be.  Throws if larger.
 * @param options.enforceMaxSize - Whether or not maxSize should be enforced and throw if larger
 * @throws if polygon is invalid with reason
 * @returns true if valid
 */
export function ensureValidPolygon(
  feature: Feature,
  options: {
    allowSelfCrossing?: boolean;
    minSize?: number;
    enforceMinSize?: boolean;
    maxSize?: number;
    enforceMaxSize?: boolean;
  } = {},
): boolean {
  const {
    /** If false will throw error if shape crosses itself */
    allowSelfCrossing = false,
    /** Minimum shape size in square kilometers, defaults to 0 */
    minSize = 0,
    /** If true will throw error if shape is less than minSize */
    enforceMinSize = true,
    /** Maximum shape size in square kilometers */
    maxSize = 10_000_000,
    /** If true will throw error if shape is more than maxSize */
    enforceMaxSize = true,
  } = options;

  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  if (!booleanValid(feature)) {
    throw new ValidationError("Polygon feature is invalid");
  }

  if (allowSelfCrossing === false) {
    const kinkPoints = kinks(feature);
    if (kinkPoints.features.length > 0) {
      throw new ValidationError("Your sketch polygon crosses itself");
    }
  }

  const MIN_SIZE_SQ_METERS = minSize * 1_000_000;
  const MAX_SIZE_SQ_METERS = maxSize * 1_000_000;

  if (enforceMinSize && area(feature) < MIN_SIZE_SQ_METERS) {
    throw new ValidationError(
      `Shapes should be at least ${numberFormat(minSize > 1 ? minSize : MIN_SIZE_SQ_METERS)} square ${minSize > 1 ? "km" : "meters"} in size`,
    );
  }

  if (enforceMaxSize && area(feature) > MAX_SIZE_SQ_METERS) {
    throw new ValidationError(
      `Shapes should be no more than ${numberFormat(maxSize)} square km in size`,
    );
  }

  return true;
}

/**
 * Returns a function that applies clip operations to a feature using other polygon features.
 * @param operations - array of DatasourceClipOperations
 * @param options - clip options
 * @param options.ensurePolygon - if true always returns single polygon.  If operations result in multiple polygons it returns the largest (defaults to true)
 * @throws if a datasource fetch returns no features or if nothing remains of feature after clip operations
 * @returns clipped polygon
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
 * @param feature - feature to clip
 * @param clipOperations - array of DatasourceClipOperations
 * @param options - clip options
 * @param options.ensurePolygon - if true always returns single polygon.  If operations result in multiple polygons it returns the largest (defaults to true)
 * @throws if a datasource fetch returns no features or if nothing remains of feature after clip operations
 * @returns clipped polygon
 */
export async function clipToPolygonFeatures(
  feature: Feature,
  clipOperations: FeatureClipOperation[],
  options: ClipOptions = {},
): Promise<Feature<Polygon | MultiPolygon>> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const { ensurePolygon = true } = options;
  let clipped: Feature<Polygon | MultiPolygon> | null = feature; // Start with whole feature

  // Sequentially run clip operations.  If operation returns null at some point, don't do any more ops
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
 * Returns a function that Takes a Polygon feature and returns the portion remaining after performing clipOperations against one or more datasources
 * @param project - project client to use for accessing datasources
 * @param clipOperations - array of DatasourceClipOperations
 * @param options - clip options
 * @param options.ensurePolygon - if true always returns single polygon.  If operations result in multiple polygons it returns the largest (defaults to true)
 * @throws if a datasource fetch returns no features or if nothing remains of feature after clip operations
 * @returns clipped polygon
 */
export const genClipToPolygonDatasources = <P extends ProjectClientInterface>(
  project: P,
  clipOperations: DatasourceClipOperation[],
  options: ClipOptions = {},
) => {
  const func = async (
    feature: Feature<Polygon | MultiPolygon>,
  ): Promise<Feature> => {
    return clipToPolygonDatasources(project, feature, clipOperations, options);
  };
  return func;
};

/**
 * Takes a Polygon feature and returns the portion remaining after performing clipOperations against one or more datasources
 * @param project - project client to use for accessing datasources
 * @param feature - feature to clip
 * @param clipOperations - array of DatasourceClipOperations
 * @param options - clip options
 * @param options.ensurePolygon - if true always returns single polygon.  If operations result in multiple polygons it returns the largest (defaults to true)
 * @throws if a datasource fetch returns no features or if nothing remains of feature after clip operations
 * @returns clipped polygon
 */
export async function clipToPolygonDatasources<
  P extends ProjectClientInterface,
>(
  project: P,
  feature: Feature,
  clipOperations: DatasourceClipOperation[],
  options: ClipOptions = {},
): Promise<Feature<Polygon | MultiPolygon>> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  const { ensurePolygon = true } = options;
  let clipped: Feature<Polygon | MultiPolygon> | null = feature; // Start with whole feature

  const featureOperations = await Promise.all(
    clipOperations.map(async (o) => {
      const ds = project.getDatasourceById(o.datasourceId);
      if (!isInternalVectorDatasource(ds) && !isExternalVectorDatasource(ds)) {
        throw new Error(`Expected vector datasource for ${ds.datasourceId}`);
      }

      const url = project.getDatasourceUrl(ds);

      const featureBox = bbox(feature);
      const clipFeatures = await getDatasourceFeatures(ds, url, {
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
  for (const clipOp of featureOperations) {
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
