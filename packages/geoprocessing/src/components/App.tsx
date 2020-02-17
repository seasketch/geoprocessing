import React, { useState, useEffect } from "react";
import {
  SeaSketchReportingMessageEvent,
  SeaSketchReportingMessageEventType,
  SketchProperties,
  GeoprocessingProject
} from "../types";
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

let geoprocessingProject:GeoprocessingProject;
let geoprocessingProjectFetchError:string;
fetch(service).then(async (r) => {
  geoprocessingProject = await r.json();
}).catch((e) => {
  geoprocessingProjectFetchError = e.toString();
});


interface ReportContextState {
  clientName: string;
  sketchProperties: SketchProperties;
  geometryUri: string;
}

const App = () => {
  const [reportContext, setReportContext] = useState<ReportContextState|null>(null);
  const [initialized, setInitialized] = useState(false);
  const onMessage = (event: MessageEvent) => {
    try {
      const message: SeaSketchReportingMessageEvent = JSON.parse(event.data);
      if (message && message.type === SeaSketchReportingMessageEventType) {
        setReportContext({
          sketchProperties: message.sketchProperties,
          geometryUri: message.geometryUri,
          clientName: message.client
        });
      }
    } catch (e) {
      // Do nothing. Might not even be related to SeaSketch reporting
    }
  };

  useEffect(() => {
    // default to self for debugging
    let target:Window = window;
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
    return <div>{geoprocessingProjectFetchError}</div>
  } else if (reportContext && geoprocessingProject) {
    const Report = REPORTS[reportContext.clientName];
    return <ReportContext.Provider value={{
      ...reportContext,
      geoprocessingProject
    }}>
      <Report />  
    </ReportContext.Provider>
  } else {
    return <div>initialized</div>;
  }
};

ReactDOM.render(<App />, document.body);