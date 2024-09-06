import {
  InvokeCommand,
  LambdaClient,
  InvocationResponse,
} from "@aws-sdk/client-lambda";
import geobuf from "geobuf";
import Pbf from "pbf";
import { Sketch, SketchCollection } from "../types/sketch.js";
import {
  Polygon,
  MultiPolygon,
  GeoprocessingRequestModel,
  GeoprocessingRequestParams,
  JSONValue,
} from "../types/index.js";
import { genTaskCacheKey } from "../helpers/genTaskCacheKey.js";
import { GeoprocessingTask, GeoprocessingTaskStatus } from "./tasks.js";
import { byteSize } from "../util/byteSize.js";

/**
 * Runs a function on a specified lambda worker
 * @param sketch
 * @param projectName name of project in package.json
 * @param functionName name of sync geoprocessing function to run as worker
 * @param region AWS region specified in geoprocessing.json
 * @param functionParameters parameters required by lambda worker function
 * @param request
 * @returns Lambda invocation response
 */
export async function runLambdaWorker(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  projectName: string,
  functionName: string,
  region: string,
  functionParameters = {},
  request: GeoprocessingRequestModel<Polygon | MultiPolygon>,
  options: {
    /** Whether cache of worker task should be disabled, defaults to false */
    disableServerCache?: boolean;
  } = {}
): Promise<InvocationResponse> {
  const { disableServerCache = false } = options;

  // Create cache key for this task
  const cacheKey = genTaskCacheKey(functionName, sketch.properties, {
    cacheId: `${JSON.stringify(functionParameters)}`,
  } as GeoprocessingRequestParams);

  // Create payload including geometry and parameters for function
  const workerRequest: GeoprocessingRequestModel = (() => {
    let newRequest: GeoprocessingRequestModel = {
      geometryUri: request.geometryUri,
      extraParams: functionParameters,
      cacheKey,
    };

    // Encode sketch to geobuf if larger than max request size
    const sketchBuffer = geobuf.encode(sketch, new Pbf());
    var sketch64 = Buffer.from(sketchBuffer).toString("base64");

    const requestSizeBytes = byteSize(JSON.stringify(newRequest));
    const sketch64SizeBytes = byteSize(JSON.stringify(sketch64));
    const MAX_SIZE_BYTES = 6_000_000; // 6MB max payload size
    if (requestSizeBytes + sketch64SizeBytes < MAX_SIZE_BYTES) {
      newRequest.geometryGeobuf = sketch64;
    }

    return newRequest;
  })();
  const payload = JSON.stringify(workerRequest, null, 2);

  // Configure task
  const location = `/${region}/tasks/${cacheKey}`;
  const task: GeoprocessingTask = {
    id: cacheKey,
    service: region,
    wss: "",
    location,
    startedAt: new Date().toISOString(),
    logUriTemplate: `${location}/logs{?limit,nextToken}`,
    geometryUri: `${location}/geometry`,
    status: GeoprocessingTaskStatus.Pending,
    estimate: 2,
    disableServerCache,
  };

  const client = new LambdaClient({});
  return client.send(
    new InvokeCommand({
      FunctionName: `gp-${projectName}-sync-${functionName}`,
      ClientContext: Buffer.from(JSON.stringify(task)).toString("base64"),
      InvocationType: "RequestResponse",
      Payload: payload,
    })
  );
}

/**
 * Parses result from worker lambda
 **/
export function parseLambdaResponse(
  lambdaResult: InvocationResponse
): JSONValue {
  try {
    if (lambdaResult.StatusCode !== 200)
      throw Error(
        `Lambda result parsing failed: ${JSON.stringify(lambdaResult.Payload)}`
      );
    if (!lambdaResult.Payload)
      throw Error(
        `Lambda result parsing failed: No payload in lambda response`
      );

    const payload = JSON.parse(Buffer.from(lambdaResult.Payload).toString());

    if (payload.statusCode !== 200)
      throw Error(
        `Lambda result parsing failed: ${JSON.stringify(JSON.parse(payload.body))}`
      );

    return JSON.parse(payload.body).data;
  } catch {
    throw Error(`Failed to parse response from AWS lambda: ${lambdaResult}`);
  }
}
