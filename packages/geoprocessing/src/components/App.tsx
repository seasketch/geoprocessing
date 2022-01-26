import React, { useState, useEffect } from "react";
import {
  SeaSketchReportingMessageEvent,
  SeaSketchReportingMessageEventType,
  SketchProperties,
  SeaSketchReportingVisibleLayersChangeEvent,
  SeaSketchReportingToggleLayerVisibilityEvent,
} from "../types";
import { ReportContext } from "../storybook";
import ReactDOM from "react-dom";

const REPORTS = require("./client-loader");
const searchParams = new URLSearchParams(window.location.search);
const service = searchParams.get("service");
const frameId = searchParams.get("frameId") || window.name;
if (!service) {
  throw new Error("App must be loaded with `service` query string parameter");
}

interface ReportContextState {
  clientName: string;
  sketchProperties: SketchProperties;
  geometryUri: string;
  /* List of ids for layers which are visible in the table of contents */
  visibleLayers: string[];
  toggleLayerVisibility: (layerId: string) => void;
}

const App = () => {
  const [reportContext, setReportContext] = useState<ReportContextState | null>(
    null
  );
  const [initialized, setInitialized] = useState(false);
  const onMessage = (event: MessageEvent) => {
    try {
      if (
        event.data &&
        event.data.type === SeaSketchReportingMessageEventType
      ) {
        const message: SeaSketchReportingMessageEvent = event.data;
        setReportContext({
          sketchProperties: message.sketchProperties,
          geometryUri: message.geometryUri,
          clientName: message.client,
          visibleLayers: message.visibleLayers || [],
          toggleLayerVisibility: (layerId: string) => {
            setReportContext((prev) => {
              if (prev) {
                const wasToggled = prev.visibleLayers.indexOf(layerId) !== -1;
                let target: Window = window;
                if (window.parent) {
                  target = window.parent;
                }
                target.postMessage(
                  {
                    type: "SeaSketchReportingToggleLayerVisibilityEvent",
                    layerId,
                    on: !wasToggled,
                  } as SeaSketchReportingToggleLayerVisibilityEvent,
                  "*"
                );
                return {
                  ...prev,
                  visibleLayers: wasToggled
                    ? prev.visibleLayers.filter((id) => id !== layerId)
                    : [...prev.visibleLayers, layerId],
                };
              } else {
                return null;
              }
            });
          },
        });
      } else if (
        event.data &&
        event.data.type === SeaSketchReportingVisibleLayersChangeEvent
      ) {
        const message: SeaSketchReportingVisibleLayersChangeEvent = event.data;
        // Don't update context unless report is already initialized with SeaSketchReportingMessageEvent
        if (reportContext) {
          setReportContext((prev) => {
            if (prev) {
              return { ...prev, visibleLayers: message.visibleLayers };
            } else {
              return null;
            }
          });
        }
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
          projectUrl: service,
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
