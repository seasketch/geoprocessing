import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
export interface GeoprocessingTask {
    id: string;
    service: string;
    location: string;
    startedAt: string;
    duration?: number;
    logUriTemplate: string;
    geometryUri: string;
    status: GeoprocessingTaskStatus;
    wss: string;
    data?: any;
    error?: string;
    ttl?: number;
}
export declare enum GeoprocessingTaskStatus {
    Pending = "pending",
    Completed = "completed",
    Failed = "failed"
}
export default function TasksModel(TASK_TABLE: string, db: DynamoDB.DocumentClient): {
    fail: (task: GeoprocessingTask, errorDescription: string, error?: Error | undefined) => Promise<APIGatewayProxyResult>;
    complete: (task: GeoprocessingTask, results: any) => Promise<APIGatewayProxyResult>;
    assignCorrelationId: (service: string, taskId: string, correlationId: string) => Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, import("aws-sdk").AWSError>>;
    create: (service: string, id?: string | undefined, correlationId?: string | undefined) => Promise<GeoprocessingTask>;
    init: (service: string, id?: string | undefined, startedAt?: string | undefined, duration?: number | undefined, status?: GeoprocessingTaskStatus | undefined, data?: any) => GeoprocessingTask;
    get: (service: string, taskId: string) => Promise<GeoprocessingTask | undefined>;
};
