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
import { DynamoDB, Lambda as LambdaClient } from "aws-sdk";

const Db = new DynamoDB.DocumentClient();

export class asyncGeoprocessingHandler<T> {
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

    let task: GeoprocessingTask = await Tasks.create(
      serviceName,
      request.cacheKey,
      context.awsRequestId
    );

    process.removeAllListeners("uncaughtException");
    process.removeAllListeners("unhandledRejection");
    process.on("uncaughtException", async (error) => {
      console.error(error);
      await Tasks.fail(
        task,
        error?.message?.toString() || error?.toString() || "Uncaught exception"
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
        return Tasks.complete(task, results);
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
      };
    } else if (event.body && typeof event.body === "string") {
      request = JSON.parse(event.body);
    } else {
      throw new Error("Could not interpret incoming request");
    }
    return request;
  }
}
