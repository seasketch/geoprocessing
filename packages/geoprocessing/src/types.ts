import { FeatureCollection, GeoJsonProperties, Feature } from "geojson";

export type ExecutionMode = "async" | "sync";

export interface SketchProperties {
  /** Name specified by the author of the sketch */
  name: string;
  // ISO 8601 date/time string
  updatedAt: string;
  sketchClassId: string;
  [name: string]: any;
}

export interface Sketch extends Feature {
  properties: SketchProperties;
}

export interface SketchCollection extends FeatureCollection {
  properties: SketchProperties;
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
  requiresProperties: string[];
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

export interface GeoprocessingProject {
  uri: string;
  apiVersion: string; // semver
  geoprocessingServices: GeoprocessingService[];
  preprocessingServices: PreprocessingService[];
  clients: ReportClient[];
  feebackClients: DigitizingFeedbackClient[];
  // Labelling and attribution information may be displayed
  // in the SeaSketch admin interface
  title: string;
  author: string;
  organization?: string;
  relatedUri?: string; // May link to github or an org uri
  sourceUri?: string; // github repo or similar
  published: string; //  ISO 8601 date
}

interface GeoprocessingService {
  title: string;
  endpoint: string;
  type: GeoprocessingServiceType;
  executionMode: ExecutionMode;
  usesAttributes: string[];
  medianDuration: number; //ms
  medianCost: number; //usd
  timeout: number; //ms
  rateLimited: boolean;
  rateLimitPeriod: RateLimitPeriod;
  rateLimit: number;
  rateLimitConsumed: number;
  // if set, requests must include a token with an allowed issuer (iss)
  restrictedAccess: boolean;
  // e.g. [sensitive-project.seasketch.org]
  issAllowList?: Array<string>;
  // for low-latency clientside processing and offline use
  // v2 or later
  clientSideBundle?: ClientCode;
}

interface ClientCode {
  uri: string; // public bundle location
  offlineSupported: boolean;
}

interface PreprocessingService {
  title: string;
  endpoint: string;
  usesAttributes: string[];
  timeout: number; //ms
  // if set, requests must include a token with an allowed issuer (iss)
  restrictedAccess: boolean;
  // e.g. [sensitive-project.seasketch.org]
  issAllowList?: Array<string>;
  // for low-latency clientside processing and offline use
  // v2 or later
  clientSideBundle?: ClientCode;
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

type ExecutionMode = "async" | "sync";

interface DigitizingFeedbackClient {
  title: string;
  uri: string;
  bundleSize: number; //bytes
  apiVersion: string;
  offlineSupport: boolean;
}

export interface GeoprocessingJsonConfig {
  title: string;
  author: string;
  region: string;
  organization?: string;
  relatedUri?: string;
  sourceUri?: string;
  published: string;
}
