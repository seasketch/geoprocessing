import { v4 as uuid } from "uuid";
export var GeoprocessingTaskStatus;
(function (GeoprocessingTaskStatus) {
    GeoprocessingTaskStatus["Pending"] = "pending";
    GeoprocessingTaskStatus["Completed"] = "completed";
    GeoprocessingTaskStatus["Failed"] = "failed";
})(GeoprocessingTaskStatus || (GeoprocessingTaskStatus = {}));
export default class TasksModel {
    constructor(table, db) {
        this.table = table;
        this.db = db;
    }
    init(service, id, startedAt, duration, status, data) {
        id = id || uuid();
        const location = `/${service}/tasks/${id}`;
        const task = {
            id,
            service,
            location,
            startedAt: startedAt || new Date().toISOString(),
            logUriTemplate: `${location}/logs{?limit,nextToken}`,
            geometryUri: `${location}/geometry`,
            status: status || GeoprocessingTaskStatus.Pending,
            wss: `${location}/socket`
        };
        return task;
    }
    async create(service, id, correlationId) {
        const task = this.init(service, id);
        await this.db
            .put({
            TableName: this.table,
            Item: {
                ...task,
                correlationIds: correlationId ? [correlationId] : []
            }
        })
            .promise();
        return task;
    }
    async assignCorrelationId(service, taskId, correlationId) {
        return this.db
            .update({
            TableName: this.table,
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
    }
    async complete(task, results) {
        task.data = results;
        task.status = GeoprocessingTaskStatus.Completed;
        task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
        await this.db
            .update({
            TableName: this.table,
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
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(task)
        };
    }
    async fail(task, errorDescription, error) {
        if (error)
            console.error(error);
        task.status = GeoprocessingTaskStatus.Failed;
        task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
        task.error = errorDescription;
        await this.db
            .update({
            TableName: this.table,
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
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(task)
        };
    }
    async get(service, taskId) {
        try {
            const response = await this.db
                .get({
                TableName: this.table,
                Key: {
                    id: taskId,
                    service
                }
            })
                .promise();
            return response.Item;
        }
        catch (e) {
            return undefined;
        }
    }
}
//# sourceMappingURL=tasks.js.map