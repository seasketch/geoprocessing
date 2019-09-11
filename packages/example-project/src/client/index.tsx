import React, { useState, useEffect } from 'react';
import { Sketch } from '@seasketch/serverless-geoprocessing';

const SeaSketchReportingMessageEventType = "SeaSketchReportingMessageEventType";
export interface SeaSketchReportingMessageEvent {
  reportTab: string;
  serviceResults: {[key: string]: any}; 
  sketch: Sketch;
  type: "SeaSketchReportingMessageEventType";
}

export interface ReportTabProps {
  serviceResults: {[key: string]: any};
  sketch: Sketch
}

export interface ReportTabState {
  ReportTab: React.ComponentType<ReportTabProps>;
  serviceResults: {[key: string]: any}; 
  sketch: Sketch;
}

// Will be replaced by plugin with actual Report implementations
const REPORTS: {[key: string]: React.ComponentType<ReportTabProps>} = {
  'Area': require('./area/AreaTab').default
};

const App = () => {
  const [state, setState] = useState<ReportTabState | null>(null);
  const [ initialized, setInitialized] = useState(false);
  const onMessage = (event: MessageEvent) => {
    try {
      const message: SeaSketchReportingMessageEvent = JSON.parse(event.data);
      if (message.type && message.type === SeaSketchReportingMessageEventType) {
        setState({
          serviceResults: message.serviceResults,
          ReportTab: REPORTS[message.reportTab],
          sketch: message.sketch
        });
      }
    } catch (e) {
      // do nothing. could be a message from devtools or somewhere else
    }
  }

  useEffect(() => {
    if (window.opener instanceof Window) {
      window.opener.addEventListener("message", onMessage);
      if (!initialized) {
        window.opener.postMessage("INIT", "*");
        setInitialized(true);
      }
      return () => window.removeEventListener("message", onMessage);
    } else {
      window.addEventListener("message", onMessage);
      return () => window.removeEventListener("message", onMessage);
    }
  }, [initialized]);

  if (state !== null) {
    const { ReportTab } = state;
    return <ReportTab {...state} />
  } else {
    return <div>initialized</div>;
  }
}

export default App;