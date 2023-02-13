import {
  ValidationError,
  Feature,
  Polygon,
  MultiPolygon,
  BBox,
} from "../types";

// Where datasources meet data providers meet preprocessors/geoprocessors

/** Specify one or more literal values for one or more vector Feature properties */
export interface VectorPropertyFilter {
  property: string;
  values: (string | number)[];
}

/** Supported clip operations */
export type ClipOperations = "intersect";

/** Parameters for clip operation using polygon features */
export interface FeatureClipOperation {
  clipFeatures: Feature<Polygon>[];
  operation: ClipOperations;
}

/** Parameters for clip operation using a datasource */
export interface DatasourceClipOperation {
  datasourceId: string;
  operation: ClipOperations;
  options?: {
    /** Fetches features overlapping with bounding box */
    bbox?: BBox;
    /** Filter features by property having one or more specific values */
    propertyFilter?: VectorPropertyFilter;
    /** Provide if you have subdivided dataset and want to rebuild (union) subdivided polygons based on having same value for this property name */
    unionProperty?: string;
  };
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
