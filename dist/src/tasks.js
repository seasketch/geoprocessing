"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
function TasksModel(HOST, TASK_TABLE, db) {
    const init = (id, startedAt, duration, status, data) => {
        id = id || uuid_1.v4();
        const task = {
            id,
            location: `https://${HOST}/tasks/${id}`,
            startedAt: startedAt || new Date().toISOString(),
            logUriTemplate: `https://${HOST}/tasks/${id}/logs{?limit,nextToken}`,
            geometryUri: `https://${HOST}/tasks/${id}/geometry`,
            status: status || "pending",
            wss: `https://${HOST}/tasks/${id}/socket`
        };
        return task;
    };
    const create = async (id, correlationId) => {
        const task = init(id);
        await db
            .put({
            TableName: TASK_TABLE,
            Item: {
                ...task,
                correlationIds: correlationId ? [correlationId] : []
            }
        })
            .promise();
        return task;
    };
    const assignCorrelationId = async (taskId, correlationId) => {
        return db
            .update({
            TableName: TASK_TABLE,
            Key: {
                id: taskId
            },
            UpdateExpression: "set #correlationIds = list_append(#correlationIds, :val)",
            ExpressionAttributeNames: {
                "#correlationIds": "correlationIds"
            },
            ExpressionAttributeValues: {
                ":val": [correlationId]
            }
        })
            .promise();
    };
    const complete = async (task, results) => {
        task.data = results;
        task.status = "completed";
        task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
        await db
            .update({
            TableName: TASK_TABLE,
            Key: {
                id: task.id
            },
            UpdateExpression: "set #data = :data, #status = :status, #duration = :duration",
            ExpressionAttributeNames: {
                "#data": "data",
                "#status": "status",
                "#duration": "duration"
            },
            ExpressionAttributeValues: {
                ":data": results,
                ":status": task.status,
                ":duration": task.duration
            }
        })
            .promise();
        return {
            statusCode: 200,
            body: JSON.stringify(task)
        };
    };
    const fail = async (task, errorDescription, error) => {
        if (error)
            console.error(error);
        task.status = "failed";
        task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
        task.error = errorDescription;
        await db
            .update({
            TableName: TASK_TABLE,
            Key: {
                id: task.id
            },
            UpdateExpression: "set #error = :error, #status = :status, #duration = :duration",
            ExpressionAttributeNames: {
                "#error": "error",
                "#status": "status",
                "#duration": "duration"
            },
            ExpressionAttributeValues: {
                ":error": errorDescription,
                ":status": task.status,
                ":duration": task.duration
            }
        })
            .promise();
        return {
            statusCode: 500,
            body: JSON.stringify(task)
        };
    };
    return {
        fail,
        complete,
        assignCorrelationId,
        create,
        init
    };
}
exports.default = TasksModel;
