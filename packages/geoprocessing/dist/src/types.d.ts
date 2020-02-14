import { FeatureCollection, Feature, Geometry } from "geojson";
export declare type ExecutionMode = "async" | "sync";
export interface SketchProperties {
    /** Name specified by the author of the sketch */
    name: string;
    updatedAt: string;
    sketchClassId: string;
    [name: string]: any;
}
export interface Sketch extends Feature {
    properties: SketchProperties;
    geometry: Geometry;
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
declare type RateLimitPeriod = "monthly" | "daily";
declare type GeoprocessingServiceType = "javascript" | "container";
/** Expected public service metadata for each function */
export interface GeoprocessingServiceMetadata extends GeoprocessingHandlerOptions {
    rateLimit: boolean;
    restrictedAccess: boolean;
    /** Seconds */
    medianDuration: number;
    /** USD */
    medianCost: number;
    endpoint: string;
    type: GeoprocessingServiceType;
    clientSideBundle?: ClientCode;
    issAllowList: string[];
    rateLimited: boolean;
    rateLimitPeriod: RateLimitPeriod;
    rateLimitConsumed: number;
    uri: string;
}
export interface GeoprocessingProject {
    uri: string;
    apiVersion: string;
    geoprocessingServices: GeoprocessingServiceMetadata[];
    preprocessingServices: PreprocessingService[];
    clients: ReportClient[];
    feebackClients: DigitizingFeedbackClient[];
    title: string;
    author: string;
    organization?: string;
    relatedUri?: string;
    sourceUri?: string;
    published: string;
}
interface ClientCode {
    uri: string;
    offlineSupported: boolean;
}
interface PreprocessingService {
    title: string;
    endpoint: string;
    usesAttributes: string[];
    timeout: number;
    restrictedAccess: boolean;
    issAllowList?: Array<string>;
    clientSideBundle?: ClientCode;
}
interface ReportClient {
    title: string;
    uri: string;
    bundleSize: number;
    apiVersion: string;
    tabs: ReportTab[];
}
interface ReportTab {
    title: string;
}
interface DigitizingFeedbackClient {
    title: string;
    uri: string;
    bundleSize: number;
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
export interface GeoprocessingRequest {
    geometry?: Sketch;
    geometryUri?: string;
    token?: string;
    cacheKey?: string;
}
export declare const SeaSketchReportingMessageEventType = "SeaSketchReportingMessageEventType";
export interface SeaSketchReportingMessageEvent {
    client: string;
    sketchProperties: SketchProperties;
    geometryUri: string;
    type: "SeaSketchReportingMessageEventType";
}
export {};
