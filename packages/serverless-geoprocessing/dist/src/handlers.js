"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = __importDefault(require("./tasks"));
const geometry_1 = require("./geometry");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const aws_sdk_2 = require("aws-sdk");
const Lambda = new aws_sdk_1.default.Lambda();
const db = new aws_sdk_2.DynamoDB.DocumentClient();
const { ASYNC_HANDLER_FUNCTION_NAME } = process.env;
/**
 * Create a new lambda-based geoprocessing service
 *
 * @param {LambdaGeoprocessingFunction} lambda Function accepts a Sketch or SketchCollection and returns a Promise that yields json-serializable analysis output
 * @param {SeaSketchGeoprocessingSettings} [settings]
 * @returns Lamda handler
 */
function lambdaService(lambda, settings) {
    return handlerFactory(lambda, settings);
}
exports.lambdaService = lambdaService;
/**
 * Create a new Docker-based geoprocessing service
 *
 * @param {string} String identifier for an Image hosted on AWS ECR. https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions
 * @param {SeaSketchGeoprocessingSettings} [settings]
 * @returns
 */
function dockerService(image, settings) {
    return handlerFactory(image, settings);
}
exports.dockerService = dockerService;
function isLambda(obj) {
    return typeof obj !== "string";
}
function isContainerImage(obj) {
    return typeof obj === "string";
}
/**
 * handlerFactory() accepts either a geoprocessing function or a container
 * task identifier and returns a new function that can be used directly by
 * aws lambda.
 *
 * The returned handler() is the initial responder to geoprocessing requests.
 * It will load spatial features from the given request, respond with a cache
 * if available, and either run the geoprocessing script in the case of a sync
 * service, or delegate to another lambda or container for async.
 *
 * @param {(LambdaGeoprocessingFunction | string)} functionOrContainerImage Lambda function or Docker image location
 * @param {SeaSketchGeoprocessingSettings} settings
 * @returns Handler function that can be passed to serverless framework
 */
const handlerFactory = function (functionOrContainerImage, settings) {
    const Tasks = tasks_1.default(settings.tasksTable, db);
    // TODO: Rate limiting
    let lastRequestId = null;
    return async function handler(event, context) {
        let request;
        if ('geometry' in event) {
            // likely coming from aws console
            request = event;
        }
        else if (event.body && typeof event.body === 'string') {
            request = JSON.parse(event.body);
        }
        else {
            throw new Error("Could not interpret incoming request");
        }
        // Bail out if replaying previous task
        if (context.awsRequestId && context.awsRequestId === lastRequestId) {
            // don't replay
            console.log("cancelling since event is being replayed");
            return {
                statusCode: 200,
                body: ""
            };
        }
        else {
            lastRequestId = context.awsRequestId;
        }
        // check and respond with cache first if available
        if (request.cacheKey) {
            const cachedResult = await Tasks.get(settings.serviceName, request.cacheKey);
            if (cachedResult) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(cachedResult)
                };
            }
        }
        let task = await Tasks.create(settings.serviceName, request.cacheKey, context.awsRequestId);
        if (isContainerImage(functionOrContainerImage)) {
            // return launchTask(ecrTask, featureSet);
            // TODO: Container tasks
            return Tasks.fail(task, "Docker tasks not yet implemented");
        }
        else if (settings.executionMode === "sync") {
            const lambda = functionOrContainerImage;
            // wrap geojson fetching in a try block in case the origin server fails
            try {
                const featureSet = await geometry_1.fetchGeoJSON(request);
                try {
                    const results = await lambda(featureSet);
                    return Tasks.complete(task, results);
                }
                catch (e) {
                    return Tasks.fail(task, "Geoprocessing function threw an exception", e);
                }
            }
            catch (e) {
                return Tasks.fail(task, request.geometryUri
                    ? `Failed to retrieve geometry from ${request.geometryUri}`
                    : `Failed to extract geometry from request`, e);
            }
        }
        else {
            // TODO: async executionMode
            // launch async handler
            if (!ASYNC_HANDLER_FUNCTION_NAME) {
                return Tasks.fail(task, "ASYNC_HANDLER_FUNCTION_NAME env var not set");
            }
            else {
                try {
                    await Lambda.invokeAsync({
                        FunctionName: ASYNC_HANDLER_FUNCTION_NAME,
                        InvokeArgs: JSON.stringify(task)
                    }).promise();
                    return {
                        statusCode: 200,
                        body: JSON.stringify(task)
                    };
                }
                catch (e) {
                    return Tasks.fail(task, `Could not launch async handler function`);
                }
            }
        }
    };
};
const asyncTaskHandler = async (task) => { };
