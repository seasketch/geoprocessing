import { v4 as uuid } from "uuid";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

export interface GeoprocessingTask {
  id: string;
  location: string;
  startedAt: string; //ISO 8601
  duration?: number; //ms
  logUriTemplate: string;
  geometryUri: string;
  status: GeoprocessingTaskStatus;
  wss: string; // websocket for listening to status updates
  data?: any; // result data can take any json-serializable form
  error?: string;
}

type GeoprocessingTaskStatus = "pending" | "completed" | "failed";

export default function TasksModel(
  HOST: string,
  TASK_TABLE: string,
  db: DynamoDB.DocumentClient
) {
  const init = (
    id?: string,
    startedAt?: string,
    duration?: number,
    status?: GeoprocessingTaskStatus,
    data?: any
  ) => {
    id = id || uuid();
    const task: GeoprocessingTask = {
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

  const create = async (id?: string, correlationId?: string) => {
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

  const assignCorrelationId = async (taskId: string, correlationId: string) => {
    return db
      .update({
        TableName: TASK_TABLE,
        Key: {
          id: taskId
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
  };

  const complete = async (
    task: GeoprocessingTask,
    results: any
  ): Promise<APIGatewayProxyResult> => {
    task.data = results;
    task.status = "completed";
    task.duration = new Date().getTime() - new Date(task.startedAt).getTime();

    await db
      .update({
        TableName: TASK_TABLE,
        Key: {
          id: task.id
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
      body: JSON.stringify(task)
    };
  };

  const fail = async (
    task: GeoprocessingTask,
    errorDescription: string,
    error?: Error
  ): Promise<APIGatewayProxyResult> => {
    if (error) console.error(error);
    task.status = "failed";
    task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
    task.error = errorDescription;
    await db
      .update({
        TableName: TASK_TABLE,
        Key: {
          id: task.id
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
