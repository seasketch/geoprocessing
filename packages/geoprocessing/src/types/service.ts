import { JSONValue } from "./base";
import { Polygon, LineString, Point, Feature } from "./geojson";
import { Sketch, SketchProperties } from "./sketch";

interface ClientCode {
  uri: string; // public bundle location
  offlineSupported: boolean;
}

type RateLimitPeriod = "monthly" | "daily";
type GeoprocessingServiceType = "javascript" | "container";

/** Expected public service metadata for each function */
export interface GeoprocessingServiceMetadata
  extends GeoprocessingHandlerOptions {
  restrictedAccess?: boolean; // NOT IMPLEMENTED?
  /** Seconds */
  medianDuration: number;
  /** USD */
  medianCost: number;
  endpoint: string;
  type: GeoprocessingServiceType;
  // for low-latency clientside processing and offline use
  // v2 or later
  clientSideBundle?: ClientCode;
  // e.g. [sensitive-project.seasketch.org]
  issAllowList: string[];
  rateLimited: boolean;
  rateLimit: number;
  rateLimitPeriod: RateLimitPeriod;
  rateLimitConsumed: number;
  // if set, requests must include a token with an allowed issuer (iss)
  uri?: string; // NOT IMPLEMENTED?
}

export interface PreprocessingServiceMetadata
  extends PreprocessingHandlerOptions {
  restrictedAccess: boolean;
  /** Seconds */
  medianDuration: number;
  /** USD */
  medianCost: number;
  endpoint: string;
  type: GeoprocessingServiceType;
  // for low-latency clientside processing and offline use
  // v2 or later
  clientSideBundle?: ClientCode;
  // e.g. [sensitive-project.seasketch.org]
  issAllowList: string[];
  rateLimited: boolean;
  rateLimit: number;
  rateLimitPeriod: RateLimitPeriod;
  rateLimitConsumed: number;
  // if set, requests must include a token with an allowed issuer (iss)
  uri: string;
}

export type ExecutionMode = "async" | "sync";

export interface GeoprocessingHandlerOptions {
  /** Title will appear in service metadata and be referenced by clients */
  title: string;
  /** Appears in service metadata */
  description: string;
  /** Seconds */
  timeout: number;
  /** Megabytes, 128 - 3008 */
  memory?: number;
  /** Choose `sync` for functions that are expected to return quickly (< 2s)
   * and `async` for longer running functions, especially contain/docker jobs.
   */
  executionMode: ExecutionMode;
  /** Specify the ids of any Sketch Class form fields that must be provided in
   * order to run the function
   */
  requiresProperties: string[];
  /** Whether to rate limit beyond basic DDoS protection */
  rateLimited?: boolean;
  rateLimit?: number;
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

export interface PreprocessingHandlerOptions {
  title: string;
  description: string;
  /** Seconds */
  timeout: number;
  /** Megabytes, 128 - 3008, defaults to 1024 */
  memory?: number;
  requiresProperties: string[];
}

/**
 * Represents geoprocessing request via HTTP method, fully packed
 */
export interface GeoprocessingRequest<G = Polygon | LineString | Point> {
  /** URL to fetch Sketch JSON */
  geometryUri?: string; // must be https
  /** Sketch JSON */
  geometry?: Sketch<G>;
  /** Additional runtime parameters, as escaped JSON string */
  extraParams?: string;
  token?: string;
  cacheKey?: string;
  wss?: string;
  checkCacheOnly?: string;
  onSocketConnect?: string;
}

export type GeoprocessingRequestParams = Record<string, JSONValue>;

/**
 * Represents geoprocessing request internally, fully unpacked
 */
export interface GeoprocessingRequestModel<G = Polygon | LineString | Point> {
  /** URL to fetch Sketch JSON */
  geometryUri?: string; // must be https
  /** Sketch JSON */
  geometry?: Sketch<G>;
  /** Additional runtime parameters */
  extraParams?: GeoprocessingRequestParams;
  token?: string;
  cacheKey?: string;
  wss?: string;
  checkCacheOnly?: string;
  onSocketConnect?: string;
}

export interface SeaSketchReportingMessageEvent {
  client: string;
  sketchProperties: SketchProperties;
  geometryUri: string;
  type: "SeaSketchReportingMessageEventType";
  /* List of ids for layers which are visible in the table of contents */
  visibleLayers?: string[];
  language?: string;
}

export interface SeaSketchReportingVisibleLayersChangeEvent {
  visibleLayers: string[];
  type: "SeaSketchReportingVisibleLayersChangeEvent";
}

export interface SeaSketchReportingToggleLayerVisibilityEvent {
  layerId: string;
  on: boolean;
  type: "SeaSketchReportingToggleLayerVisibilityEvent";
}

export interface SeaSketchReportingToggleLanguageEvent {
  language: string;
  on: boolean;
  type: "SeaSketchReportingToggleLanguageEvent";
}

export interface PreprocessingRequest {
  /** Geometry drawn by the user. Typically simple */
  feature: Feature<Polygon | Point | LineString>;
  /** Additional runtime parameters */
  extraParams?: string;
  /** Defaults to geojson  */
  responseFormat?: "application/json"; // | "application/pbf+geobuf" | "application/pbf+mvt";
}

export interface PreprocessingResponse<ResponseType = Feature> {
  status: "ok" | "error" | "validationError";
  data?: ResponseType;
  error?: string;
}

export interface PreprocessingService {
  title: string;
  description: string;
  endpoint: string;
  requiresProperties: string[];
  // // if set, requests must include a token with an allowed issuer (iss)
  // restrictedAccess: boolean;
  // // e.g. [sensitive-project.seasketch.org]
  // issAllowList?: Array<string>;
  // // for low-latency clientside processing and offline use
  // // v2 or later
  // clientSideBundle?: ClientCode;
}
