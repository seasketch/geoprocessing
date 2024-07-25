import { describe, test, expect, beforeAll, afterAll } from "vitest";
import {
  createMetric,
  isMetricArray,
  isMetricPack,
  unpackMetrics,
} from "../metrics/helpers.js";
import { TasksModel } from "./tasks.js";
import AWS, { DynamoDB } from "aws-sdk";
import deepEqual from "fast-deep-equal";
import { hasOwnProperty } from "../helpers/native.js";

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

const Tasks = new TasksModel("tasks-core", "tasks-estimates", docClient);
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

    const cachedMetrics = cachedResult?.data.metrics;
    expect(cachedMetrics).toBeTruthy();
    expect(isMetricArray(cachedMetrics)).toBe(true);
    expect(deepEqual(cachedMetrics, metrics)).toBe(true);
  });

  test("complete a task with multiple sketch metrics below size threshold should not split into multiple items", async () => {
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

    const rootData = item?.Item?.data;
    expect(hasOwnProperty(rootData, "sketchMetricItems")).toBe(false);

    expect(isMetricPack(rootData.metrics)).toBe(true);
    const rootMetrics = unpackMetrics(rootData.metrics);

    expect(Array.isArray(rootMetrics)).toBe(true);
    expect(rootMetrics.length).toBe(2);
  });

  test("complete a task with multiple sketch metrics above size threshold should split into multiple items", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const metrics = [
      createMetric({ value: 15, sketchId: "sketch1" }),
      createMetric({ value: 30, sketchId: "sketch2" }),
    ];
    const response = await Tasks.complete(
      task,
      {
        metrics,
      },
      {
        minSplitSizeBytes: 100, // set to below metrics size of 210 bytes, triggering split
      }
    );
    expect(response.statusCode).toBe(200);

    // Verify created 2 metric group items
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

    const numMetricGroups = item?.Item?.data.numMetricGroups;
    expect(numMetricGroups).toBeTruthy();
    expect(numMetricGroups).toBe(2);

    // Verify contents of 2 metric groups items
    const metricGroupItem1 = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: `${task.id}-metricGroup-0`,
          service: SERVICE_NAME,
        },
      })
      .promise();

    const metricGroupRawMetrics1 = metricGroupItem1?.Item?.data.metrics;
    expect(isMetricPack(metricGroupRawMetrics1)).toBe(true);
    const metricGroupMetrics1 = unpackMetrics(metricGroupRawMetrics1);
    expect(isMetricArray(metricGroupMetrics1)).toBe(true);
    expect(metricGroupMetrics1.length).toBe(1);

    const metricGroupItem2 = await docClient
      .get({
        TableName: "tasks-core",
        Key: {
          id: `${task.id}-metricGroup-1`,
          service: SERVICE_NAME,
        },
      })
      .promise();

    const metricGroupRawMetrics2 = metricGroupItem2?.Item?.data.metrics;
    expect(isMetricPack(metricGroupRawMetrics2)).toBe(true);
    const metricGroupMetrics2 = unpackMetrics(metricGroupRawMetrics2);
    expect(isMetricArray(metricGroupMetrics2)).toBe(true);
    expect(metricGroupMetrics2.length).toBe(1);

    // Verify on get that metrics are re-merged with root item
    const cachedResult = await Tasks.get(SERVICE_NAME, task.id);
    const cachedMetrics = cachedResult?.data.metrics;
    expect(cachedMetrics).toBeTruthy();
    expect(isMetricArray(cachedMetrics)).toBe(true);
    expect(cachedMetrics.length).toBe(2);
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
