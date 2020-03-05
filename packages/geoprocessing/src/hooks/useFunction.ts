import { GeoprocessingTask, GeoprocessingTaskStatus } from "../tasks";
import { useState, useContext, useEffect } from "react";
import ReportContext from "../ReportContext";
import LRUCache from "mnemonist/lru-cache";
import { GeoprocessingRequest, GeoprocessingProject } from "../types";

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

interface FunctionState<ResultType> {
  /** Populated as soon as the function request returns */
  task?: GeoprocessingTask<ResultType>;
  loading: boolean;
  error?: string;
}

const geoprocessingProjects: { [url: string]: GeoprocessingProject } = {};

// Runs the given function for the open sketch. "open sketch" is that defined by
// ReportContext. During testing, useFunction will look for example output
// values in SketchContext.exampleOutputs
export const useFunction = <ResultType>(
  // Can refer to the title of a geoprocessing function in the same project as
  // this report client, or (todo) the url of a geoprocessing function endpoint
  // from another project
  functionTitle: string
): FunctionState<ResultType> => {
  // TODO: Multiple components may call useFunction, which should not result
  // in multiple requests...
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("ReportContext not set.");
  }
  const [state, setState] = useState<FunctionState<ResultType>>({
    loading: true
  });
  useEffect(() => {
    const abortController = new AbortController();
    setState({
      loading: true
    });
    if (!context.exampleOutputs) {
      if (!context.projectUrl && context.geometryUri) {
        setState({
          loading: false,
          error: "Client Error - ReportContext.projectUrl not specified"
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
          if (!abortController.signal) {
            throw new Error(
              `Fetch of GeoprocessingProject metadata failed ${context.projectUrl}`
            );
          }
        }
        let url;
        if (/^https:/.test(functionTitle)) {
          url = functionTitle;
        } else {
          const service = geoprocessingProject!.geoprocessingServices.find(
            s => s.title === functionTitle
          );
          if (!service) {
            throw new Error(
              `Could not find service for function titled ${functionTitle}`
            );
          }
          url = service.endpoint;
        }
        // fetch task/results
        // TODO: Check for requiredProperties
        const payload: GeoprocessingRequest = {
          geometryUri: context.geometryUri
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
              error: task.error
            });
            return;
          }
        }

        let pendingRequest: Promise<GeoprocessingTask> | undefined;
        if (payload.cacheKey) {
          // check for in-flight requests
          const pending = pendingRequests.find(
            r =>
              r.cacheKey === payload.cacheKey &&
              r.functionName === functionTitle
          );
          if (pending) {
            setState({
              loading: true,
              task: pending.task,
              error: undefined
            });
            // attach handlers to promise
            pendingRequest = pending.promise;
          }
        }

        if (!pendingRequest) {
          setState({
            loading: true,
            task: undefined,
            error: undefined
          });
          pendingRequest = runTask(url, payload, abortController.signal);
          if (payload.cacheKey) {
            const pr = {
              cacheKey: payload.cacheKey,
              functionName: functionTitle,
              promise: pendingRequest
            };
            pendingRequests.push(pr);
            pendingRequest.finally(() => {
              pendingRequests = pendingRequests.filter(p => p !== pr);
            });
          }
        }

        pendingRequest
          .then(task => {
            if (
              !task.status ||
              ["pending", "completed", "failed"].indexOf(task.status) === -1
            ) {
              throw new Error("Could not parse response from lambda function");
            }
            setState({
              loading: task.status === GeoprocessingTaskStatus.Pending,
              task: task,
              error: task.error
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
              // TODO: async executionMode
              throw new Error("Async executionMode not yet supported");
            }
          })
          .catch(e => {
            if (!abortController.signal.aborted) {
              setState({
                loading: false,
                error: e.toString()
              });
            }
          });
      })();
    } else {
      // In test or storybook environment, so this will just load example data
      // or simulate loading and error states.
      const data = context.exampleOutputs.find(
        output => output.functionName === functionTitle
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
          error: context.simulateError ? context.simulateError : undefined
        },
        error: context.simulateError ? context.simulateError : undefined
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
  const response = await fetch(url, {
    signal: signal,
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const task: GeoprocessingTask = await response.json();
  if (signal.aborted) {
    throw new Error("Request aborted");
  } else {
    if (
      !task.status ||
      ["pending", "completed", "failed"].indexOf(task.status) === -1
    ) {
      throw new Error("Could not parse response from lambda function");
    }
    if (task.status === GeoprocessingTaskStatus.Pending) {
      // TODO: async executionMode
      throw new Error("Async executionMode not yet supported");
    }
    return task;
  }
};

const getGeoprocessingProject = async (
  url: string,
  signal: AbortSignal
): Promise<GeoprocessingProject> => {
  // TODO: eventually handle updated durations
  if (url in geoprocessingProjects) {
    return geoprocessingProjects[url];
  } else {
    const r = await fetch(url, { signal });
    const geoprocessingProject = await r.json();
    if (signal.aborted) {
      throw new Error("Aborted");
    } else {
      geoprocessingProjects[url] = geoprocessingProject;
      return geoprocessingProject;
    }
  }
};
