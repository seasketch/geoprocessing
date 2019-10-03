// Auto-generated file. DO NOT EDIT!
import React, { useState, useEffect } from "react";
import config from "./client.json";
import { SketchProperties } from "@seasketch/serverless-geoprocessing";
import { SeaSketchReportingMessageEvent, SeaSketchReportingMessageEventType } from "@seasketch/geoprocessing-client";

interface ClientConfigDocument {
  [key: string]: ClientConfig;
}

interface ClientConfig {
  description: string;
  tabs: { [key: string]: ClientTabConfig };
}

interface ClientTabConfig {
  label: string;
  handler: string;
  requiredServices: Array<string>;
}

let clientConfig: ClientConfigDocument = config;

export interface ReportTabProps {
  serviceResults: { [key: string]: any };
  sketchProperties: SketchProperties;
}

export interface ReportTabState {
  ReportTab: React.ComponentType<ReportTabProps>;
  serviceResults: { [key: string]: any };
  sketchProperties: SketchProperties;
}

const REPORTS: { [key: string]: React.ComponentType<ReportTabProps> } = {};

for (const clientName of Object.keys(clientConfig as ClientConfigDocument)) {
  const client = clientConfig[clientName];
  for (const tabName in client.tabs) {
    REPORTS[tabName] = require("./" +
      client.tabs[tabName].handler
        .split("/")
        .slice(1)
        .join("/")).default;
  }
}

const App = () => {
  const [state, setState] = useState<ReportTabState | null>(null);
  const [initialized, setInitialized] = useState(false);
  const onMessage = (event: MessageEvent) => {
    try {
      const message: SeaSketchReportingMessageEvent = event.data;
      if (message.type && message.type === SeaSketchReportingMessageEventType) {
        if (!(message.reportTab in REPORTS)) {
          const msg = `Unknown report tab "${
            message.reportTab
          }". Options are ${Object.keys(REPORTS)
            .map(v => `"${v}"`)
            .join(", ")}.`;
          console.error(msg);
          throw new Error(msg);
        } else {
          setState({
            serviceResults: message.serviceResults,
            ReportTab: REPORTS[message.reportTab],
            sketchProperties: message.sketchProperties
          });
        }
      } else {
        // do nothing. could be a message from devtools or somewhere else
      }
    } catch (e) {
      // do nothing. could be a message from devtools or somewhere else
    }
  };

  useEffect(() => {
    if (!initialized) {
      window.parent.postMessage("INIT", "*");
      setInitialized(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [initialized]);

  if (state !== null) {
    const { ReportTab } = state;
    return <ReportTab {...state} />;
  } else {
    return <div>🌊🔬🐟</div>;
  }
};

export default App;
