import { GeoprocessingTask } from "../aws/tasks";
import {
  GeoprocessingRequest,
  GeoprocessingRequestParams,
  SketchProperties,
} from "../types";
import md5 from "spark-md5";
import canonicalize from "canonicalize";

/**
 * Generates a cache key for a geoprocessing request, given sketch properties and optional extra parameters (must be JSON compatible object)
 * Extra parameters are canonicalized and hashed using md5 to ensure cache key is consistent.  Canonicalization ensures object keys are consistent
 * but not arrays.  If you use arrays as extraParam values, make sure the order stays the same and sort first if needed to generate a consistent cache key.
 */
export const genTaskCacheKey = (
  /** Properties of sketch to generate cache key for */
  props: SketchProperties,
  /** Extra parameters to include in cache key */
  extraParams: GeoprocessingRequestParams = {}
) => {
  let cacheKey = `${props.id}-${props.updatedAt}`;
  if (Object.keys(extraParams).length > 0) {
    // Ensure JSON object has consistent stringification
    const canon = canonicalize(extraParams);
    // Hash the stringified JSON object
    const hash = md5.hash(JSON.stringify(canon));
    // Append the hash to the cache key to keep the key semi-human-readable
    cacheKey = `${cacheKey}-${hash}`;
  }
  return cacheKey;
};

/**
 * Runs task by sending GET request to url with payload and optional flags
 * Task can be aborted using caller-provided AbortSignal
 */
export const runTask = async (
  url: string,
  payload: GeoprocessingRequest,
  signal: AbortSignal,
  checkCacheOnly: boolean,
  onConnect: boolean
): Promise<GeoprocessingTask> => {
  const urlInst = new URL(url);
  urlInst.searchParams.append("geometryUri", payload.geometryUri!);
  urlInst.searchParams.append("extraParams", payload.extraParams || "{}");
  urlInst.searchParams.append("cacheKey", payload.cacheKey || "");
  if (checkCacheOnly) {
    urlInst.searchParams.append("checkCacheOnly", "true");
    urlInst.searchParams.append("onConnect", "" + onConnect);
  }

  const response = await fetch(urlInst.toString(), {
    signal: signal,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const task: GeoprocessingTask = await response.json();
  if (signal.aborted) {
    throw new Error("Request aborted");
  } else {
    return task;
  }
};

/**
 * Finishes task by hitting the remote cache, updating the hook with the task result and cleaning up
 */
export const finishTask = async (
  url,
  payload,
  abortController,
  setState,
  currServiceName,
  socket
) => {
  // Get result using checkCacheOnly flag
  let finishedRequest: Promise<GeoprocessingTask> = runTask(
    url,
    payload,
    abortController.signal,
    true,
    false
  );
  finishedRequest.then((finishedTask) => {
    if (finishedTask.data === undefined) {
      return;
    } else if (finishedTask.data) {
      setState({
        loading: false,
        task: finishedTask,
        error: finishedTask.error,
      });
      socket.close(1000, currServiceName);
    }
    return;
  });
};
