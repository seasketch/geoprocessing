import { GeoprocessingHandlerOptions, SketchCollection, Sketch, GeoprocessingRequest } from "./types";
import TaskModel from "./tasks";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
export declare class GeoprocessingHandler<T> {
    func: (sketch: Sketch | SketchCollection) => Promise<T>;
    options: GeoprocessingHandlerOptions;
    lastRequestId?: string;
    Tasks: TaskModel;
    constructor(func: (sketch: Sketch | SketchCollection) => Promise<T>, options: GeoprocessingHandlerOptions);
    lambdaHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult>;
    parseRequest(event: APIGatewayEvent): GeoprocessingRequest;
}
