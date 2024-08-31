import { GeoprocessingTask, GeoprocessingTaskStatus } from "../aws/tasks.js";
import { useState, useContext, useEffect } from "react";
import { useDeepEqualMemo } from "./useDeepEqualMemo.js";
import { ReportContext } from "../context/index.js";
import {
  GeoprocessingRequest,
  GeoprocessingProject,
  GeoprocessingRequestParams,
} from "../types/index.js";
import { runTask, finishTask } from "../clients/tasks.js";
import { genTaskCacheKey } from "../helpers/genTaskCacheKey.js";
import cloneDeep from "lodash/cloneDeep.js";

interface PendingRequest {
  functionName: string;
  cacheKey: string;
  promise: Promise<GeoprocessingTask>;
  task?: GeoprocessingTask;
}

interface PendingMetadataRequest {
  url: string;
  promise: Promise<GeoprocessingProject>;
}

interface FunctionState<ResultType> {
  /** Populated as soon as the function request returns */
  task?: GeoprocessingTask<ResultType>;
  loading: boolean;
  error?: string;
}

/** Local results cache */
const localCache = new Map<string, GeoprocessingTask>();

/**  */
let pendingRequests: PendingRequest[] = [];
let pendingMetadataRequests: PendingMetadataRequest[] = [];
let geoprocessingProjects: { [url: string]: GeoprocessingProject } = {};

/**
 * Runs the given geoprocessing function for the current sketch, as defined by ReportContext
 * During testing, useFunction will look for example output values in SketchContext.exampleOutputs
 */
export const useFunction = <ResultType>(
  /** Title of geoprocessing function in this project to run.  @todo support external project function */
  functionTitle: string,
  /** Additional runtime parameters from report client for geoprocessing function.  Validation left to implementing function */
  extraParams: GeoprocessingRequestParams = {}
): FunctionState<ResultType> => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("ReportContext not set.");
  }
  const [state, setState] = useState<FunctionState<ResultType>>({
    loading: true,
  });
  const memoizedExtraParams = useDeepEqualMemo(extraParams);

  let socket: WebSocket;

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
        /** current geoprocessing project metadata (service manifest) */
        let geoprocessingProject: GeoprocessingProject;

        // get function endpoint url for running task
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
        let executionMode: string;
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
          executionMode = service?.executionMode;
        }

        // fetch task/results
        // TODO: Check for requiredProperties
        const payload: GeoprocessingRequest = {
          geometryUri: context.geometryUri,
          extraParams: JSON.stringify(extraParams), // will be url encoded automatically
        };
        if (context.sketchProperties.id && context.sketchProperties.updatedAt) {
          const theCacheKey = genTaskCacheKey(
            functionTitle,
            context.sketchProperties,
            extraParams
          );
          console.log(`cacheKey: ${theCacheKey}`);
          payload.cacheKey = theCacheKey;
        }

        // check local results cache. may already be available
        if (payload.cacheKey) {
          let task = localCache.get(payload.cacheKey) as
            | GeoprocessingTask<ResultType>
            | undefined;
          if (task) {
            setState({
              loading: false,
              task: task,
              error: task.error,
            });
            return;
          }
        }

        // check if a matching request is already in-flight and assign to it if so
        let pendingRequest: Promise<GeoprocessingTask> | undefined;
        if (payload.cacheKey) {
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
            pendingRequest = pending.promise;
          }
        }

        // start the task
        if (!pendingRequest) {
          setState({
            loading: true,
            task: undefined,
            error: undefined,
          });

          pendingRequest = runTask(
            url,
            payload,
            abortController.signal,
            false,
            false
          );

          // add as pending request
          if (payload.cacheKey) {
            const pr = {
              cacheKey: payload.cacheKey,
              functionName: functionTitle,
              promise: pendingRequest,
            };
            pendingRequests.push(pr);

            // remove from pending once resolves
            pendingRequest.finally(() => {
              pendingRequests = pendingRequests.filter((p) => p !== pr);
            });
          }
        }

        // After task started, but still pending
        pendingRequest
          .then((task) => {
            let currServiceName = task.service;
            if (currServiceName) {
              if (
                task.status !== "completed" &&
                task.wss?.length > 0 &&
                executionMode === "async"
              ) {
                let sname = encodeURIComponent(currServiceName);
                let ck = encodeURIComponent(payload.cacheKey || "");
                let wssUrl =
                  task.wss +
                  "?" +
                  "serviceName=" +
                  sname +
                  "&cacheKey=" +
                  ck +
                  "&fromClient=true";

                // set up the socket (async only)
                getSocket(
                  task,
                  wssUrl,
                  setState,
                  payload.cacheKey,
                  url,
                  payload,
                  functionTitle,
                  abortController,
                  socket
                );
              }
            }

            // check for invalid status
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

            // set to pending state initially
            setState({
              loading: task.status === GeoprocessingTaskStatus.Pending,
              task: task,
              error: task.error,
            });

            // if task complete then load results
            if (
              payload.cacheKey &&
              task.status === GeoprocessingTaskStatus.Completed
            ) {
              localCache.set(payload.cacheKey, cloneDeep(task));
            }

            // if task pending then nothing more to do
            if (task.status === GeoprocessingTaskStatus.Pending) {
              if (task.wss?.length > 0) {
                setState({
                  loading: true,
                  task: task,
                  error: task.error,
                });
              }
              return;
            }
          })
          .catch((e) => {
            if (!abortController.signal.aborted) {
              setState({
                loading: false,
                error: e.toString(),
              });
            }
          });
      })();
    } else {
      // This is test or storybook environment, so load example data
      // or simulate loading and error states.
      const data = context.exampleOutputs.find(
        (output) => output.functionName === functionTitle
      );
      if (!data && !context.simulateLoading && !context.simulateError) {
        setState({
          loading: false,
          error: `Could not find example data for sketch "${context.sketchProperties.name}" and function "${functionTitle}". Run \`npm test\` to generate example outputs`,
        });
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
          wss: "",
          status: GeoprocessingTaskStatus.Completed,
          startedAt: new Date().toISOString(),
          duration: 0,
          data: (data || {}).results as ResultType,
          error: context.simulateError ? context.simulateError : undefined,
          estimate: 0,
        },
        error: context.simulateError ? context.simulateError : undefined,
      });
    }

    // Upon teardown any outstanding requests should be aborted. This useEffect
    // cleanup function will run whenever geometryUri, sketchProperties, or
    // functionTitle context vars are changed, or if the component is being
    // unmounted
    return () => {
      abortController.abort();
    };
  }, [
    context.geometryUri,
    context.sketchProperties,
    functionTitle,
    memoizedExtraParams,
  ]);
  return state;
};

/**
 * Creates WebSocket at wss url that listens for task completion
 */
const getSocket = (
  task: GeoprocessingTask,
  wssUrl: string,
  setState,
  cacheKey,
  url,
  payload,
  currServiceName,
  abortController,
  socket
): WebSocket => {
  if (socket === undefined) {
    socket = new WebSocket(wssUrl);
  }

  // once socket open, check if task completed before it opened
  socket.onopen = function () {
    // Check local cache first
    const task = localCache.get(cacheKey) as GeoprocessingTask | undefined;

    if (task) {
      setState({
        loading: false,
        task: task,
        error: task.error,
      });
      socket.close();
      return;
    }

    // Check server-side cache next using checkCacheOnly true
    let finishedRequest: Promise<GeoprocessingTask> = runTask(
      url,
      payload,
      abortController.signal,
      true,
      true
    );

    finishedRequest.then((finishedTask) => {
      if (finishedTask.service === currServiceName) {
        let ft = JSON.stringify(finishedTask);
        //if not cached, you'll get a "NO_CACHE_HIT"
        if (ft && finishedTask.id !== "NO_CACHE_HIT" && finishedTask.data) {
          setState({
            loading: false,
            task: finishedTask,
            error: finishedTask.error,
          });
          // task is complete so close the socket
          socket.close(1000, currServiceName);
          return;
        }
      }
    });
  };

  // if task complete message received on socket (the only message type supported)
  // then finish the task (because results aren't sent on the socket, too big)
  socket.onmessage = function (event) {
    let incomingData = JSON.parse(event.data);

    if (event.data.timestamp) {
      const nowTime = Date.now();
      console.log(`timestamp ${currServiceName}: ${event.data.timestamp}`);
      console.log(`received ${currServiceName}: ${nowTime}`);
      console.log(`diff ${currServiceName}: ${nowTime - event.data.timestamp}`);
    }

    // check cache keys match. can have events for other reports appear if several are open at once.
    if (
      incomingData.cacheKey === cacheKey &&
      incomingData.serviceName === currServiceName
    ) {
      payload.cacheKey = cacheKey;

      if (incomingData.failureMessage?.length > 0) {
        task.error = incomingData.failureMessage;
        task.status = GeoprocessingTaskStatus.Failed;
        setState({
          loading: false,
          task: task,
          error: task.error,
        });
        socket.close();
      } else {
        finishTask(
          url,
          payload,
          abortController,
          setState,
          currServiceName,
          socket
        );
      }
    }
  };
  socket.onclose = function (event) {
    //no op
  };
  socket.onerror = function (error) {
    if (socket.url?.length > 0) {
      setState({
        loading: false,
        error: "Error loading results. Unexpected socket error.",
      });
    }
  };

  return socket;
};

/**
 * Fetches project metadata, aka service manifest at url
 */
const getGeoprocessingProject = async (
  url: string,
  signal: AbortSignal
): Promise<GeoprocessingProject> => {
  // TODO: eventually handle updated duration
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
