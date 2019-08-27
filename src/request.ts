import { Sketch } from './geometry';

export interface GeoprocessingRequestParameters {
  [key: string]: any
}

export interface GeoprocessingRequest {
  geometry?: Sketch;
  geometryUri?: string; // must be https
  token?: string;
  cacheKey?: string;
  parameters: GeoprocessingRequestParameters
}
