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
const searchParams = new URLSearchParams(window.location.search);
const service = searchParams.get('service');
const frameId = searchParams.get('frameId');
if (!service) {
  throw new Error("App must be loaded with `service` query string parameter");
}
// @ts-ignore
window.REPORTS = REPORTS;

interface ReportContextState {
  clientName: string;
  sketchProperties: SketchProperties;
  geometryUri: string;
}

const App = () => {
  const [reportContext, setReportContext] = useState<ReportContextState|null>(null);
  const [geoprocessingProject, setGeoprocessingProject] = useState<GeoprocessingProject|null>(null);
  const [geoprocessingProjectFetchError, setGeoprocessingProjectFetchError] = useState<string|null>(null);
  const [initialized, setInitialized] = useState(false);
  const onMessage = (event: MessageEvent) => {
    try {
      const message: SeaSketchReportingMessageEvent = event.data;
      if (message && message.type === SeaSketchReportingMessageEventType) {
        setReportContext({
          sketchProperties: message.sketchProperties,
          geometryUri: message.geometryUri,
          clientName: message.client
        });
      }
    } catch (e) {
      // Do nothing. Might not even be related to SeaSketch reporting
      console.error(e);
    }
  };

  useEffect(() => {
    // default to self for debugging
    let target:Window = window;
    if (window.parent) {
      target = window.parent;
    }
    window.addEventListener("message", onMessage);
    if (!initialized) {
      fetch(service).then(async (r) => {
        const project = await r.json();
        setGeoprocessingProject(project);
      }).catch((e) => {
        setGeoprocessingProjectFetchError(e.toString());
      });
      target.postMessage({type: "SeaSketchReportingInitEvent", frameId}, "*");
      setInitialized(true);
    }
    return () => {
      window.removeEventListener("message", onMessage);
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
    return <div />;
  }
};

ReactDOM.render(<App />, document.body);