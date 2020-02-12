// import { useState, useReducer, useEffect } from "react";
// import { Sketch, SketchProperties } from "../types";
// import TaskRunner, { TaskState } from "../taskRunner";
import { GeoprocessingTask as Task } from "../tasks";
import { useState, useContext } from "react";
import SketchContext from "../SketchContext";

export interface GeoprocessingTask<ResultType> extends Task {
  data?: ResultType;
}

export const useFunction = <ResultType>(
  functionId: string
): {
  task?: GeoprocessingTask<ResultType>;
  loading: boolean;
  error?: string;
} => {
  const context = useContext(SketchContext);
  if (context) {
  } else {
  }
  const [state, setState] = useState({ loading: true });
  return state;
};

// const useFunction = (
//   sketchProperties: SketchProperties,
//   geometryUri: string,
//   client: ReportClient,
//   tabId: string,
//   clientOptions?: GeoprocessingClientOptions
// ): ResultsState => {
//   const tab = client.tabs.find(t => t.id === tabId);
//   if (!tab) {
//     throw new Error(
//       `Unknown tab "${tabId}". Valid options are ${client.tabs
//         .map(t => t.id)
//         .join(", ")}`
//     );
//   }
//   const [state, setState] = useState({
//     results: {},
//     failed: false,
//     loading: false,
//     tasks: [],
//     eta: 0
//   } as ResultsState);
//   useEffect(() => {
//     const runner = new TaskRunner();
//     const onUpdate = ((e: CustomEvent<TaskState>) => {
//       const task = e.detail;
//       let existing = state.tasks.find(t => t.id === task.id);
//       let tasks = state.tasks;
//       if (existing) {
//         let i = state.tasks.indexOf(existing);
//         tasks = [...state.tasks.slice(0, i), task, ...state.tasks.slice(i + 1)];
//       } else {
//         tasks.push(task);
//       }
//       const failed = !!tasks.find(
//         t => t.status === GeoprocessingTaskStatus.Failed
//       );
//       const loading =
//         !failed &&
//         !!tasks.find(t => t.status === GeoprocessingTaskStatus.Pending);
//       const results = tasks.reduce((results, task) => {
//         if (task.status === GeoprocessingTaskStatus.Completed) {
//           results[task.service] = task.data;
//         }
//         return results;
//       }, {} as { [key: string]: any });
//       setState({
//         ...state,
//         loading,
//         failed,
//         tasks,
//         results
//       });
//     }) as EventListener;
//     runner.addEventListener("update", onUpdate);
//     for (const service of tab.requiredServices) {
//       runner.request(sketchProperties, geometryUri, service);
//     }
//     return () => {
//       runner.removeEventListener("update", onUpdate);
//     };
//   }, [sketchProperties, geometryUri, client, tabId, clientOptions]);
//   return state;
// };

// export default useFunction;
