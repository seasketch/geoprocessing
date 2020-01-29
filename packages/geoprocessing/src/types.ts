import { FeatureCollection, GeoJsonProperties } from "geojson";

export type ExecutionMode = "async" | "sync";

export interface SketchCollection extends FeatureCollection {
  properties: GeoJsonProperties;
}

export interface GeoprocessingHandlerOptions {
  /** Title will appear in service metadata and be referenced by clients */
  title: string;
  /** Appears in service metadata */
  description: string;
  /** Seconds */
  timeout: number;
  /** Megabytes, 128 - 3008 */
  memory: number;
  /** Choose `sync` for functions that are expected to return quickly (< 2s)
   * and `async` for longer running functions, especially contain/docker jobs.
   */
  executionMode: ExecutionMode;
  /** Specify the ids of any Sketch Class form fields that must be provided in
   * order to run the function
   */
  usesProperties: string[];
  /** Whether to rate limit beyond basic DDoS protection */
  rateLimit?: boolean;
  /** `daily` or `monthly` */
  rateLimitPeriod?: RateLimitPeriod;
  /** Whether function should respect group access-control headers */
  restrictedAccess?: boolean;
  /** List domains, e.g. myproject.seasketch.org.
   * When restrictedAccess is enabled, this function can be configured to only
   * work with specified projects.
   */
  issAllowList?: string[];
}

type RateLimitPeriod = "monthly" | "daily";
type GeoprocessingServiceType = "javascript" | "container";

/** Expected public service metadata for each function */
export interface GeoprocessingServiceMetadata
  extends GeoprocessingHandlerOptions {
  rateLimit: boolean;
  restrictedAccess: boolean;
  issAllowList: string[];
  /** Seconds */
  medianDuration: number;
  /** USD */
  medianCost: number;
  endpoint: string;
  type: GeoprocessingServiceType;
}
