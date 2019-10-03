import { useState, useReducer, useEffect } from "react";
import {
  Sketch,
  ReportClient,
  GeoprocessingTaskStatus,
  SketchProperties
} from "@seasketch/serverless-geoprocessing";
import { GeoprocessingClientOptions } from "../components/ReportSidebar";
import TaskRunner, { TaskState } from "../taskRunner";

interface ResultsState {
  results: { [key: string]: any };
  failed: boolean;
  loading: boolean;
  tasks: Array<TaskState>;
  eta: number;
}

const useGeoprocessingResults = (
  sketchProperties: SketchProperties,
  geometryUri: string,
  client: ReportClient,
  tabId: string,
  clientOptions?: GeoprocessingClientOptions
): ResultsState => {
  const tab = client.tabs.find(t => t.id === tabId);
  if (!tab) {
    throw new Error(
      `Unknown tab "${tabId}". Valid options are ${client.tabs
        .map(t => t.id)
        .join(", ")}`
    );
  }
  const [state, setState] = useState({
    results: {},
    failed: false,
    loading: false,
    tasks: [],
    eta: 0
  } as ResultsState);
  useEffect(() => {
    const runner = new TaskRunner();
    const onUpdate = ((e: CustomEvent<TaskState>) => {
      const task = e.detail;
      let existing = state.tasks.find(t => t.id === task.id);
      let tasks = state.tasks;
      if (existing) {
        let i = state.tasks.indexOf(existing);
        tasks = [...state.tasks.slice(0, i), task, ...state.tasks.slice(i + 1)];
      } else {
        tasks.push(task);
      }
      const failed = !!tasks.find(
        t => t.status === GeoprocessingTaskStatus.Failed
      );
      const loading =
        !failed &&
        !!tasks.find(t => t.status === GeoprocessingTaskStatus.Pending);
      const results = tasks.reduce(
        (results, task) => {
          if (task.status === GeoprocessingTaskStatus.Completed) {
            results[task.service] = task.data;
          }
          return results;
        },
        {} as { [key: string]: any }
      );
      setState({
        ...state,
        loading,
        failed,
        tasks,
        results
      });
    }) as EventListener;
    runner.addEventListener("update", onUpdate);
    for (const service of tab.requiredServices) {
      runner.request(sketchProperties, geometryUri, service);
    }
    return () => {
      runner.removeEventListener("update", onUpdate);
    };
  }, [sketchProperties, geometryUri, client, tabId, clientOptions]);
  return state;
};

export default useGeoprocessingResults;
