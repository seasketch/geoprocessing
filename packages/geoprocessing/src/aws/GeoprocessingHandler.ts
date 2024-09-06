import {
  GeoprocessingHandlerOptions,
  Sketch,
  SketchCollection,
  Geometry,
  Feature,
  FeatureCollection,
  Polygon,
  LineString,
  Point,
  JSONValue,
  GeoprocessingRequestModel,
} from "../types/index.js";
import TaskModel, {
  commonHeaders,
  GeoprocessingTask,
  GeoprocessingTaskStatus,
} from "./tasks.js";
import { fetchGeoJSON } from "../datasources/seasketch.js";
import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda";
import { unescape } from "querystring";
import WebSocket from "ws";

const Db = DynamoDBDocument.from(new DynamoDB());

let NODE_ENV = "";
let TASKS_TABLE = "";
let ESTIMATES_TABLE = "";
let ASYNC_REQUEST_TYPE = "";
let RUN_HANDLER_FUNCTION_NAME = "";
let WSS_REF = "";
let WSS_REGION = "";
let WSS_STAGE = "";

if (process) {
  NODE_ENV = process.env.NODE_ENV || "";
  TASKS_TABLE = process.env.TASKS_TABLE || "";
  ESTIMATES_TABLE = process.env.ESTIMATES_TABLE || "";
  ASYNC_REQUEST_TYPE = process.env.ASYNC_REQUEST_TYPE || "";
  RUN_HANDLER_FUNCTION_NAME = process.env.RUN_HANDLER_FUNCTION_NAME || "";
  WSS_REF = process.env.WSS_REF || "";
  WSS_REGION = process.env.WSS_REGION || "";
  WSS_STAGE = process.env.WSS_STAGE || "";
}

/**
 * Manages the task of executing a geoprocessing function within an AWS Lambda function.
 * This includes sending estimate of completion, caching the results, and getting them back to the client.
 * Supports 2 different execution modes for running a geoprocessing function - sync and async
 * These modes create 3 different request scenarios.  A lambda is created for each scenario, and they all run
 * this one handler.
 * 1 - sync executionMode - immediately run gp function and return result in resolved promise to client
 * 2 - async executionMode, ASYNC_REQUEST_TYPE=start - invoke a second lambda to run gp function and return incomplete task to client with socket for notification of result
 * 3 - async executionMode, ASYNC_REQUEST_TYPE=run - run gp function started by scenario 2 and send completed task info on socket for client to pick up result
 *
 * @template T the return type of the geoprocessing function, automatically set from func return type
 * @template G the geometry type of features for the geoprocessing function, automatically set from func feature type
 * @template P extra parameters to pass to geoprocessing function, automatically set from func parameter type
 */
export class GeoprocessingHandler<
  T = JSONValue,
  G extends Geometry = Polygon | LineString | Point,
  P extends Record<string, JSONValue> = Record<string, JSONValue>,
> {
  func: (
    feature:
      | Feature<G>
      | FeatureCollection<G>
      | Sketch<G>
      | SketchCollection<G>,
    /** Optional additional runtime parameters from report client for geoprocessing function.  Validation left to implementing function */
    extraParams?: P,
    /** Original event params used to invoke geoprocessing function made accessible to func */
    request?: GeoprocessingRequestModel<G>
  ) => Promise<T>;
  options: GeoprocessingHandlerOptions;
  // Store last request id to avoid retries on a failure of the lambda
  // aws runs several retries and there appears to be no setting to avoid this
  lastRequestId?: string;
  Tasks: TaskModel;

  /**
   * @param func the geoprocessing function to run
   * @param options geoprocessing function deployment options
   * @template G the geometry type of features for the geoprocessing function, automatically set from func feature type
   * @template P extra parameters to pass to geoprocessing function, automatically set from func parameter type
   * @template T the return type of the geoprocessing function, automatically set from func return type
   */
  constructor(
    func: (
      feature: Feature<G> | FeatureCollection<G>,
      extraParams: P,
      request?: GeoprocessingRequestModel<G>
    ) => Promise<T>,
    options: GeoprocessingHandlerOptions
  );
  constructor(
    func: (
      feature: Sketch<G> | SketchCollection<G>,
      extraParams: P,
      request?: GeoprocessingRequestModel<G>
    ) => Promise<T>,
    options: GeoprocessingHandlerOptions
  );
  constructor(
    func: (feature, extraParams, request) => Promise<T>,
    options: GeoprocessingHandlerOptions
  ) {
    this.func = func;
    this.options = Object.assign({ memory: 1024 }, options);
    this.Tasks = new TaskModel(TASKS_TABLE!, ESTIMATES_TABLE!, Db);
  }

  /**
   * Given request event, runs geoprocessing function and returns APIGatewayProxyResult with task status in the body
   * If sync executionMode, then result is returned with task, if async executionMode, then returns socket for client to listen for task update
   * If event.geometry present, assumes request is already a GeoprocessingRequest (from AWS console).
   * If event.queryStringParameters present, request must be from API Gateway and need to coerce into GeoprocessingRequest
   * If event.body present with JSON string, then parse as a GeoprocessingRequest
   */
  async lambdaHandler(
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    const { Tasks, options } = this;
    const serviceName = options.title;

    // console.log("event", JSON.stringify(event, null, 2));
    // console.log("context", JSON.stringify(context, null, 2));

    const request = this.parseRequest<G>(event);

    const handlerTime = Date.now();
    console.time(`handler ${this.options.title} - ${handlerTime}`);

    // TODO: Authorization
    // Bail out if replaying previous task
    if (context.awsRequestId && context.awsRequestId === this.lastRequestId) {
      // don't replay
      if (NODE_ENV !== "test") {
        console.warn("-------->>>>> cancelling since event is being replayed");
      }
      return {
        statusCode: 200,
        body: "",
      };
    } else {
      this.lastRequestId = context.awsRequestId;
    }

    if (process.env.NODE_ENV !== "test")
      console.log(
        `${this.options.executionMode} ${
          ASYNC_REQUEST_TYPE ? ASYNC_REQUEST_TYPE : "sync"
        } request`,
        JSON.stringify(request)
      );

    // get cached result if available. standard method to get results for async function
    if (request.checkCacheOnly) {
      if (request.cacheKey) {
        console.log(
          "checkCacheOnly task get with",
          serviceName,
          request.cacheKey
        );
        const timestamp = Date.now();
        console.time(
          `checkCacheOnly task get ${this.options.title} - ${timestamp}`
        );
        let cachedResult = await Tasks.get(serviceName, request.cacheKey);
        console.timeEnd(
          `checkCacheOnly task get ${this.options.title} - ${timestamp}`
        );

        if (
          cachedResult &&
          cachedResult?.status !== GeoprocessingTaskStatus.Pending
        ) {
          // cache hit
          if (process.env.NODE_ENV !== "test")
            console.log(
              `checkCacheOnly cache hit for ${serviceName} using cacheKey ${request.cacheKey}`
            );
          return {
            statusCode: 200,
            headers: {
              ...commonHeaders,
              "x-gp-cache": "Cache hit",
            },
            body: JSON.stringify(cachedResult),
          };
        } else {
          // cache miss
          if (process.env.NODE_ENV !== "test")
            console.log(
              `checkCacheOnly cache miss for ${serviceName} using cacheKey ${request.cacheKey}`
            );
          return {
            statusCode: 200,
            headers: {
              ...commonHeaders,
              "x-gp-cache": "Cache miss",
            },
            body: JSON.stringify({
              id: "NO_CACHE_HIT",
              key: request.cacheKey,
              serviceName: serviceName,
            }),
          };
        }
      }
    }

    // respond with cached result right away if available
    if (
      request.cacheKey &&
      (this.options.executionMode === "sync" || ASYNC_REQUEST_TYPE === "start")
    ) {
      const timestamp = Date.now();
      console.time(`sync task get ${this.options.title} - ${timestamp}`);
      let cachedResult = await Tasks.get(serviceName, request.cacheKey);
      console.timeEnd(`sync task get ${this.options.title} - ${timestamp}`);
      if (
        cachedResult &&
        cachedResult.status !== GeoprocessingTaskStatus.Pending
      ) {
        if (process.env.NODE_ENV !== "test")
          console.log(
            `Cache hit for ${serviceName} using cacheKey ${request.cacheKey}`
          );
        return {
          statusCode: 200,
          headers: {
            ...commonHeaders,
            "x-gp-cache": "Cache hit",
          },
          body: JSON.stringify(cachedResult),
        };
      }
    }

    let wss =
      "wss://" +
      encodeURIComponent(WSS_REF) +
      ".execute-api." +
      encodeURIComponent(WSS_REGION) +
      ".amazonaws.com/" +
      encodeURIComponent(WSS_STAGE);
    if (request.wss && request.wss.length > 0) {
      wss = request.wss;
    }

    let task: GeoprocessingTask = await Tasks.create(serviceName, {
      id: request.cacheKey,
      wss,
      disableCache: request.disableCache,
    });

    if (
      this.options.executionMode === "sync" ||
      (this.options.executionMode === "async" && ASYNC_REQUEST_TYPE === "run")
    ) {
      // Execute the gp function immediately and if sync executionMode then resolve a promise with complete task result
      // if async then send socket message with task id for client to get result
      if (process) {
        process.removeAllListeners("uncaughtException");
        process.removeAllListeners("unhandledRejection");
        process.on("uncaughtException", async (error) => {
          console.error(error);
          await Tasks.fail(
            task,
            error?.message?.toString() ||
              error?.toString() ||
              "Uncaught exception"
          );
          process.exit();
        });

        process.on("unhandledRejection", async (error) => {
          console.error(error);
          await Tasks.fail(
            task,
            error?.toString() || "Unhandled promise rejection"
          );
          process.exit();
        });
      }
      try {
        const featureSet = await fetchGeoJSON<G>(request);
        const extraParams = request.extraParams as unknown as P;
        try {
          const tsRun = Date.now();
          console.time(`run func ${this.options.title} - ${tsRun}`);
          const results = await this.func(featureSet, extraParams, request);
          console.timeEnd(`run func ${this.options.title} - ${tsRun}`);

          task.data = results;
          task.status = GeoprocessingTaskStatus.Completed;
          task.duration =
            new Date().getTime() - new Date(task.startedAt).getTime();

          //the duration has been updated, now update the estimates table
          await Tasks.updateEstimate(task);
          const tsComplete = Date.now();
          console.time(`task complete ${this.options.title} - ${tsComplete}`);
          let promise = await Tasks.complete(task, results);
          console.timeEnd(
            `task complete ${this.options.title} - ${tsComplete}`
          );

          if (this.options.executionMode !== "sync") {
            let sname = encodeURIComponent(task.service);
            let ck = encodeURIComponent(task.id || "");
            let wssUrl =
              task.wss + "?" + "serviceName=" + sname + "&cacheKey=" + ck;
            await this.sendSocketMessage(wssUrl, task.id, task.service);
            console.info(
              `sent task ${task.id} result to socket ${wssUrl} for service ${task.service}`
            );
          }

          console.timeEnd(`handler ${this.options.title} - ${handlerTime}`);

          return promise;
        } catch (e: unknown) {
          let failureMessage = `Error while running geoprocessing function ${this.options.title}`;
          if (e instanceof Error) {
            failureMessage += `: ${e.message}`;
          }
          console.log(failureMessage);
          if (e instanceof Error) {
            console.error(e.message);
            console.error(e.stack);
          }

          if (this.options.executionMode !== "sync") {
            let sname = encodeURIComponent(task.service);
            let ck = encodeURIComponent(task.id || "");
            let wssUrl =
              task.wss + "?" + "serviceName=" + sname + "&cacheKey=" + ck;
            await this.sendSocketErrorMessage(
              wssUrl,
              request.cacheKey,
              serviceName,
              failureMessage
            );
          }

          let failedTask = await Tasks.fail(task, failureMessage);
          return failedTask;
        }
      } catch (e: unknown) {
        return Tasks.fail(
          task,
          request.geometryUri
            ? `Failed to retrieve geometry from ${request.geometryUri}`
            : `Failed to extract geometry from request`,
          e as Error
        );
      }
    } else {
      // Otherwise must be initial request in async executionMode
      // Invoke a second lambda to run the gp function and return incomplete task meta
      if (!RUN_HANDLER_FUNCTION_NAME) {
        return Tasks.fail(task, `No async handler function name defined`);
      }

      try {
        let asyncStartTime = new Date().getTime();
        //@ts-ignore
        task.asyncStartTime = asyncStartTime;

        let queryParams = event.queryStringParameters;
        if (queryParams) {
          queryParams["wss"] = wss;
        }
        event.queryStringParameters = queryParams;
        let payload = JSON.stringify(event);

        const client = new LambdaClient({});
        console.log("Invoking run handler: ", RUN_HANDLER_FUNCTION_NAME);
        const command = new InvokeCommand({
          FunctionName: RUN_HANDLER_FUNCTION_NAME,
          Payload: payload,
          LogType: LogType.Tail,
          InvocationType: "Event",
        });
        await client.send(command);

        console.timeEnd(`handler ${this.options.title} - ${handlerTime}`);

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(task),
        };
      } catch (e) {
        console.error(e);
        const failMessage =
          `Could not launch async handler function: ` +
          RUN_HANDLER_FUNCTION_NAME;
        return Tasks.fail(task, failMessage);
      }
    }
  }

  /**
   * Send task error message
   */
  async sendSocketErrorMessage(
    wss: string,
    cacheKey: string | undefined,
    serviceName: string,
    failureMessage: string
  ) {
    let socket = await this.getSocket(wss);

    let data = JSON.stringify({
      cacheKey,
      serviceName: serviceName,
      failureMessage: failureMessage,
    });

    let message = JSON.stringify({
      message: "sendmessage",
      data: data,
    });

    console.log("sendSocketErrorMessage", message);

    socket.send(message);
    socket.close(1000, serviceName);
  }

  /**
   * Send completed task message
   */
  async sendSocketMessage(
    wss: string,
    cacheKey: string | undefined,
    serviceName: string
  ) {
    let socket = await this.getSocket(wss);

    let data = JSON.stringify({
      cacheKey,
      serviceName: serviceName,
      fromClient: "false",
      timestamp: Date.now(),
    });

    // hit sendmessage route, invoking sendmessage lambda
    let message = JSON.stringify({
      message: "sendmessage",
      data: data,
    });
    console.log("sendSocketMessage", message);
    socket.send(message);
    socket.close(1000, serviceName);
  }

  /**
   * Returns a new socket connection to send a message
   */
  async getSocket(wss: string): Promise<WebSocket> {
    const socket = new WebSocket(wss) as WebSocket;
    return new Promise(function (resolve, reject) {
      socket.onopen = () => {
        resolve(socket);
      };
      socket.onerror = (error: any) => {
        console.warn("Error connecting socket to " + wss + " error: ");
        console.warn(JSON.stringify(error));
        reject(error);
      };
    });
  }

  /**
   * Parses event and returns GeoprocessingRequestModel object.
   */
  parseRequest<G>(event: APIGatewayProxyEvent): GeoprocessingRequestModel<G> {
    let request: GeoprocessingRequestModel<G>;
    if ("geometry" in event || "geometryUri" in event) {
      // Is direct aws invocation, so should already be in internal model form
      request = event as GeoprocessingRequestModel<G>;
    } else if (
      event.queryStringParameters &&
      event.queryStringParameters["geometryUri"]
    ) {
      // Is GET request with query string parameters
      // parse extraParams object from query string if necessary, though gateway lambda integration seems to do it for us
      const extraString = event.queryStringParameters["extraParams"];
      let extraParams: P | undefined;
      if (typeof extraString === "string") {
        extraParams = JSON.parse(unescape(extraString));
      } else {
        extraParams = extraString;
      }

      request = {
        geometryUri: event.queryStringParameters["geometryUri"],
        cacheKey: event.queryStringParameters["cacheKey"],
        wss: event.queryStringParameters["wss"],
        checkCacheOnly: event.queryStringParameters["checkCacheOnly"],
        extraParams,
      };
    } else if (event.body && typeof event.body === "string") {
      // Is POST request
      request = JSON.parse(event.body);
    } else {
      throw new Error("Could not interpret incoming request");
    }

    return request;
  }
}
