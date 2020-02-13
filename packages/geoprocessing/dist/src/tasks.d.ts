import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
export interface GeoprocessingTask<ResultType = any> {
    id: string;
    service: string;
    location: string;
    startedAt: string;
    duration?: number;
    logUriTemplate: string;
    geometryUri: string;
    status: GeoprocessingTaskStatus;
    wss: string;
    data?: ResultType;
    error?: string;
}
export declare enum GeoprocessingTaskStatus {
    Pending = "pending",
    Completed = "completed",
    Failed = "failed"
}
export default class TasksModel {
    table: string;
    db: DynamoDB.DocumentClient;
    constructor(table: string, db: DynamoDB.DocumentClient);
    init(service: string, id?: string, startedAt?: string, duration?: number, status?: GeoprocessingTaskStatus, data?: any): GeoprocessingTask<any>;
    create(service: string, id?: string, correlationId?: string): Promise<GeoprocessingTask<any>>;
    assignCorrelationId(service: string, taskId: string, correlationId: string): Promise<import("aws-sdk/lib/request").PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, import("aws-sdk").AWSError>>;
    complete(task: GeoprocessingTask, results: any): Promise<APIGatewayProxyResult>;
    fail(task: GeoprocessingTask, errorDescription: string, error?: Error): Promise<APIGatewayProxyResult>;
    get(service: string, taskId: string): Promise<GeoprocessingTask | undefined>;
}
