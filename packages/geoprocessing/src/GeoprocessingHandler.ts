import {
  GeoprocessingHandlerOptions,
  SketchCollection,
  Sketch,
  GeoprocessingRequest,
} from "./types";
import TaskModel, {
  commonHeaders,
  GeoprocessingTask,
  GeoprocessingTaskStatus,
} from "./tasks";
import { fetchGeoJSON } from "./geometry";
import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import {
  DynamoDB,
  Lambda as LambdaClient,
  ApiGatewayManagementApi,
} from "aws-sdk";

const WebSocket = require("ws");

const Lambda = new LambdaClient();
const Db = new DynamoDB.DocumentClient();

export class GeoprocessingHandler<T> {
  func: (sketch: Sketch | SketchCollection) => Promise<T>;
  options: GeoprocessingHandlerOptions;
  // Store last request id to avoid retries on a failure of the lambda
  // aws runs several retries and there appears to be no setting to avoid this
  lastRequestId?: string;
  Tasks: TaskModel;

  constructor(
    func: (sketch: Sketch | SketchCollection) => Promise<T>,
    options: GeoprocessingHandlerOptions
  ) {
    this.func = func;
    this.options = options;
    this.Tasks = new TaskModel(
      process.env.TASKS_TABLE!,
      process.env.ESTIMATES_TABLE!,
      Db
    );
  }

  async lambdaHandler(
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    const { Tasks, options } = this;

    const serviceName = options.title;

    const request = this.parseRequest(event);
    // TODO: Authorization
    // Bail out if replaying previous task
    if (context.awsRequestId && context.awsRequestId === this.lastRequestId) {
      // don't replay
      if (process.env.NODE_ENV !== "test") {
        console.info("cancelling since event is being replayed");
      }
      return {
        statusCode: 200,
        body: "",
      };
    } else {
      this.lastRequestId = context.awsRequestId;
    }

    let wss_ref = process.env.WSS_REF || "";
    let wss_region = process.env.WSS_REGION || "";
    let wss_stage = process.env.WSS_STAGE || "";
    let wss =
      "wss://" +
      encodeURIComponent(wss_ref) +
      ".execute-api." +
      encodeURIComponent(wss_region) +
      ".amazonaws.com/" +
      encodeURIComponent(wss_stage) +
      "?serviceName=" +
      serviceName;

    // check and respond with cache first if available
    if (!(process.env.RUN_AS_SYNC === "true") && request.cacheKey) {
      console.info(
        "this should be run for asynchronous threads..:->",
        process.env.RUN_AS_SYNC
      );
      let cachedResult = await Tasks.get(serviceName, request.cacheKey);

      if (
        cachedResult &&
        cachedResult.status !== GeoprocessingTaskStatus.Failed
      ) {
        console.info("sending socket message for cached results");

        //await this.sendSocketMessage(wss, request.cacheKey, serviceName);
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

    if (request.wss && request.wss.length > 0) {
      wss = request.wss;
    }

    let task: GeoprocessingTask = await Tasks.create(
      serviceName,
      request.cacheKey,
      context.awsRequestId,
      wss
    );
    if (false) {
      // TODO: container tasks
      return Tasks.fail(task, "Docker tasks not yet implemented");
    } else if (
      process.env.RUN_AS_SYNC === "true" ||
      this.options.executionMode === "sync"
    ) {
      //EITHER execution mode === sync -or-
      //this is the async method being run on the async lambda
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
      try {
        const featureSet = await fetchGeoJSON(request);
        try {
          const results = await this.func(featureSet);

          task.data = results;
          task.status = GeoprocessingTaskStatus.Completed;
          task.duration =
            new Date().getTime() - new Date(task.startedAt).getTime();

          //the duration has been updated, now update the estimates table
          await Tasks.updateEstimate(task);
          let promise = await Tasks.complete(task, results);

          if (this.options.executionMode !== "sync") {
            await this.sendSocketMessage(
              wss,
              request.cacheKey,
              serviceName,
              Tasks
            );
          }
          return promise;
        } catch (e) {
          return Tasks.fail(task, `Geoprocessing exception.\n${e.stack}`, e);
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
      //execution mode === async, and this is synchronous call that launches
      //the socket based asynchronous lambda.
      // launch async handler
      const asyncExecutionName = process.env.ASYNC_HANDLER_FUNCTION_NAME;
      if (!asyncExecutionName) {
        return Tasks.fail(task, `No async handler function name defined`);
      }

      try {
        let asyncStartTime = new Date().getTime();
        //@ts-ignore
        task.asyncStartTime = asyncStartTime;

        let params = event.queryStringParameters;
        if (params) {
          params["wss"] = wss;
        }
        event.queryStringParameters = params;
        let payload = JSON.stringify(event);
        await Lambda.invoke({
          FunctionName: asyncExecutionName,
          ClientContext: JSON.stringify(task),
          InvocationType: "Event",
          Payload: payload,
        }).promise();

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(task),
        };
      } catch (e) {
        const failMessage =
          `Could not launch async handler function: ` + asyncExecutionName;
        return Tasks.fail(task, failMessage);
      }
    }
  }
  async sendSocketMessage(
    wss: string,
    key: string | undefined,
    serviceName: string,
    Tasks
  ) {
    let socket = await this.getSendSocket(wss, key, serviceName, Tasks);

    let data = JSON.stringify({
      key: key,
      serviceName: serviceName,
    });

    let message = JSON.stringify({
      message: "sendmessage",
      data: data,
    });
    //@ts-ignore
    socket.send(message);
    //let the client close the connection
  }

  async getSendSocket(
    wss: string,
    key: string | undefined,
    serviceName: string,
    Tasks
  ) {
    let socket = new WebSocket(wss);
    return new Promise(function (resolve, reject) {
      socket.onopen = () => {
        resolve(socket);
      };
      socket.onerror = (error: any) => {
        console.warn("Error connecting socket to " + wss + " error: " + error);
        reject(error);
      };
      //this is for checking if the task has already finished, but the
      //client socket has just opened up...
      socket.onmessage = async function (event) {
        let incomingData = JSON.parse(event.data);
        let checkForCache = incomingData.checkForCache;
        let inCacheKey = incomingData.key;
        let inServiceName = incomingData.serviceName;
        if (
          checkForCache === "true" &&
          inCacheKey === key &&
          serviceName === inServiceName
        ) {
          let cachedResult = await Tasks.get(serviceName, inCacheKey);

          if (
            cachedResult &&
            cachedResult.status !== GeoprocessingTaskStatus.Failed
          ) {
            console.info(
              "-->>>>>>>>>>>>sending socket message for cached results for service: ",
              inServiceName
            );
            let data = JSON.stringify({
              key: key,
              serviceName: serviceName,
            });
            let message = JSON.stringify({
              message: "sendmessage",
              data: data,
            });
            socket.send(message);
          }
        }
      };
    });
  }

  parseRequest(event: APIGatewayProxyEvent): GeoprocessingRequest {
    let request: GeoprocessingRequest;
    if ("geometry" in event) {
      // likely coming from aws console
      request = event as GeoprocessingRequest;
    } else if (
      event.queryStringParameters &&
      event.queryStringParameters["geometryUri"]
    ) {
      request = {
        geometryUri: event.queryStringParameters["geometryUri"],
        cacheKey: event.queryStringParameters["cacheKey"],
        wss: event.queryStringParameters["wss"],
      };
    } else if (event.body && typeof event.body === "string") {
      request = JSON.parse(event.body);
    } else {
      throw new Error("Could not interpret incoming request");
    }
    process.env.INFO_MSG = process.env.INFO_MSG + " and request: " + request;
    return request;
  }
}
