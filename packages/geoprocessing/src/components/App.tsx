import React, { useState, useEffect } from "react";
import {
  SeaSketchReportingMessageEvent,
  SeaSketchReportingMessageEventType,
  SketchProperties,
  GeoprocessingProject
} from "../types";
import ReportContext from "../ReportContext";
import ReactDOM from "react-dom";

const REPORTS = require("./client-loader");
const searchParams = new URLSearchParams(window.location.search);
const service = searchParams.get("service");
const frameId = searchParams.get("frameId");
if (!service) {
  throw new Error("App must be loaded with `service` query string parameter");
}

interface ReportContextState {
  clientName: string;
  sketchProperties: SketchProperties;
  geometryUri: string;
}

const App = () => {
  const [reportContext, setReportContext] = useState<ReportContextState | null>(
    null
  );
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "x") {
      if (window.parent) {
        window.parent.postMessage(
          { type: "SeaSketchReportingKeydownEvent", key: "x" },
          "*"
        );
      }
    }
  };

  useEffect(() => {
    // default to self for debugging
    let target: Window = window;
    if (window.parent) {
      target = window.parent;
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("keydown", onKeyDown);
    if (!initialized) {
      target.postMessage({ type: "SeaSketchReportingInitEvent", frameId }, "*");
      setInitialized(true);
    }
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [initialized]);

  if (reportContext) {
    const Report = REPORTS[reportContext.clientName];
    return (
      <ReportContext.Provider
        value={{
          ...reportContext,
          projectUrl: service
        }}
      >
        <Report />
      </ReportContext.Provider>
    );
  } else {
    return <div />;
  }
};

ReactDOM.render(<App />, document.body);
