import { Sketch } from './geometry';

export interface GeoprocessingRequest {
  geometry?: Sketch;
  geometryUri?: string; // must be https
  token?: string;
  cacheKey?: string;
}
