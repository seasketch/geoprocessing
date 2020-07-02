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
    this.Tasks = new TaskModel(process.env.TASKS_TABLE!, Db);
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
        console.log("cancelling since event is being replayed");
      }
      return {
        statusCode: 200,
        body: "",
      };
    } else {
      this.lastRequestId = context.awsRequestId;
    }

    // check and respond with cache first if available
    if (!(process.env.RUN_AS_SYNC === "true") && request.cacheKey) {
      console.info("getting cached");
      const cachedResult = await Tasks.get(serviceName, request.cacheKey);
      if (
        cachedResult &&
        cachedResult.status !== GeoprocessingTaskStatus.Failed
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

    let wss =
      "wss://" +
      process.env.WSS_REF +
      ".execute-api." +
      process.env.WSS_REGION +
      ".amazonaws.com/" +
      process.env.WSS_STAGE;

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
        process.env.INFO_MSG = "getting feature geojson...";
        console.info("getting feature geojson....");
        const featureSet = await fetchGeoJSON(request);
        try {
          console.info("getting results of function...");
          const results = await this.func(featureSet);
          console.info("running function...");
          task.data = results;
          task.status = GeoprocessingTaskStatus.Completed;
          task.duration =
            new Date().getTime() - new Date(task.startedAt).getTime();

          console.info("nowdone, marking complete ");
          let promise = await Tasks.complete(task, results);
          if (this.options.executionMode !== "sync") {
            console.info("sending socket info...");
            let socket = await this.sendSocketInfo(wss);
            let message = JSON.stringify({
              message: "sendmessage",
              data: JSON.stringify(task),
            });
            console.info("sending message: ", message);
            //@ts-ignore
            socket.send(message);
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
          `-->>> Could not launch async handler function: ` +
          e +
          " :: uri... " +
          asyncExecutionName;
        return Tasks.fail(task, failMessage);
      }
    }
  }

  sendSocketInfo(wss: string) {
    return new Promise(function (resolve, reject) {
      let socket = new WebSocket(wss);
      socket.onopen = () => {
        resolve(socket);
      };
      socket.onerror = (error: any) => {
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
