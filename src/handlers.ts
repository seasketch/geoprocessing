import { ExecutionMode } from "./service";
import TaskModel, { GeoprocessingTask } from "./tasks";
import { GeoprocessingRequest, GeoprocessingRequestParameters } from "./request";
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
const Tasks = TaskModel(process.env["HOST"], process.env["TASK_TABLE"], db);
const Cache = CacheModel(process.env["TASK_TABLE"], db);

const EXECUTION_MODE: ExecutionMode =
  (process.env["EXECUTION_MODE"] as ExecutionMode) || "sync";
const { ASYNC_HANDLER_FUNCTION_NAME } = process.env;

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
 * @param lambda Async function that accepts a features and returns results
 * for client rendering
 * @param ecsTaskDefinition ECS Task identifier for running Docker-based
 * workflows
 */
export const handlerFactory = function(
  lambda?: (subject: Sketch, parameters: GeoprocessingRequestParameters) => Promise<any>,
  ecsTaskDefinition?: string
) {
  var lastRequestId = null;
  return async function handler(
    event: APIGatewayEvent,
    context: APIGatewayEventRequestContext
  ): Promise<APIGatewayProxyResult> {
    // Bail out if replaying previous task
    if (context.requestId === lastRequestId) {
      // don't replay
      console.log("cancelling since event is being replayed");
      return null;
    } else {
      lastRequestId = context.requestId;
    }
    const request: GeoprocessingRequest = JSON.parse(event.body);
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
    if (ecsTaskDefinition) {
      // return launchTask(ecrTask, featureSet);
      return;
    } else if (EXECUTION_MODE === "sync") {
      // wrap geojson fetching in a try block in case the origin server fails
      try {
        const featureSet = await fetchGeoJSON(request);
        try {
          const results = await lambda(featureSet, request.parameters);
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
      // launch async handler
      if (!ASYNC_HANDLER_FUNCTION_NAME) {
        return Tasks.fail(task, "ASYNC_HANDLER_FUNCTION_NAME env var not set");
      } else {
        try {
          await Lambda.invokeAsync({
            FunctionName: "AsyncHandler",
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
