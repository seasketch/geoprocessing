import { GeoprocessingTask, GeoprocessingTaskStatus } from "../tasks";
import { useState, useContext, useEffect } from "react";
import ReportContext from "../ReportContext";
import LRUCache from "mnemonist/lru-cache";
import { GeoprocessingRequest, GeoprocessingProject } from "../types";
import { finished } from "stream";

const resultsCache = new LRUCache<string, GeoprocessingTask>(
  Uint32Array,
  Array,
  12
);
const makeLRUCacheKey = (func: string, cacheKey: string): string =>
  `${func}-${cacheKey}`;

interface PendingRequest {
  functionName: string;
  cacheKey: string;
  promise: Promise<GeoprocessingTask>;
  task?: GeoprocessingTask;
}

let pendingRequests: PendingRequest[] = [];

interface PendingMetadataRequest {
  url: string;
  promise: Promise<GeoprocessingProject>;
}

let pendingMetadataRequests: PendingMetadataRequest[] = [];

interface FunctionState<ResultType> {
  /** Populated as soon as the function request returns */
  task?: GeoprocessingTask<ResultType>;
  loading: boolean;
  error?: string;
}

let geoprocessingProjects: { [url: string]: GeoprocessingProject } = {};

// Runs the given function for the open sketch. "open sketch" is that defined by
// ReportContext. During testing, useFunction will look for example output
// values in SketchContext.exampleOutputs
export const useFunction = <ResultType>(
  // Can refer to the title of a geoprocessing function in the same project as
  // this report client, or (todo) the url of a geoprocessing function endpoint
  // from another project
  functionTitle: string
): FunctionState<ResultType> => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("ReportContext not set.");
  }
  const [state, setState] = useState<FunctionState<ResultType>>({
    loading: true,
  });
  useEffect(() => {
    const abortController = new AbortController();
    setState({
      loading: true,
    });
    if (!context.exampleOutputs) {
      if (!context.projectUrl && context.geometryUri) {
        setState({
          loading: false,
          error: "Client Error - ReportContext.projectUrl not specified",
        });
        return;
      }
      (async () => {
        // find the appropriate endpoint and request results
        let geoprocessingProject: GeoprocessingProject;
        try {
          geoprocessingProject = await getGeoprocessingProject(
            context.projectUrl,
            abortController.signal
          );
        } catch (e) {
          if (!abortController.signal.aborted) {
            setState({
              loading: false,
              error: `Fetch of GeoprocessingProject metadata failed ${context.projectUrl}`,
            });
            return;
          }
        }
        let url: string;
        if (/^https:/.test(functionTitle)) {
          url = functionTitle;
        } else {
          const service = geoprocessingProject!.geoprocessingServices.find(
            (s) => s.title === functionTitle
          );
          if (!service) {
            setState({
              loading: false,
              error: `Could not find service for function titled ${functionTitle}`,
            });
            return;
          }
          url = service.endpoint;
        }
        // fetch task/results
        // TODO: Check for requiredProperties
        const payload: GeoprocessingRequest = {
          geometryUri: context.geometryUri,
        };
        if (context.sketchProperties.id && context.sketchProperties.updatedAt) {
          payload.cacheKey = `${context.sketchProperties.id}-${context.sketchProperties.updatedAt}`;
        }

        if (payload.cacheKey) {
          // check results cache. may already be available
          const task = resultsCache.get(
            makeLRUCacheKey(functionTitle, payload.cacheKey)
          ) as GeoprocessingTask<ResultType> | undefined;
          if (task) {
            setState({
              loading: false,
              task: task,
              error: task.error,
            });
            return;
          }
        }

        let pendingRequest: Promise<GeoprocessingTask> | undefined;
        if (payload.cacheKey) {
          // check for in-flight requests
          const pending = pendingRequests.find(
            (r) =>
              r.cacheKey === payload.cacheKey &&
              r.functionName === functionTitle
          );
          if (pending) {
            setState({
              loading: true,
              task: pending.task,
              error: undefined,
            });
            // attach handlers to promise
            pendingRequest = pending.promise;
          }
        }

        if (!pendingRequest) {
          setState({
            loading: true,
            task: undefined,
            error: undefined,
          });
          pendingRequest = runTask(url, payload, abortController.signal);
          if (payload.cacheKey) {
            const pr = {
              cacheKey: payload.cacheKey,
              functionName: functionTitle,
              promise: pendingRequest,
            };
            pendingRequests.push(pr);
            pendingRequest.finally(() => {
              pendingRequests = pendingRequests.filter((p) => p !== pr);
            });
          }
        }

        pendingRequest
          .then((task) => {
            if (
              !task.status ||
              ["pending", "completed", "failed"].indexOf(task.status) === -1
            ) {
              setState({
                loading: false,
                task: task,
                error: `Could not parse response from geoprocessing function.`,
              });
              return;
            }
            setState({
              loading: task.status === GeoprocessingTaskStatus.Pending,
              task: task,
              error: task.error,
            });
            if (
              payload.cacheKey &&
              task.status === GeoprocessingTaskStatus.Completed
            ) {
              resultsCache.set(
                makeLRUCacheKey(functionTitle, payload.cacheKey),
                task
              );
            }
            if (task.status === GeoprocessingTaskStatus.Pending) {
              if (task.wss && task.wss.length > 0) {
                let socket = new WebSocket(task.wss);
                setState({
                  loading: true,
                  task: task,
                  error: task.error,
                });
                socket.onopen = function (e) {
                  setState({
                    loading: task.status === GeoprocessingTaskStatus.Pending,
                    task: task,
                    error: task.error,
                  });
                };
                socket.onmessage = function (event) {
                  //assuming a finished message only for now
                  //The websocket cannot send the entire return value, it blows up on
                  //the socket.send for some Task results. As a resultt, just sending back
                  //the request cacheKey
                  //Note: check if keys match. can have events for other reports appear if several are open at once.
                  //ignore those.
                  if (event.data === payload.cacheKey) {
                    let finishedRequest: Promise<GeoprocessingTask> = runTask(
                      url,
                      payload,
                      abortController.signal
                    );
                    finishedRequest.then((finishedTask) => {
                      setState({
                        loading: false,
                        task: finishedTask,
                        error: finishedTask.error,
                      });
                      return;
                    });
                  }
                };
                socket.onclose = function (event) {
                  if (event.wasClean) {
                    setState({
                      loading:
                        task.status === GeoprocessingTaskStatus.Completed,
                      task: task,
                      error: task.error,
                    });
                  } else {
                    setState({
                      loading: task.status === GeoprocessingTaskStatus.Failed,
                      task: task,
                      error: task.error,
                    });
                  }
                };
                socket.onerror = function (error) {
                  console.warn("error on socket: ", error);
                  setState({
                    loading: false,
                    task: task,
                    error: "Error receiving data: " + error,
                  });
                };
              }
              return;
            }
          })
          .catch((e) => {
            console.warn("Error when connecting ", e);
            if (!abortController.signal.aborted) {
              setState({
                loading: false,
                error: e.toString(),
              });
            }
          });
      })();
    } else {
      // In test or storybook environment, so this will just load example data
      // or simulate loading and error states.
      const data = context.exampleOutputs.find(
        (output) => output.functionName === functionTitle
      );
      if (!data && !context.simulateLoading && !context.simulateError) {
        throw new Error(
          `Could not find example data for sketch "${context.sketchProperties.name}" and function "${functionTitle}". Run \`npm test\` to generate example outputs`
        );
      }
      // create a fake GeoprocessingTask record and set state, returning value
      setState({
        loading: context.simulateLoading ? context.simulateLoading : false,
        task: {
          id: "abc123",
          location: "https://localhost/abc123",
          service: "https://localhost",
          logUriTemplate: "https://localhost/logs/abc123",
          geometryUri: "https://localhost/geometry/abc123",
          wss: "wss://localhost/logs/abc123",
          status: GeoprocessingTaskStatus.Completed,
          startedAt: new Date().toISOString(),
          duration: 0,
          data: (data || {}).results as ResultType,
          error: context.simulateError ? context.simulateError : undefined,
          estimate: 0,
        },
        error: context.simulateError ? context.simulateError : undefined,
      });
      // end test mode handling
    }
    // Upon teardown any outstanding requests should be aborted. This useEffect
    // cleanup function will run whenever geometryUri, sketchProperties, or
    // functionTitle context vars are changed, or if the component is being
    // unmounted
    return () => {
      abortController.abort();
    };
  }, [context.geometryUri, context.sketchProperties, functionTitle]);
  return state;
};

const runTask = async (
  url: string,
  payload: GeoprocessingRequest,
  signal: AbortSignal
): Promise<GeoprocessingTask> => {
  const urlInst = new URL(url);
  urlInst.searchParams.append("geometryUri", payload.geometryUri!);
  urlInst.searchParams.append("cacheKey", payload.cacheKey || "");
  const response = await fetch(urlInst.toString(), {
    signal: signal,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(payload)
  });
  const task: GeoprocessingTask = await response.json();
  if (signal.aborted) {
    throw new Error("Request aborted");
  } else {
    return task;
  }
};

const getGeoprocessingProject = async (
  url: string,
  signal: AbortSignal
): Promise<GeoprocessingProject> => {
  // TODO: eventually handle updated durations
  const pending = pendingMetadataRequests.find((r) => r.url === url);
  if (pending) {
    return pending.promise;
  }
  if (url in geoprocessingProjects) {
    return geoprocessingProjects[url];
  }

  const request = fetch(url, { signal }).then(async (response) => {
    const geoprocessingProject = await response.json();
    if (signal.aborted) {
      throw new Error("Aborted");
    } else {
      geoprocessingProjects[url] = geoprocessingProject;
      pendingMetadataRequests = pendingMetadataRequests.filter(
        (r) => r.url !== url
      );
      return geoprocessingProject;
    }
  });
  pendingMetadataRequests.push({
    url,
    promise: request,
  });
  return request;
};

useFunction.reset = () => {
  geoprocessingProjects = {};
};
