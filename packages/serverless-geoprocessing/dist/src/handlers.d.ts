import { Sketch } from "./geometry";
import { Context, APIGatewayProxyResult } from "aws-lambda";
export declare type ExecutionMode = "async" | "sync";
export declare type RateLimitPeriod = "monthly" | "daily";
export interface GeoprocessingRequest {
    geometry?: Sketch;
    geometryUri?: string;
    token?: string;
    cacheKey?: string;
}
export interface SeaSketchGeoprocessingSettings {
    /** Defaults to sync */
    executionMode?: ExecutionMode;
    /** Specify a subset of attributes used by the analysis. May improve cache performance if unrelated attributes are changed. */
    requiredAttributes?: Array<string>;
    /** Defaults to false */
    rateLimited?: boolean;
    /** Defaults to daily */
    rateLimitPeriod?: RateLimitPeriod;
    /** Defaults to 1000 */
    rateLimit?: number;
    /** If set, requests must include a token with an allowed issuer (iss) */
    restrictedAccess?: boolean;
    /** Required if restrictedAccess is set. e.g. [sensitive-project.seasketch.org] */
    issAllowList?: Array<string>;
    serviceName: string;
    tasksTable: string;
}
export interface LambdaGeoprocessingFunction {
    (sketch: Sketch): Promise<any> | any;
}
export interface GeoprocessingServiceHandler {
}
/**
 * Create a new lambda-based geoprocessing service
 *
 * @param {LambdaGeoprocessingFunction} lambda Function accepts a Sketch or SketchCollection and returns a Promise that yields json-serializable analysis output
 * @param {SeaSketchGeoprocessingSettings} [settings]
 * @returns Lamda handler
 */
declare function lambdaService(lambda: LambdaGeoprocessingFunction, settings: SeaSketchGeoprocessingSettings): (event: import("aws-lambda").APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
/**
 * Create a new Docker-based geoprocessing service
 *
 * @param {string} String identifier for an Image hosted on AWS ECR. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions
 * @param {SeaSketchGeoprocessingSettings} [settings]
 * @returns
 */
declare function dockerService(image: string, settings: SeaSketchGeoprocessingSettings): GeoprocessingServiceHandler;
export { lambdaService, dockerService };
/**
 * handlerFactory() accepts either a geoprocessing function or a container
 * task identifier and returns a new function that can be used directly by
 * aws lambda.
 *
 * The returned handler() is the initial responder to geoprocessing requests.
 * It will load spatial features from the given request, respond with a cache
 * if available, and either run the geoprocessing script in the case of a sync
 * service, or delegate to another lambda or container for async.
 *
 * @param {(LambdaGeoprocessingFunction | string)} functionOrContainerImage Lambda function or Docker image location
 * @param {SeaSketchGeoprocessingSettings} settings
 * @returns Handler function that can be passed to serverless framework
 */
export declare const handlerFactory: (functionOrContainerImage: string | LambdaGeoprocessingFunction, settings: SeaSketchGeoprocessingSettings) => (event: import("aws-lambda").APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
