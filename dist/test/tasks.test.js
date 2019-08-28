"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = __importDefault(require("../src/tasks"));
const aws_sdk_1 = require("aws-sdk");
const db = new aws_sdk_1.DynamoDB.DocumentClient({
    endpoint: "localhost:8000",
    sslEnabled: false,
    region: 'local-env'
});
const Tasks = tasks_1.default("localhost", "tasks-core", db);
test("create new task", async () => {
    const task = await Tasks.create(undefined, "abc123");
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
    expect(item && item.Item && item.Item.id).toBe(task.id);
    expect(item && item.Item && item.Item.correlationIds.length).toBe(1);
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
    expect(item && item.Item && item.Item.id).toBe("my-cache-key");
});
test("assign a correlation id", async () => {
    const task = await Tasks.create(undefined, "12345");
    await Tasks.assignCorrelationId(task.id, "1-2-3");
    const item = await db.get({
        TableName: "tasks-core",
        Key: {
            id: task.id
        }
    }).promise();
    expect(item && item.Item && item.Item.correlationIds.length).toBe(2);
    expect(item && item.Item && item.Item.correlationIds.indexOf("1-2-3")).not.toBe(-1);
});
test("complete an existing task", async () => {
    const task = await Tasks.create();
    const response = await Tasks.complete(task, { area: 1234556 });
    const item = await db.get({
        TableName: "tasks-core",
        Key: {
            id: task.id
        }
    }).promise();
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).data.area).toBe(1234556);
    expect(item && item.Item && item.Item.status).toBe("completed");
    expect(item && item.Item && item.Item.data.area).toBe(1234556);
    expect(item && item.Item && item.Item.duration).toBeGreaterThan(0);
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
    expect(item && item.Item && item.Item.status).toBe("failed");
    expect(item && item.Item && item.Item.duration).toBeGreaterThan(0);
});
