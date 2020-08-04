import { GeoprocessingTask, GeoprocessingTaskStatus } from "../tasks";
import { useState, useContext, useEffect } from "react";
import ReportContext from "../ReportContext";
import LRUCache from "mnemonist/lru-cache";
import { GeoprocessingRequest, GeoprocessingProject } from "../types";
import { finished } from "stream";
import { abort } from "process";
import { Socket } from "dgram";

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
  let socket: WebSocket;
  useEffect(() => {
    const abortController = new AbortController();
    const startTime = new Date().getTime();
    //@ts-ignore

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
            console.log("found the cache...");
            setState({
              loading: false,
              task: task,
              error: task.error,
            });
            return;
          }
        }
        //let socket: WebSocket;
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

          pendingRequest = runTask(
            url,
            payload,
            abortController.signal,
            false,
            false
          );

          if (payload.cacheKey) {
            console.log("found payload cached results ", payload);
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
            let currServiceName = task.service;

            if (currServiceName) {
              if (task.wss?.length > 0) {
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
                //need to set up the socket before the task is run
                //dont set this up if its an sync or during testing
                console.info("wssUrl: ", wssUrl);
                getSendSocket(
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
            console.info("pending...");
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
            console.warn("bombout-->>> ", e);
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

const getSendSocket = (
  task: GeoprocessingTask,
  wss: string,
  setState,
  cacheKey,
  url,
  payload,
  currServiceName,
  abortController,
  socket
): WebSocket => {
  if (socket === undefined) {
    socket = new WebSocket(wss);
  }

  console.info("opened socket to ", wss);
  console.info("at ", new Date().toISOString());
  socket.onopen = function (e) {
    const task = resultsCache.get(
      makeLRUCacheKey(currServiceName, cacheKey)
    ) as GeoprocessingTask | undefined;
    console.info("is it in the cache?? ", task);
    console.info("open socket, checking for finished, event is: ", e);
    //check on open to see if the results are cached. make sure
    //you call the uri with the checkCacheOnly value set to true
    let finishedRequest: Promise<GeoprocessingTask> = runTask(
      url,
      payload,
      abortController.signal,
      true,
      true
    );

    finishedRequest.then((finishedTask) => {
      console.info("on connect msg key, finished task is ", finishedTask);
      if (finishedTask.service === currServiceName) {
        let ft = JSON.stringify(finishedTask);
        //in case the socket took too long to open, check and see
        //if the results are already done - just by looking in the cache.
        //if they're not cached, you'll get a "NO_CACHE_HIT returned"
        if (ft && finishedTask.id !== "NO_CACHE_HIT" && finishedTask.data) {
          setState({
            loading: false,
            task: finishedTask,
            error: finishedTask.error,
          });
          //socket can close, dont need to keep it open since the
          //lambda is already finished
          //console.log("closing socket for ", currServiceName);
          socket.close(1000, currServiceName);
          return;
        } else {
          console.warn(
            "things its a finished task, but no cache for ",
            finishedTask
          );
        }
      }
    });
  };

  socket.onmessage = function (event) {
    //assuming a finished message only for now
    //The websocket cannot send the entire return value, it blows up on
    //the socket.send for some Task results. As a resultt, just sending back
    //the request cacheKey
    //Note: check if keys match. can have events for other reports appear if several are open at once.
    //ignore those.
    let incomingData = JSON.parse(event.data);
    //testing to see if messages this client sends come back...they shouldn't
    console.info("on message incoming data::: ", incomingData);

    if (
      incomingData.cacheKey === cacheKey &&
      incomingData.serviceName === currServiceName
    ) {
      payload.cacheKey = cacheKey;
      console.info(
        "got a finished message, has url of ",
        url + " and a payload of ",
        payload
      );
      if (incomingData.failureMessage?.length > 0) {
        console.info("got failure message: ", incomingData.failureMessage);
        task.error = incomingData.failureMessage;
        task.status = GeoprocessingTaskStatus.Failed;
        setState({
          loading: false,
          task: task,
          error: task.error,
        });
        socket.close();
      } else {
        console.info("-->>>>>>>>>>>>>>>> setting timeout before finishing");

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
    console.info("socket closed");
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

const finishTask = async (
  url,
  payload,
  abortController,
  setState,
  currServiceName,
  socket
) => {
  console.info("trying to finish task for ", currServiceName);
  console.info("the url is: -> ", url);
  console.info("the payload is: -> ", payload);

  console.info("running finished task at: ", new Date().toISOString());
  let finishedRequest: Promise<GeoprocessingTask> = runTask(
    url,
    payload,
    abortController.signal,
    true,
    false
  );
  finishedRequest.then((finishedTask) => {
    console.info(" now the task is finished: ", finishedTask);

    if (finishedTask.service !== currServiceName) {
      console.log(
        " but got a finish for the wrong one; got",
        finishedTask,
        " expected ",
        currServiceName
      );
    }
    if (finishedTask.data === undefined) {
      console.warn(
        currServiceName,
        ": got a finish with no data...",
        finishedTask
      );
      return;
    } else if (finishedTask.data) {
      console.info("and its all done for ", currServiceName);
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

const runTask = async (
  url: string,
  payload: GeoprocessingRequest,
  signal: AbortSignal,
  checkCacheOnly: boolean,
  onConnect: boolean
): Promise<GeoprocessingTask> => {
  const urlInst = new URL(url);
  urlInst.searchParams.append("geometryUri", payload.geometryUri!);
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

const getGeoprocessingProject = async (
  url: string,
  signal: AbortSignal
): Promise<GeoprocessingProject> => {
  // TODO: eventually handle updated durationsf
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
