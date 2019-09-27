import TaskModel, { GeoprocessingTask } from "../tasks";
declare const _default: {
    TaskModel: typeof TaskModel;
    fetchGeoJSON: (request: import("../handlers").GeoprocessingRequest) => Promise<import("../geometry").SeaSketchFeature | import("../geometry").SeaSketchFeatureCollection>;
    handlerFactory: (functionOrContainerImage: string | import("../handlers").LambdaGeoprocessingFunction, settings: import("../handlers").SeaSketchGeoprocessingSettings) => (event: import("aws-lambda").APIGatewayProxyEvent, context: import("aws-lambda").Context) => Promise<import("aws-lambda").APIGatewayProxyResult>;
    metadataHandler: (event: import("aws-lambda").APIGatewayProxyEvent, context: import("aws-lambda").Context) => Promise<import("aws-lambda").APIGatewayProxyResult>;
};
export default _default;
export declare type GeoprocessingTask = GeoprocessingTask;
