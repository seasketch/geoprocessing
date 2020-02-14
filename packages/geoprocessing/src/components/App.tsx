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
const projectRoot = "https://o88m6jvnhi.execute-api.us-west-1.amazonaws.com/prod/";
// @ts-ignore
window.REPORTS = REPORTS;

let geoprocessingProject:GeoprocessingProject;
let geoprocessingProjectFetchError:string;
fetch(projectRoot).then(async (r) => {
  geoprocessingProject = await r.json();
  console.log(geoprocessingProject);
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
        console.log('message', message);
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
    console.log('REport', Report, reportContext);
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