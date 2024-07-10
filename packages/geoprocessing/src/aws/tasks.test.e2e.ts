import { describe, test, expect, beforeAll, afterAll } from "vitest";
import {
  createMetric,
  isMetricArray,
  isMetricPack,
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
const docClient = new DynamoDB.DocumentClient();

const Tasks = new TaskModel("tasks-core", "tasks-estimates", docClient);
const SERVICE_NAME = "jest-test-serviceName";

describe("DynamoDB local", () => {
  beforeAll(async () => {
    // await dynamodb.createTable({
    //     TableName: "tasks-core",
    //     KeySchema: [
    //       { AttributeName: "service", KeyType: "HASH" },
    //       { AttributeName: "id", KeyType: "RANGE" },
    //     ],
    //     AttributeDefinitions: [
    //       { AttributeName: "service", AttributeType: "S" },
    //       { AttributeName: "id", AttributeType: "S" },
    //     ],
    //     ProvisionedThroughput: {
    //       ReadCapacityUnits: 1,
    //       WriteCapacityUnits: 1,
    //     },
    //   })
    //   .promise();
  });

  test.skip("create new task", async () => {
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
  });

  test.skip("create new async task", async () => {
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

  test.skip("get() a created task", async () => {
    const task = await Tasks.create(SERVICE_NAME, undefined, "abc123");
    expect(typeof task.id).toBe("string");
    const retrieved = await Tasks.get(SERVICE_NAME, task.id);
    expect(retrieved && retrieved.id).toBe(task.id);
  });

  test.skip("get() return undefined for unknown ids", async () => {
    const retrieved = await Tasks.get(SERVICE_NAME, "unknown-id");
    expect(retrieved).toBe(undefined);
  });

  test.skip("create task with a cacheKey id", async () => {
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

  test.skip("assign a correlation id", async () => {
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

  test.skip("complete an existing task", async () => {
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

  test.skip("complete a task with metrics should have packed in db", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const response = await Tasks.complete(task, {
      metrics: [createMetric({ value: 15 })],
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

  test.skip("completed task with metrics should return unpacked result", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const metrics = [createMetric({ value: 15 })];
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

  test.skip("fail a task", async () => {
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
