import TaskModel from '../src/tasks';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient({
  endpoint: "localhost:8000",
  sslEnabled: false,
  region: 'local-env'
});
const Tasks = TaskModel("localhost", "tasks-core", db);

test("create new task", async () => {
  const task = await Tasks.create(null, "abc123");
  expect(typeof task.id).toBe("string");
  expect(/https\:\/\/localhost/.test(task.location)).toBe(true);
  expect(task.status).toBe("pending");
  // make sure it saves to the db
  const item = await db.get({
    TableName: "tasks-core",
    Key: {
      id: task.id
    }
  }).promise();
  expect(item.Item.id).toBe(task.id);
  expect(item.Item.correlationIds.length).toBe(1);
});

test("create task with a cacheKey id", async () => {
  const task = await Tasks.create("my-cache-key");
  expect(typeof task.id).toBe("string");
  expect(/https\:\/\/localhost/.test(task.location)).toBe(true);
  expect(task.status).toBe("pending");
  // make sure it saves to the db
  const item = await db.get({
    TableName: "tasks-core",
    Key: {
      id: task.id
    }
  }).promise();
  expect(item.Item.id).toBe("my-cache-key");
});

test("assign a correlation id", async () => {
  const task = await Tasks.create(null, "12345");
  await Tasks.assignCorrelationId(task.id, "1-2-3");
  const item = await db.get({
    TableName: "tasks-core",
    Key: {
      id: task.id
    }
  }).promise();
  expect(item.Item.correlationIds.length).toBe(2);
  expect(item.Item.correlationIds.indexOf("1-2-3")).not.toBe(-1);
});

test("complete an existing task", async () => {
  const task = await Tasks.create();
  const response = await Tasks.complete(task, {area: 1234556});
  const item = await db.get({
    TableName: "tasks-core",
    Key: {
      id: task.id
    }
  }).promise();
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).data.area).toBe(1234556);
  expect(item.Item.status).toBe("completed");
  expect(item.Item.data.area).toBe(1234556);
  expect(item.Item.duration).toBeGreaterThan(0);
});


test("fail a task", async () => {
  const task = await Tasks.create();
  const response = await Tasks.fail(task, "It broken");
  const item = await db.get({
    TableName: "tasks-core",
    Key: {
      id: task.id
    }
  }).promise();
  expect(response.statusCode).toBe(500);
  expect(JSON.parse(response.body).error).toBe("It broken");
  expect(item.Item.status).toBe("failed");
  expect(item.Item.duration).toBeGreaterThan(0);
});