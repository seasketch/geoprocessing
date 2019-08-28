import { ExecutionMode, RateLimitPeriod } from "./service";
import TaskModel, { GeoprocessingTask } from "./tasks";
import { GeoprocessingRequest } from "./request";
import { fetchGeoJSON, Sketch } from "./geometry";
import {
  APIGatewayEvent,
  APIGatewayEventRequestContext,
  APIGatewayProxyResult
} from "aws-lambda";
import CacheModel from "./cache";
import AWS from "aws-sdk";
const Lambda = new AWS.Lambda();
import { DynamoDB } from "aws-sdk";
const db = new DynamoDB.DocumentClient();
const Tasks = TaskModel(process.env["HOST"] as string, process.env["TASK_TABLE"] as string, db);
const Cache = CacheModel(process.env["TASK_TABLE"] as string, db);

const { ASYNC_HANDLER_FUNCTION_NAME } = process.env;

export interface SeaSketchGeoprocessingSettings {
  /** Defaults to sync */
  executionMode?: ExecutionMode;
  /** Specify a subset of attributes used by the analysis. May improve cache performance if unrelated attributes are changed. */
  usesAttributes?: Array<string>;
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
}

export interface LambdaGeoprocessingFunction {
  (sketch: Sketch): Promise<any>;
}

export interface GeoprocessingServiceHandler {}

/**
 * Create a new lambda-based geoprocessing service
 *
 * @param {LambdaGeoprocessingFunction} lambda Function accepts a Sketch or SketchCollection and returns a Promise that yields json-serializable analysis output
 * @param {SeaSketchGeoprocessingSettings} [settings]
 * @returns Lamda handler
 */
function lambdaService(
  lambda: LambdaGeoprocessingFunction,
  settings?: SeaSketchGeoprocessingSettings
) {
  if (process.env.NODE_ENV === 'test') {
    return lambda;
  } else {
    return handlerFactory(lambda, settings) as GeoprocessingServiceHandler;
  }
}

/**
 * Create a new Docker-based geoprocessing service
 * 
 * @param {string} String identifier for an Image hosted on AWS ECR. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions
 * @param {SeaSketchGeoprocessingSettings} [settings]
 * @returns
 */
function dockerService(
  image: string,
  settings?: SeaSketchGeoprocessingSettings
) {
  return handlerFactory(image, settings) as GeoprocessingServiceHandler;
}

export { lambdaService, dockerService };

function isLambda(obj: any): obj is LambdaGeoprocessingFunction {
  return typeof obj !== "string";
}

function isContainerImage(obj: any): obj is string {
  return typeof obj === "string";
}

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
const handlerFactory = function(
  functionOrContainerImage: LambdaGeoprocessingFunction | string,
  settings?: SeaSketchGeoprocessingSettings
) {
  // TODO: Detect LambdaGeoprocessingFunctions that don't return a Promise
  // TODO: Rate limiting
  let lastRequestId: string | null = null;
  return async function handler(
    event: APIGatewayEvent,
    context: APIGatewayEventRequestContext
  ): Promise<APIGatewayProxyResult> {
    // Bail out if replaying previous task
    if (context.requestId === lastRequestId) {
      // don't replay
      console.log("cancelling since event is being replayed");
      return {
        statusCode: 200,
        body: ""
      };
    } else {
      lastRequestId = context.requestId;
    }
    const request: GeoprocessingRequest = JSON.parse(event.body || "{}");
    // check and respond with cache first if available
    if (request.cacheKey) {
      const cachedResult = await Cache.get(request.cacheKey);
      if (cachedResult) {
        return {
          statusCode: 200,
          body: JSON.stringify(cachedResult)
        };
      }
    }
    let task: GeoprocessingTask = await Tasks.create(
      request.cacheKey,
      context.requestId
    );
    if (isContainerImage(functionOrContainerImage)) {
      // return launchTask(ecrTask, featureSet);
      // TODO: Container tasks
      return Tasks.fail(task, "Docker tasks not yet implemented");
    } else if (!settings || settings.executionMode === "sync") {
      const lambda = functionOrContainerImage;
      // wrap geojson fetching in a try block in case the origin server fails
      try {
        const featureSet = await fetchGeoJSON(request);
        try {
          const results = await lambda(featureSet);
          return Tasks.complete(task, results);
        } catch (e) {
          return Tasks.fail(
            task,
            "Geoprocessing function threw an exception",
            e
          );
        }
      } catch (e) {
        return Tasks.fail(
          task,
          request.geometryUri
            ? `Failed to retrieve geometry from ${request.geometryUri}`
            : `Failed to extract geometry from request`,
          e
        );
      }
    } else {
      // TODO: async executionMode
      // launch async handler
      if (!ASYNC_HANDLER_FUNCTION_NAME) {
        return Tasks.fail(task, "ASYNC_HANDLER_FUNCTION_NAME env var not set");
      } else {
        try {
          await Lambda.invokeAsync({
            FunctionName: ASYNC_HANDLER_FUNCTION_NAME,
            InvokeArgs: JSON.stringify(task)
          }).promise();
          return {
            statusCode: 200,
            body: JSON.stringify(task)
          };
        } catch (e) {
          return Tasks.fail(task, `Could not launch async handler function`);
        }
      }
    }
  };
};

const asyncTaskHandler = async (task: GeoprocessingTask) => {};
