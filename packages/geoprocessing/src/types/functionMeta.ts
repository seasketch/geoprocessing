export interface FunctionMeta {
  linearUnits: string;
  areaUnits: string;
}

export interface ClassDatasourceMeta {
  /** Hash mapping class IDs to names */
  classIdToName?: Record<string, string>;
  classProperty: string;
}

export interface RasterDatasourceMeta {
  rasterResolution: number;
  rasterPixelArea: number;
  rasterPixelBytes: number;
  rasterMaxSize: number;
  rasterMaxBytes: number;
  rasterUrl: string;
  rasterCalcBounds?: {
    maxArea: number;
    maxPoints: number;
  };
}

export interface VectorDatasourceMeta {
  vectorCalcBounds?: {
    maxArea: number;
    maxPoints: number;
  };
  vectorUrl: string;
}

/** Base response object for geoprocessing function */
// THIS SHOULD GO AWAY, USE RESPONSE ERRORS
export type FunctionResponse = {
  success: boolean;
  message?: string;
  // Description of the underlying analysis.  A gp functions method may vary depending on parameters
  methodDesc?: string;
};
