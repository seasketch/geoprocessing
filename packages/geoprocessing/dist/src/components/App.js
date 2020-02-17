import React, { useState, useEffect } from "react";
import { SeaSketchReportingMessageEventType } from "../types";
import ReportContext from "../ReportContext";
import ReactDOM from 'react-dom';
// Will be replaced by plugin with actual Report implementations
// const REPORTS = require("@seasketch/geoprocessing/reports");
const REPORTS = require("./client-loader");
const service = new URLSearchParams(window.location.search).get('service');
if (!service) {
    throw new Error("App must be loaded with `service` query string parameter");
}
// @ts-ignore
window.REPORTS = REPORTS;
let geoprocessingProject;
let geoprocessingProjectFetchError;
fetch(service).then(async (r) => {
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
ReactDOM.render(React.createElement(App, null), document.body);
//# sourceMappingURL=App.js.map