"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const serverless_geoprocessing_1 = require("@seasketch/serverless-geoprocessing");
const taskRunner_1 = __importDefault(require("../taskRunner"));
const useGeoprocessingResults = (sketchProperties, geometryUri, client, tabId, clientOptions) => {
    const tab = client.tabs.find(t => t.id === tabId);
    if (!tab) {
        throw new Error(`Unknown tab "${tabId}". Valid options are ${client.tabs
            .map(t => t.id)
            .join(", ")}`);
    }
    const [state, setState] = react_1.useState({
        results: {},
        failed: false,
        loading: false,
        tasks: [],
        eta: 0
    });
    react_1.useEffect(() => {
        const runner = new taskRunner_1.default();
        const onUpdate = ((e) => {
            const task = e.detail;
            let existing = state.tasks.find(t => t.id === task.id);
            let tasks = state.tasks;
            if (existing) {
                let i = state.tasks.indexOf(existing);
                tasks = [...state.tasks.slice(0, i), task, ...state.tasks.slice(i + 1)];
            }
            else {
                tasks.push(task);
            }
            const failed = !!tasks.find(t => t.status === serverless_geoprocessing_1.GeoprocessingTaskStatus.Failed);
            const loading = !failed &&
                !!tasks.find(t => t.status === serverless_geoprocessing_1.GeoprocessingTaskStatus.Pending);
            const results = tasks.reduce((results, task) => {
                if (task.status === serverless_geoprocessing_1.GeoprocessingTaskStatus.Completed) {
                    results[task.service] = task.data;
                }
                return results;
            }, {});
            setState({
                ...state,
                loading,
                failed,
                tasks,
                results
            });
        });
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
exports.default = useGeoprocessingResults;
