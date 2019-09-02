"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
function TasksModel(TASK_TABLE, db) {
    const init = (service, id, startedAt, duration, status, data) => {
        let ttl = undefined;
        if (!id) {
            ttl = new Date().getTime() + 86400; // 24 hours from now
        }
        id = id || uuid_1.v4();
        const location = `/${service}/tasks/${id}`;
        const task = {
            id,
            service,
            location,
            startedAt: startedAt || new Date().toISOString(),
            logUriTemplate: `${location}/logs{?limit,nextToken}`,
            geometryUri: `${location}/geometry`,
            status: status || "pending",
            wss: `${location}/socket`,
            ttl
        };
        return task;
    };
    const create = async (service, id, correlationId) => {
        const task = init(service, id);
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
    const assignCorrelationId = async (service, taskId, correlationId) => {
        return db
            .update({
            TableName: TASK_TABLE,
            Key: {
                id: taskId,
                service
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
                id: task.id,
                service: task.service
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
                id: task.id,
                service: task.service
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
    const get = async (service, taskId) => {
        try {
            const response = await db.get({
                TableName: TASK_TABLE,
                Key: {
                    id: taskId,
                    service
                }
            }).promise();
            return response.Item;
        }
        catch (e) {
            return undefined;
        }
    };
    return {
        fail,
        complete,
        assignCorrelationId,
        create,
        init,
        get
    };
}
exports.default = TasksModel;
