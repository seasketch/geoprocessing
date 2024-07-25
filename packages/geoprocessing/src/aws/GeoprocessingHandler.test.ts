import { describe, test, expect } from "vitest";
import { GeoprocessingHandler } from "./GeoprocessingHandler.js";
import {
  TasksModel,
  GeoprocessingTask,
  GeoprocessingTaskStatus,
} from "./tasks.js";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";
import {
  Sketch,
  SketchCollection,
  Feature,
  FeatureCollection,
} from "../types/index.js";

import fetchMock from "vitest-fetch-mock";
import deepEqual from "fast-deep-equal";
import awsSdk from "aws-sdk";

const Db = new awsSdk.DynamoDB.DocumentClient();
const fetchMocker = fetchMock(vi);
fetchMocker.enableMocks();

const init = TasksModel.prototype.init;

vi.mock("./tasks.js", async () => {
  const TasksModule = await vi.importActual("./tasks.js");

  return {
    // Start with actual module
    ...TasksModule,
    TasksModel: vi.fn().mockReturnValue({
      init: init,

      create: async (service: string, cacheKey: string) => {
        const task = new TasksModel("tasks", "estimates", Db);
        task.init(service, cacheKey);
        return task;
      },

      complete: async (task: GeoprocessingTask, results: any) => {
        task.data = results;
        task.status = GeoprocessingTaskStatus.Completed;
        task.duration =
          new Date().getTime() - new Date(task.startedAt).getTime();
        lastSavedTask = task;
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(task),
        };
      },

      fail: async (
        task: GeoprocessingTask,
        errorDescription: string,
        error?: Error
      ) => {
        task.status = GeoprocessingTaskStatus.Failed;
        task.duration =
          new Date().getTime() - new Date(task.startedAt).getTime();
        task.error = errorDescription;
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(task),
        };
      },
      get: vi.fn(),
    }),
  };
});

// Mock task methods, using actual implementation for init
// const init = TasksModel.prototype.init;
// jest.mock("./tasks");

// Mock TasksModel class methods, without use of dynamodb

// TasksModel.prototype.create.mockImplementation(
//   async (service: string, cacheKey: string) => {
//     const task = new TasksModel("tasks", "estimates", Db);
//     task.init(service, cacheKey);
//     return task;
//   }
// );

// @ts-ignore
// TasksModel.prototype.fail.mockImplementation(
//   async (task: GeoprocessingTask, errorDescription: string, error?: Error) => {
//     task.status = GeoprocessingTaskStatus.Failed;
//     task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
//     task.error = errorDescription;
//     return {
//       statusCode: 500,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Credentials": true,
//       },
//       body: JSON.stringify(task),
//     };
//   }
// );

/** Simple in-memory cache for last saved task */
let lastSavedTask: GeoprocessingTask;

/**
 * Implements mock for Tasks.complete that returns the last saved task
 */
// @ts-ignore
// TasksModel.prototype.complete.mockImplementation(
//   async (task: GeoprocessingTask, results: any) => {
//     task.data = results;
//     task.status = GeoprocessingTaskStatus.Completed;
//     task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
//     lastSavedTask = task;
//     return {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Credentials": true,
//       },
//       body: JSON.stringify(task),
//     };
//   }
// );

const exampleSketch = {
  type: "Feature",
  properties: {
    id: uuid(),
    sketchClassId: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "My Sketch",
  },
  geometry: {
    type: "Point",
    coordinates: [1, 2],
  },
};

const exampleResponse = {
  foo: "bar",
  id: exampleSketch.properties.id,
};

const exampleFeature = {
  type: "Feature",
  properties: {
    id: uuid(),
  },
  geometry: {
    type: "Point",
    coordinates: [1, 2],
  },
};

const exampleFeatureResponse = {
  foo: "bar",
  id: exampleFeature.properties.id,
};

// fetchMock.get("https://example.com/geom/123", JSON.stringify(exampleSketch));

describe("GeoprocessingHandler", () => {
  beforeEach(() => {
    fetchMocker.mockIf(/^https?:\/\/example.com.*$/, (req) => {
      if (req.url.endsWith("/geom/123")) {
        return JSON.stringify(exampleSketch);
      } else if (req.url.endsWith("/geom/500")) {
        return {
          status: 500,
          body: "Error",
        };
      } else {
        return {
          status: 404,
          body: "Not Found",
        };
      }
    });
  });

  test.skip("Handler can be constructed and run simple async geoprocessing", async () => {
    process.env.RUN_HANDLER_FUNCTION_NAME = "MockLambda";
    const handler = new GeoprocessingHandler(
      async (sketch) => {
        const sketchId = (sketch as Sketch).properties.id;
        return { foo: "bar", id: sketchId };
      },
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "async",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    expect(handler.options.title).toBe("TestGP");
    // @ts-ignore
    Tasks.prototype.get.mockResolvedValueOnce(false);

    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
          wss: "wss://localhost:1234",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );

    //expect(result.statusCode).toBe(200);
    const task = JSON.parse(result.body) as GeoprocessingTask;
    console.log("task-->>>> ", task);
    expect(task.status).toBe(GeoprocessingTaskStatus.Failed);
    expect(task.data.foo).toBe("bar");
    // make sure cors headers are set
    expect(result.headers!["Access-Control-Allow-Origin"]).toBe("*");
    expect(result.headers!["Access-Control-Allow-Credentials"]).toBe(true);
    expect(task.data.id).toBe(exampleSketch.properties.id);
  });

  test.skip("Sketch handler can be constructed and run simple geoprocessing", async () => {
    const handler = new GeoprocessingHandler(
      async (sketch: Sketch | SketchCollection) => exampleResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    expect(handler.options.title).toBe("TestGP");
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);

    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometry: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.statusCode).toBe(200);
    const task = JSON.parse(result.body) as GeoprocessingTask;
    expect(task.status).toBe(GeoprocessingTaskStatus.Completed);
    expect(task.data.foo).toBe("bar");
    // make sure cors headers are set
    expect(result.headers!["Access-Control-Allow-Origin"]).toBe("*");
    expect(result.headers!["Access-Control-Allow-Credentials"]).toBe(true);
    expect(task.data.id).toBe(exampleSketch.properties.id);
  });

  test.skip("Feature handler can be constructed and run simple geoprocessing", async () => {
    const handler = new GeoprocessingHandler(
      async (feature: Feature | FeatureCollection) => exampleFeatureResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    expect(handler.options.title).toBe("TestGP");
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);

    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.statusCode).toBe(200);
    const task = JSON.parse(result.body) as GeoprocessingTask;
    expect(task.status).toBe(GeoprocessingTaskStatus.Completed);
    expect(task.data.foo).toBe("bar");
    // make sure cors headers are set
    expect(result.headers!["Access-Control-Allow-Origin"]).toBe("*");
    expect(result.headers!["Access-Control-Allow-Credentials"]).toBe(true);
    expect(task.data.id).toBe(exampleFeature.properties.id);
  });

  test.skip("Repeated requests should be 'cancelled'", async () => {
    const handler = new GeoprocessingHandler(
      async (feature) => exampleResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);
    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    const result2 = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.body.length).toBeGreaterThan(1);
    expect(result2.body.length).toBe(0);
    expect(result2.statusCode).toBe(200);
  });

  //these are dumb copies of the sync calls, just want to make
  //sure that the async ones follow the same behavior for caching and
  //cancelling repeats
  test.skip("Repeated requests should be 'cancelled' for async tasks", async () => {
    const handler = new GeoprocessingHandler(
      async (feature) => exampleResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "async",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);
    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    const result2 = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.body.length).toBeGreaterThan(1);
    expect(result2.body.length).toBe(0);
    expect(result2.statusCode).toBe(200);
  });

  test.skip("Results are cached using request.cacheKey", async () => {
    const handler = new GeoprocessingHandler(
      async (feature) => exampleResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    // @ts-ignore
    TasksModel.prototype.get.mockImplementation(
      async (service: string, cacheKey: string) => {
        if (cacheKey === "abc123") {
          return lastSavedTask;
        } else {
          return false;
        }
      }
    );
    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    const result2 = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "bar" }
    );
    // @ts-ignore
    TasksModel.prototype.get.mockReset();
    expect(result.body.length).toBeGreaterThan(1);
    expect(result2.body.length).toBeGreaterThan(1);
    const task1 = JSON.parse(result.body) as GeoprocessingTask;
    const task2 = JSON.parse(result2.body) as GeoprocessingTask;
    const task1ms = new Date(task1.startedAt).valueOf();
    const task2ms = new Date(task2.startedAt).valueOf();
    expect(task2ms - task1ms).toBeLessThanOrEqual(50);
  });

  test.skip("Results are cached using request.cacheKey for asynchronous tasks", async () => {
    const handler = new GeoprocessingHandler(
      async (feature) => exampleResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "async",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    // @ts-ignore
    TasksModel.prototype.get.mockImplementation(
      async (service: string, cacheKey: string) => {
        if (cacheKey === "abc123") {
          return lastSavedTask;
        } else {
          return false;
        }
      }
    );

    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    const result2 = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "bar" }
    );
    // @ts-ignore
    TasksModel.prototype.get.mockReset();

    expect(result.body.length).toBeGreaterThan(1);
    expect(result2.body.length).toBeGreaterThan(1);
    const task1 = JSON.parse(result.body) as GeoprocessingTask;
    const task2 = JSON.parse(result2.body) as GeoprocessingTask;
    const task1ms = new Date(task1.startedAt).valueOf();
    const task2ms = new Date(task2.startedAt).valueOf();
    expect(task2ms - task1ms).toBeLessThanOrEqual(50);
  });

  test.skip("extraParams can be used", async () => {
    const handler = new GeoprocessingHandler(
      async (sketch: Sketch | SketchCollection, extraParams) => {
        return {
          extraParams,
        };
      },
      {
        title: "paramsGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    expect(handler.options.title).toBe("paramsGP");
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);

    const extraParams = { geography: "nearshore" };
    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometry: {},
          cacheKey: "abc123",
          extraParams,
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.statusCode).toBe(200);
    const task = JSON.parse(result.body) as GeoprocessingTask;
    expect(task.status).toBe(GeoprocessingTaskStatus.Completed);
    expect(deepEqual(task.data.extraParams, extraParams)).toBe(true);
    // make sure cors headers are set
    expect(result.headers!["Access-Control-Allow-Origin"]).toBe("*");
    expect(result.headers!["Access-Control-Allow-Credentials"]).toBe(true);
  });

  test.skip("Failed geometryUri fetches are communicated to requester", async () => {
    const handler = new GeoprocessingHandler(
      async (feature) => exampleResponse,
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    expect(handler.options.title).toBe("TestGP");
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);

    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/500",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.statusCode).toBe(500);
    const task = JSON.parse(result.body) as GeoprocessingTask;
    expect(task.error).toContain("geometry");
    // make sure cors headers are set still for errors
    expect(result.headers!["Access-Control-Allow-Origin"]).toBe("*");
    expect(result.headers!["Access-Control-Allow-Credentials"]).toBe(true);
  });

  test.skip("Exceptions in geoprocessing function are passed to requester", async () => {
    const handler = new GeoprocessingHandler(
      async (sketch) => {
        // @ts-ignore
        return { foo: sketch.something.doesntexist() };
      },
      {
        title: "TestGP",
        description: "Test gp function",
        executionMode: "sync",
        memory: 128,
        requiresProperties: [],
        timeout: 100,
      }
    );
    expect(handler.options.title).toBe("TestGP");
    // @ts-ignore
    TasksModel.prototype.get.mockResolvedValueOnce(false);

    const result = await handler.lambdaHandler(
      {
        body: JSON.stringify({
          geometryUri: "https://example.com/geom/123",
          cacheKey: "abc123",
        }),
      } as unknown as APIGatewayProxyEvent,
      // @ts-ignore
      { awsRequestId: "foo" }
    );
    expect(result.statusCode).toBe(500);
    const task = JSON.parse(result.body) as GeoprocessingTask;
    expect(task.error).toContain("Failed");
    // make sure cors headers are set still for errors
    expect(result.headers!["Access-Control-Allow-Origin"]).toBe("*");
    expect(result.headers!["Access-Control-Allow-Credentials"]).toBe(true);
  });

  // TODO: requiresProperties verification
  // TODO: async executionMode
  // TODO: Rate limiting
  // TODO: Authorization
  // TODO: Container tasks
});
