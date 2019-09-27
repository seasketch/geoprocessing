import { ExecutionMode } from "./handlers";
import { Context, APIGatewayProxyResult } from "aws-lambda";
export interface GeoprocessingProject {
    location: string;
    published: string;
    apiVersion: string;
    services: Array<GeoprocessingService>;
    clients: Array<ReportClient>;
    clientUri: string;
    title: string;
    description?: string;
    author: string;
    organization?: string;
    relatedUrl?: string;
}
export interface GeoprocessingService {
    id: string;
    location: string;
    executionMode: ExecutionMode;
    requiresAttributes: Array<string>;
    timeout: number;
}
export interface ReportClient {
    title: string;
    description?: string;
    tabs: Array<ReportTab>;
}
export interface ReportTab {
    id: string;
    title: string;
    requiredServices: Array<GeoprocessingService>;
}
export interface GeoprocessingConfig {
    description?: string;
    author?: string;
    publishedDate: string;
    relatedUri: string;
    clientUri: string;
    apiVersion: string;
    title: string;
    services: {
        [key: string]: ServiceDefinition;
    };
    clients: {
        [key: string]: ClientDefinition;
    };
}
interface ServiceDefinition {
    memorySize?: number;
    timeout?: number;
    executionMode?: ExecutionMode;
    requiresAttributes?: Array<string>;
}
interface ClientDefinition {
    description?: string;
    tabs: {
        [key: string]: TabDefinition;
    };
}
interface TabDefinition {
    id: string;
    title: string;
    requiredServices: Array<string>;
}
export declare const handler: (event: import("aws-lambda").APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
export {};
