import { v4 as uuid } from "uuid";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

export interface GeoprocessingTask<ResultType = any> {
  id: string;
  service: string;
  location: string;
  startedAt: string; //ISO 8601
  duration?: number; //ms
  logUriTemplate: string;
  geometryUri: string;
  status: GeoprocessingTaskStatus;
  wss: string; // websocket for listening to status updates
  data?: ResultType; // result data can take any json-serializable form
  error?: string;
  // ttl?: number;
}

export enum GeoprocessingTaskStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed"
}

export default class TasksModel {
  table: string;
  db: DynamoDB.DocumentClient;

  constructor(table: string, db: DynamoDB.DocumentClient) {
    this.table = table;
    this.db = db;
  }

  init(
    service: string,
    id?: string,
    startedAt?: string,
    duration?: number,
    status?: GeoprocessingTaskStatus,
    data?: any
  ) {
    id = id || uuid();
    const location = `/${service}/tasks/${id}`;
    const task: GeoprocessingTask = {
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

  async create(service: string, id?: string, correlationId?: string) {
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

  async assignCorrelationId(
    service: string,
    taskId: string,
    correlationId: string
  ) {
    return this.db
      .update({
        TableName: this.table,
        Key: {
          id: taskId,
          service
        },
        UpdateExpression:
          "set #correlationIds = list_append(#correlationIds, :val)",
        ExpressionAttributeNames: {
          "#correlationIds": "correlationIds"
        },
        ExpressionAttributeValues: {
          ":val": [correlationId]
        }
      })
      .promise();
  }

  async complete(
    task: GeoprocessingTask,
    results: any
  ): Promise<APIGatewayProxyResult> {
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
        UpdateExpression:
          "set #data = :data, #status = :status, #duration = :duration",
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

  async fail(
    task: GeoprocessingTask,
    errorDescription: string,
    error?: Error
  ): Promise<APIGatewayProxyResult> {
    if (error) console.error(error);
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
        UpdateExpression:
          "set #error = :error, #status = :status, #duration = :duration",
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

  async get(
    service: string,
    taskId: string
  ): Promise<GeoprocessingTask | undefined> {
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
      return response.Item as GeoprocessingTask;
    } catch (e) {
      return undefined;
    }
  }
}
