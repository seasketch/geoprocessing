import {
  FeatureCollection,
  Feature,
  Geometry,
  GeometryCollection,
  BBox,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Point,
} from "@turf/helpers";

// Re-export geojson type declaractions for easy import by user project
export {
  FeatureCollection,
  Feature,
  Geometry,
  GeometryCollection,
  BBox,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Point,
};

export type ExecutionMode = "async" | "sync";

export interface SketchProperties {
  id: string;
  /** Name specified by the author of the sketch */
  name: string;
  // ISO 8601 date/time string
  updatedAt: string;
  // ISO 8601 date/time string
  createdAt: string;
  sketchClassId: string;
  isCollection: boolean;
  userAttributes: UserAttribute[];
}

export interface UserAttribute {
  exportId: string;
  label: string;
  value: any;
  fieldType: string;
}

export interface Sketch extends Feature {
  properties: SketchProperties;
  geometry: Geometry;
  bbox?: BBox;
}

export interface SketchCollection extends FeatureCollection {
  properties: SketchProperties;
  bbox: BBox;
  features: Sketch[];
}

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

export interface GeoprocessingProject {
  uri: string;
  apiVersion: string; // semver
  geoprocessingServices: GeoprocessingServiceMetadata[];
  preprocessingServices: PreprocessingService[];
  clients: ReportClient[];
  feedbackClients: DigitizingFeedbackClient[];
  // Labelling and attribution information may be displayed
  // in the SeaSketch admin interface
  title: string;
  author: string;
  organization?: string;
  relatedUri?: string; // May link to github or an org uri
  sourceUri?: string; // github repo or similar
  published: string; //  ISO 8601 date
}

interface ClientCode {
  uri: string; // public bundle location
  offlineSupported: boolean;
}

interface ReportClient {
  title: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
  tabs: ReportTab[];
}

interface ReportTab {
  title: string;
}

interface DigitizingFeedbackClient {
  title: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
  offlineSupport: boolean;
}

interface ClientJsonConfig {
  name: string;
  description: string;
  source: string;
}

export interface GeoprocessingJsonConfig {
  author: string;
  organization?: string;
  region: string;
  geoprocessingFunctions: string[];
  preprocessingFunctions: string[];
  clients: ClientJsonConfig[];
}

export interface GeoprocessingRequest {
  geometry?: Sketch;
  geometryUri?: string; // must be https
  token?: string;
  cacheKey?: string;
  wss?: string;
  checkCacheOnly?: string;
  onSocketConnect?: string;
}

export const SeaSketchReportingMessageEventType =
  "SeaSketchReportingMessageEventType";

export interface SeaSketchReportingMessageEvent {
  client: string;
  sketchProperties: SketchProperties;
  geometryUri: string;
  type: "SeaSketchReportingMessageEventType";
}

export interface PreprocessingRequest {
  /** Geometry drawn by the user. Typically simple */
  feature: Feature<Polygon | Point | LineString>;
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
