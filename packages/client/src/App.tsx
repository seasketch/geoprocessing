import React, { useState, useEffect } from 'react';
import { Sketch } from '@seasketch/serverless-geoprocessing';

export interface SeaSketchReportingMessageEvent {
  reportTab: string;
  serviceData: {[key: string]: any}; 
  sketch: Sketch;
}

export interface ReportTabProps {
  serviceData: {[key: string]: any};
  sketch: Sketch
}

export interface ReportTabState {
  ReportTab: React.ComponentType<ReportTabProps>;
  serviceData: {[key: string]: any}; 
  sketch: Sketch;
}

// Will be replaced by plugin with actual Report implementations
const REPORTS: {[key: string]: React.ComponentType<ReportTabProps>} = {};

const App = () => {
  const [state, setState] = useState<ReportTabState | null>(null);
  const [ initialized, setInitialized] = useState(false);
  const onMessage = (event: MessageEvent) => {
    const message: SeaSketchReportingMessageEvent = JSON.parse(event.data);
    setState({
      serviceData: message.serviceData,
      ReportTab: REPORTS[message.reportTab],
      sketch: message.sketch
    });
  }

  useEffect(() => {
    if (window.opener instanceof Window) {
      window.opener.addEventListener("message", onMessage);
      if (!initialized) {
        window.opener.postMessage("INIT", "*");
        setInitialized(true);
      }
      return () => {
        window.opener.removeEventListener("message", onMessage);
      }
    }
  });

  if (state !== null) {
    const { ReportTab } = state;
    return <ReportTab {...state} />
  } else {
    return <div>initialized</div>;
  }
}