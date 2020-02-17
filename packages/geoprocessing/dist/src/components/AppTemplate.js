import React, { useState, useEffect } from "react";
import { SeaSketchReportingMessageEventType } from "../types";
import ReportContext from "../ReportContext";
// Will be replaced by plugin with actual Report implementations
const REPORTS = {};
const projectRoot = "https://o88m6jvnhi.execute-api.us-west-1.amazonaws.com/prod/";
let geoprocessingProject;
let geoprocessingProjectFetchError;
fetch(projectRoot).then(async (r) => {
    geoprocessingProject = await r.json();
}).catch((e) => {
    geoprocessingProjectFetchError = e.toString();
});
const App = () => {
    const [reportContext, setReportContext] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const onMessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            if (message && message.type === SeaSketchReportingMessageEventType) {
                setReportContext({
                    sketchProperties: message.sketchProperties,
                    geometryUri: message.geometryUri,
                    clientName: message.client
                });
            }
        }
        catch (e) {
            // Do nothing. Might not even be related to SeaSketch reporting
        }
    };
    useEffect(() => {
        // default to self for debugging
        let target = window;
        if (window.opener instanceof Window) {
            target = window.opener;
        }
        target.addEventListener("message", onMessage);
        if (!initialized) {
            target.postMessage("INIT", "*");
            setInitialized(true);
        }
        return () => {
            target.removeEventListener("message", onMessage);
        };
    }, [initialized]);
    if (geoprocessingProjectFetchError) {
        return React.createElement("div", null, geoprocessingProjectFetchError);
    }
    else if (reportContext && geoprocessingProject) {
        const Report = REPORTS[reportContext.clientName];
        return React.createElement(ReportContext.Provider, { value: {
                ...reportContext,
                geoprocessingProject
            } },
            React.createElement(Report, null));
    }
    else {
        return React.createElement("div", null, "initialized");
    }
};
export default App;
//# sourceMappingURL=AppTemplate.js.map