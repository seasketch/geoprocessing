import { GeoprocessingTaskStatus } from "../tasks";
import { useState, useContext, useEffect } from "react";
import ReportContext from "../ReportContext";
// Runs the given function for the open sketch. "open sketch" is that defined by
// ReportContext. During testing, useFunction will look for example output
// values in SketchContext.exampleOutputs
export const useFunction = (
// Can refer to the title of a geoprocessing function in the same project as
// this report client, or (todo) the url of a geoprocessing function endpoint
// from another project
functionTitle) => {
    // TODO: Multiple components may call useFunction, which should not result
    // in multiple requests...
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error("ReportContext not set.");
    }
    const [state, setState] = useState({
        loading: true
    });
    useEffect(() => {
        const abortController = new AbortController();
        setState({
            loading: true
        });
        if (context.exampleOutputs && context.exampleOutputs.length) {
            // In test or storybook environment
            const data = context.exampleOutputs.find(output => output.functionName === functionTitle);
            if (!data) {
                throw new Error(`Could not find example data for ${functionTitle}`);
            }
            // create a fake GeoprocessingTask record and set state, returning value
            setState({
                loading: false,
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
                    data: data.results
                }
            });
        }
        else {
            // TODO: local cache
            // find the appropriate endpoint and request results
            let url;
            if (/^https:/.test(functionTitle)) {
                url = functionTitle;
            }
            else {
                const service = context.geoprocessingProject.geoprocessingServices.find(s => s.title === functionTitle);
                if (!service) {
                    throw new Error(`Could not find service for function titled ${functionTitle}`);
                }
                url = service.uri;
            }
            // fetch task/results
            // TODO: Check for requiredProperties
            const payload = {
                geometryUri: context.geometryUri
            };
            if (context.sketchProperties.id && context.sketchProperties.updatedAt) {
                payload.cacheKey = `${context.sketchProperties.id}-${context.sketchProperties.updatedAt}`;
            }
            (async () => {
                try {
                    const response = await fetch(url, {
                        signal: abortController.signal,
                        method: "post",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    });
                    const task = await response.json();
                    setState({
                        loading: task.status === GeoprocessingTaskStatus.Pending,
                        task: task,
                        error: task.error
                    });
                    if (task.status === GeoprocessingTaskStatus.Pending) {
                        // TODO: async executionMode
                        throw new Error("Async executionMode not yet supported");
                    }
                }
                catch (e) {
                    if (!abortController.signal.aborted) {
                        setState({
                            loading: false,
                            error: e.toString()
                        });
                    }
                }
            })();
        }
        return () => {
            abortController.abort();
        };
    }, [context.geometryUri, context.sketchProperties, functionTitle]);
    return state;
};
//# sourceMappingURL=useFunction.js.map