import { GeoprocessingTask } from "../aws/tasks.js";
import { GeoprocessingRequest } from "../types/index.js";

/**
 * Runs task by sending GET request to url with payload and optional flags
 * Task can be aborted using caller-provided AbortSignal
 */
export const runTask = async (
  url: string,
  payload: GeoprocessingRequest,
  signal: AbortSignal,
  checkCacheOnly: boolean,
  onConnect: boolean,
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
  socket,
) => {
  // Get result using checkCacheOnly flag
  const finishedRequest: Promise<GeoprocessingTask> = runTask(
    url,
    payload,
    abortController.signal,
    true,
    false,
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
