import React, { useState } from 'react';

export interface SeaSketchReportingMessageEvent {
  reportTab: string;
  serviceData: {[key: string]: any}; 
}

export interface ReportTabProps {
  serviceData: {[key: string]: any};
}

if (window.opener instanceof Window) {
  window.opener.addEventListener("message", (event) => {
    const message: SeaSketchReportingMessageEvent = JSON.parse(event.data);

  }, false);
}

const App = () => {
  const [serviceData, setServiceData] = useState<{[key: string]: any} | null>(null);
  const [ReportTab, setReportTab] = useState<React.ComponentType<ReportTabProps> | null>(null);

  if (ReportTab !== null && serviceData !== null) {
    return <ReportTab serviceData={serviceData} />
  } else {
    return <div />;
  }
}