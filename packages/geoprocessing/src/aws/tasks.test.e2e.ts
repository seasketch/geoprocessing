import { describe, test, expect, beforeAll } from "vitest";
import { createMetric, isMetricArray } from "../metrics/helpers.js";
import TaskModel from "./tasks.js";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import deepEqual from "fast-deep-equal";

const dynamodb = new DynamoDBClient({
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "localaccesskey",
    secretAccessKey: "localsecretkey",
  },
  region: "localregion",
  tls: false,
});
const docClient = DynamoDBDocument.from(dynamodb);

const Tasks = new TaskModel("tasks-core", "tasks-estimates", docClient);
const SERVICE_NAME = "test-serviceName";

describe("DynamoDB local", () => {
  beforeAll(async () => {
    await dynamodb.send(
      new CreateTableCommand({
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
      }),
    );

    await dynamodb.send(
      new CreateTableCommand({
        TableName: "tasks-estimates",
        KeySchema: [{ AttributeName: "service", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "service", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      }),
    );

    await dynamodb.send(
      new CreateTableCommand({
        TableName: "test-websockets",
        KeySchema: [{ AttributeName: "connectionId", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "connectionId", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      }),
    );
  });

  test("create new task", async () => {
    const task = await Tasks.create(SERVICE_NAME, undefined);
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient.get({
      TableName: "tasks-core",
      Key: {
        id: task.id,
        service: SERVICE_NAME,
      },
    });
    expect(item && item.Item && item.Item.id).toBe(task.id);
  }, 10000);

  test("create new task with cache disabled should have no record", async () => {
    const task = await Tasks.create(SERVICE_NAME, { disableCache: true });
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient.get({
      TableName: "tasks-core",
      Key: {
        id: task.id,
        service: SERVICE_NAME,
      },
    });
    console.log(JSON.stringify(item, null, 2));
    expect(item.Item).toBeUndefined();
  }, 10000);

  test("create new async task", async () => {
    const task = await Tasks.create(SERVICE_NAME, { wss: "wssabc123" });
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient.get({
      TableName: "tasks-core",
      Key: {
        id: task.id,
        service: SERVICE_NAME,
      },
    });
    expect(item && item.Item && item.Item.id).toBe(task.id);
    expect(item && item.Item && item.Item.wss.length).toBeGreaterThan(0);
  });

  test("get a created task", async () => {
    const task = await Tasks.create(SERVICE_NAME, undefined);
    expect(typeof task.id).toBe("string");
    const retrieved = await Tasks.get(SERVICE_NAME, task.id);
    expect(retrieved && retrieved.id).toBe(task.id);
  });

  test("get return undefined for unknown ids", async () => {
    const retrieved = await Tasks.get(SERVICE_NAME, "unknown-id");
    expect(retrieved).toBe(undefined);
  });

  test("create task with a cacheKey id", async () => {
    const task = await Tasks.create(SERVICE_NAME, { id: "my-cache-key" });
    expect(typeof task.id).toBe("string");
    expect(task.status).toBe("pending");
    // make sure it saves to the db
    const item = await docClient.get({
      TableName: "tasks-core",
      Key: {
        id: task.id,
        service: SERVICE_NAME,
      },
    });
    expect(item && item.Item && item.Item.id).toBe("my-cache-key");
  });

  test("complete an existing task should split data into chunk item", async () => {
    const task = await Tasks.create(SERVICE_NAME);
    const response = await Tasks.complete(task, { area: 1234556 });
    const items = await docClient.query({
      TableName: "tasks-core",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":id": task.id,
      },
    });

    // Should be three items under the one partition key (task id), the root and two chunks
    console.log(JSON.stringify(items, null, 2));
    expect(items.Count).toBe(3);

    const rootItem = items.Items?.find((item) => item.service === SERVICE_NAME);
    expect(rootItem && rootItem.status).toBe("completed");

    const chunkItem0 = items.Items?.find(
      (item) => item.service === `${SERVICE_NAME}-chunk-0`,
    );

    const chunkItem1 = items.Items?.find(
      (item) => item.service === `${SERVICE_NAME}-chunk-1`,
    );

    expect(response.statusCode).toBe(200);
    expect(chunkItem0).toBeTruthy();
    expect(chunkItem0!.data).toBeTruthy();
    expect(chunkItem0!.data!.chunk).toBeTruthy();
    expect(typeof chunkItem0!.data!.chunk).toBe("string");
    expect(chunkItem1).toBeTruthy();
    expect(chunkItem1!.data).toBeTruthy();
    expect(chunkItem1!.data!.chunk).toBeTruthy();
    expect(typeof chunkItem1!.data!.chunk).toBe("string");
  });

  test("completed task should return merged result", async () => {
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

  test("completed task with disabled cached should return no result", async () => {
    const task = await Tasks.create(SERVICE_NAME, { disableCache: true });
    const metrics = [createMetric({ value: 15, sketchId: "test" })];
    const response = await Tasks.complete(task, {
      metrics,
    });
    expect(response.statusCode).toBe(200);

    const cachedResult = await Tasks.get(SERVICE_NAME, task.id);

    expect(cachedResult).toBeUndefined();
  });

  test("tasks for multiple services should not get mixed", async () => {
    const task = await Tasks.create("service1");
    const metrics = [createMetric({ value: 15, sketchId: "test1" })];
    const response = await Tasks.complete(task, {
      metrics,
    });
    expect(response.statusCode).toBe(200);

    const task2 = await Tasks.create("service2");
    const metrics2 = [createMetric({ value: 30, sketchId: "test2" })];
    const response2 = await Tasks.complete(task2, {
      metrics: metrics2,
    });
    expect(response2.statusCode).toBe(200);

    const cachedResult = await Tasks.get("service1", task.id);
    const cachedMetrics = cachedResult?.data.metrics;
    expect(cachedMetrics.length).toBe(1);
    expect(isMetricArray(cachedMetrics)).toBe(true);
    expect(deepEqual(cachedMetrics, metrics)).toBe(true);

    const cachedResult2 = await Tasks.get("service2", task2.id);
    const cachedMetrics2 = cachedResult2?.data.metrics;
    expect(cachedMetrics2.length).toBe(1);
    expect(isMetricArray(cachedMetrics2)).toBe(true);
    expect(deepEqual(cachedMetrics2, metrics2)).toBe(true);
  });

  // To use this test, uncomment and create a sampleResult.json file in the same directory as this test file
  // test("real task should return real result", async () => {
  //   const task = await Tasks.create(SERVICE_NAME);
  //   const result = fs.readJsonSync("./src/aws/sampleResult.json");
  //   const response = await Tasks.complete(task, result);
  //   expect(response.statusCode).toBe(200);

  //   const cachedResult = await Tasks.get(SERVICE_NAME, task.id);
  //   // console.log("cachedResult", JSON.stringify(cachedResult, null, 2));

  //   expect(cachedResult).toBeTruthy();
  // });

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
        minSplitSizeBytes: 80, // set size that should split into 6 pieces
      },
    );
    expect(response.statusCode).toBe(200);

    // Verify created 3 items, 1 root and 2 chunks

    const queryResult = await docClient.query({
      TableName: "tasks-core",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":id": task.id,
      },
    });

    // Remove root item. remainder, if any, is chunk items
    if (!queryResult.Items || queryResult.Items.length === 0)
      throw new Error("No items");
    const rootItemIndex = queryResult.Items.findIndex(
      (item) => item.service === SERVICE_NAME,
    );
    const rootItem = queryResult.Items.splice(rootItemIndex, 1)[0]; // mutates items
    const chunkItems = queryResult.Items.sort((a, b) => {
      return a.service.localeCompare(b.service); // sort by chunk index
    });

    expect(rootItem && rootItem.status).toBe("completed");
    expect(rootItem && rootItem.data.numChunks).toBe(5);
    expect(chunkItems.length).toBe(5);

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
    const item = await docClient.get({
      TableName: "tasks-core",
      Key: {
        id: task.id,
        service: SERVICE_NAME,
      },
    });
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe("It broken");
    expect(item && item.Item && item.Item.status).toBe("failed");
    expect(item && item.Item && item.Item.duration).toBeGreaterThan(0);
  });
});
