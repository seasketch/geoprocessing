import TaskModel from "./tasks";
import { fetchGeoJSON } from "./geometry";
import { DynamoDB, Lambda as LambdaClient } from "aws-sdk";
const Lambda = new LambdaClient();
const Db = new DynamoDB.DocumentClient();
export class GeoprocessingHandler {
    constructor(func, options) {
        this.func = func;
        this.options = options;
        this.Tasks = new TaskModel(process.env.TASKS_TABLE, Db);
    }
    async lambdaHandler(event, context) {
        const { Tasks, options } = this;
        const serviceName = options.title;
        const request = this.parseRequest(event);
        // TODO: Rate limiting
        // TODO: Authorization
        // Bail out if replaying previous task
        if (context.awsRequestId && context.awsRequestId === this.lastRequestId) {
            // don't replay
            console.log("cancelling since event is being replayed");
            return {
                statusCode: 200,
                body: ""
            };
        }
        else {
            this.lastRequestId = context.awsRequestId;
        }
        // check and respond with cache first if available
        if (request.cacheKey) {
            const cachedResult = await Tasks.get(serviceName, request.cacheKey);
            if (cachedResult) {
                return {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": true
                    },
                    body: JSON.stringify(cachedResult)
                };
            }
        }
        let task = await Tasks.create(serviceName, request.cacheKey, context.awsRequestId);
        if (false) {
            // TODO: container tasks
            return Tasks.fail(task, "Docker tasks not yet implemented");
        }
        else if (this.options.executionMode === "sync") {
            try {
                const featureSet = await fetchGeoJSON(request);
                try {
                    const results = await this.func(featureSet);
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
            return Tasks.fail(task, "async executionMode not yet implemented");
            // launch async handler
            // if (!ASYNC_HANDLER_FUNCTION_NAME) {
            //   return Tasks.fail(task, "ASYNC_HANDLER_FUNCTION_NAME env var not set");
            // } else {
            //   try {
            //     await Lambda.invokeAsync({
            //       FunctionName: ASYNC_HANDLER_FUNCTION_NAME,
            //       InvokeArgs: JSON.stringify(task)
            //     }).promise();
            //     return {
            //       statusCode: 200,
            //       headers: {
            //         "Access-Control-Allow-Origin": "*",
            //         "Access-Control-Allow-Credentials": true
            //       },
            //       body: JSON.stringify(task)
            //     };
            //   } catch (e) {
            //     return Tasks.fail(task, `Could not launch async handler function`);
            //   }
            // }
        }
    }
    parseRequest(event) {
        let request;
        if ("geometry" in event) {
            // likely coming from aws console
            request = event;
        }
        else if (event.body && typeof event.body === "string") {
            request = JSON.parse(event.body);
        }
        else {
            throw new Error("Could not interpret incoming request");
        }
        return request;
    }
}
//# sourceMappingURL=handlers.js.map