import { describe, test, expect, beforeAll, afterAll } from "vitest";
import {
  createMetric,
  isMetricArray,
  isMetricPack,
  unpackMetrics,
} from "../metrics/helpers.js";
import TaskModel from "./tasks.js";
import AWS, { DynamoDB } from "aws-sdk";
import deepEqual from "fast-deep-equal";

AWS.config.update({
  accessKeyId: "local-access-key",
  secretAccessKey: "local-secret-key",
  region: "local-region",
  sslEnabled: false,
});
const dynamodb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint("http://localhost:8000"),
});
const docClient = new DynamoDB.DocumentClient({
  // @ts-ignore
  endpoint: "localhost:8000",
  sslEnabled: false,
  region: "local-region",
});

const Tasks = new TaskModel("tasks-core", "tasks-estimates", docClient);
const SERVICE_NAME = "test-serviceName";

describe("DynamoDB local", () => {
  beforeAll(async () => {
    await dynamodb
      .createTable({
        TableName: "tasks-core",
        KeySchema: [
          { AttributeName: "id", KeyType: "HASH" },
          { AttributeName: "service", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" },
          { AttributeName: "service", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      })
      .promise();

    await dynamodb
      .createTable({
        TableName: "tasks-estimates",
        KeySchema: [{ AttributeName: "service", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "service", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      })
      .promise();

    await dynamodb
      .createTable({
        TableName: "test-websockets",
        KeySchema: [{ AttributeName: "connectionId", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "connectionId", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      })
      .promise();
  });

  test("create new task", async () => {
    const task = await Tasks.create(SERVICE_NAME, undefined, "abc123");
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(item && item.Item && item.Item.id).toBe(task.id);
    expect(item && item.Item && item.Item.correlationIds.length).toBe(1);
  }, 10000);

  test("create new async task", async () => {
    const task = await Tasks.create(
      SERVICE_NAME,
      undefined,
      "abc123",
      "wssabc123"
    );
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(item && item.Item && item.Item.id).toBe(task.id);
    expect(item && item.Item && item.Item.correlationIds.length).toBe(1);
    expect(item && item.Item && item.Item.wss.length).toBeGreaterThan(0);
  });

  test("get() a created task", async () => {
    const task = await Tasks.create(SERVICE_NAME, undefined, "abc123");
    expect(typeof task.id).toBe("string");
    const retrieved = await Tasks.get(SERVICE_NAME, task.id);
    expect(retrieved && retrieved.id).toBe(task.id);
  });

  test("get() return undefined for unknown ids", async () => {
    const retrieved = await Tasks.get(SERVICE_NAME, "unknown-id");
    expect(retrieved).toBe(undefined);
  });

  test("create task with a cacheKey id", async () => {
    const task = await Tasks.create(SERVICE_NAME, "my-cache-key");
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(item && item.Item && item.Item.id).toBe("my-cache-key");
  });

  test("assign a correlation id", async () => {
    const task = await Tasks.create(SERVICE_NAME, undefined, "12345");
    await Tasks.assignCorrelationId(SERVICE_NAME, task.id, "1-2-3");
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(item && item.Item && item.Item.correlationIds.length).toBe(2);
    expect(
      item && item.Item && item.Item.correlationIds.indexOf("1-2-3")
    ).not.toBe(-1);
  });

  test("complete an existing task", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const response = await Tasks.complete(task, { area: 1234556 });
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).data.area).toBe(1234556);
    expect(item && item.Item && item.Item.status).toBe("completed");
    expect(item && item.Item && item.Item.data.area).toBe(1234556);
    expect(item && item.Item && item.Item.duration).toBeGreaterThan(0);
  });

  test("complete a task with metrics should have packed in db", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const response = await Tasks.complete(task, {
      metrics: [createMetric({ value: 15, sketchId: "test" })],
    });
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(response.statusCode).toBe(200);
    const metrics = JSON.parse(response.body).data.metrics;
    expect(metrics).toBeTruthy();
    expect(isMetricArray(metrics)).toBe(true);
    expect(metrics[0].value).toEqual(15);

    const dbMetrics = item?.Item?.data.metrics;
    expect(isMetricPack(dbMetrics)).toBe(true);
  });

  test("completed task with metrics should return unpacked result", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const metrics = [createMetric({ value: 15, sketchId: "test" })];
    const response = await Tasks.complete(task, {
      metrics,
    });
    expect(response.statusCode).toBe(200);

    const cachedResult = await Tasks.get(SERVICE_NAME, task.id);

    const cachedMetrics = unpackMetrics(cachedResult?.data.metrics);
    expect(cachedMetrics).toBeTruthy();
    expect(isMetricArray(cachedMetrics)).toBe(true);
    expect(deepEqual(cachedMetrics, metrics)).toBe(true);
  });

  test("complete a task with multiple sketch metrics should create multiple items", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const metrics = [
      createMetric({ value: 15, sketchId: "sketch1" }),
      createMetric({ value: 30, sketchId: "sketch2" }),
    ];
    const response = await Tasks.complete(task, {
      metrics,
    });
    expect(response.statusCode).toBe(200);

    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    const rootMetrics = item?.Item?.data.metrics;
    expect(Array.isArray(rootMetrics)).toBe(true);
    expect(rootMetrics.length).toBe(0);

    const childItems = item?.Item?.data.sketchMetricItems;
    expect(childItems).toBeTruthy();
    expect(childItems.length).toBe(2);
    expect(childItems).toEqual(["sketch1", "sketch2"]);

    const childItem1 = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: `${task.id}-sketchId-${childItems[0]}`,
          service: SERVICE_NAME,
        },
      })
      .promise();

    const childRawMetrics1 = childItem1?.Item?.data.metrics;
    expect(isMetricPack(childRawMetrics1)).toBe(true);
    const childMetrics1 = unpackMetrics(childRawMetrics1);
    expect(isMetricArray(childMetrics1)).toBe(true);
    expect(childMetrics1.length).toBe(1);

    const childItem2 = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: `${task.id}-sketchId-${childItems[1]}`,
          service: SERVICE_NAME,
        },
      })
      .promise();

    const childRawMetrics2 = childItem2?.Item?.data.metrics;
    expect(isMetricPack(childRawMetrics2)).toBe(true);
    const childMetrics2 = unpackMetrics(childRawMetrics2);
    expect(isMetricArray(childMetrics2)).toBe(true);
    expect(childMetrics2.length).toBe(1);

    const cachedResult = await Tasks.get(SERVICE_NAME, task.id);
    const cachedMetrics = cachedResult?.data.metrics;
    expect(cachedMetrics).toBeTruthy();
    expect(isMetricArray(cachedMetrics)).toBe(true);
    expect(deepEqual(cachedMetrics, metrics)).toBe(true);
  });

  test("fail a task", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const response = await Tasks.fail(task, "It broken");
    const item = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: task.id,
          service: SERVICE_NAME,
        },
      })
      .promise();
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe("It broken");
    expect(item && item.Item && item.Item.status).toBe("failed");
    expect(item && item.Item && item.Item.duration).toBeGreaterThan(0);
  });
});
