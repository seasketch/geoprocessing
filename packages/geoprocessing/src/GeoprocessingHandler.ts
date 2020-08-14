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
        console.warn("-------->>>>> cancelling since event is being replayed");
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
      encodeURIComponent(wss_stage);

    if (request.checkCacheOnly) {
      if (request.cacheKey) {
        let cachedResult = await Tasks.get(serviceName, request.cacheKey);

        if (
          cachedResult &&
          cachedResult?.status !== GeoprocessingTaskStatus.Pending
        ) {
          return {
            statusCode: 200,
            headers: {
              ...commonHeaders,
              "x-gp-cache": "Cache hit",
            },
            body: JSON.stringify(cachedResult),
          };
        } else {
          return {
            statusCode: 200,
            headers: {
              ...commonHeaders,
              "x-gp-cache": "Cache hit",
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

    // check and respond with cache first if available
    if (!(process.env.RUN_AS_SYNC === "true") && request.cacheKey) {
      let cachedResult = await Tasks.get(serviceName, request.cacheKey);
      if (
        cachedResult &&
        cachedResult.status !== GeoprocessingTaskStatus.Pending
      ) {
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
            //let fetchedTask = await Tasks.get(task.service, task.id);

            let sname = encodeURIComponent(task.service);
            let ck = encodeURIComponent(task.id || "");
            let wssUrl =
              task.wss + "?" + "serviceName=" + sname + "&cacheKey=" + ck;

            await this.sendSocketMessage(wssUrl, task.id, task.service);
          }
          return promise;
        } catch (e) {
          let sname = encodeURIComponent(task.service);
          let ck = encodeURIComponent(task.id || "");
          let wssUrl =
            task.wss + "?" + "serviceName=" + sname + "&cacheKey=" + ck;

          let failureMessage = `Geoprocessing exception: \n${e.stack}`;
          await this.sendSocketErrorMessage(
            wssUrl,
            request.cacheKey,
            serviceName,
            failureMessage
          );
          let failedTask = await Tasks.fail(task, failureMessage);
          return failedTask;
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

  async sendSocketErrorMessage(
    wss: string,
    key: string | undefined,
    serviceName: string,
    failureMessage: string
  ) {
    let socket = (await this.getSendSocket(wss, key, serviceName)) as WebSocket;

    let data = JSON.stringify({
      cacheKey: key,
      serviceName: serviceName,
      failureMessage: failureMessage,
    });

    let message = JSON.stringify({
      message: "sendmessage",
      data: data,
    });

    socket.send(message);
    socket.close(1000, serviceName);
  }

  async sendSocketMessage(
    wss: string,
    key: string | undefined,
    serviceName: string
  ) {
    let socket = (await this.getSendSocket(wss, key, serviceName)) as WebSocket;

    let data = JSON.stringify({
      cacheKey: key,
      serviceName: serviceName,
      fromClient: "false",
    });

    let message = JSON.stringify({
      message: "sendmessage",
      data: data,
    });

    socket.send(message);
    socket.close(1000, serviceName);
  }

  async getSendSocket(
    wss: string,
    key: string | undefined,
    serviceName: string
  ): Promise<WebSocket> {
    let socket = new WebSocket(wss);
    return new Promise(function (resolve, reject) {
      socket.onopen = () => {
        resolve(socket);
      };
      socket.onerror = (error: any) => {
        console.warn(
          "Error connecting socket to " + wss + " error: " + error.toString()
        );
        reject(error);
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
        checkCacheOnly: event.queryStringParameters["checkCacheOnly"],
        onSocketConnect: event.queryStringParameters["onConnect"],
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
