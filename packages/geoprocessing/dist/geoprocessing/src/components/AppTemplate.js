"use strict";
// import React, { useState, useEffect } from 'react';
// import { Sketch, SketchProperties } from '@seasketch/serverless-geoprocessing';
// import { SeaSketchReportingMessageEvent } from './components/ReportSidebarContents';
// export interface ReportTabProps {
//   serviceResults: {[key: string]: any};
//   sketchProperties: SketchProperties,  
//   geometryUri: string;
// }
// export interface ReportTabState {
//   ReportTab: React.ComponentType<ReportTabProps>;
//   serviceResults: {[key: string]: any}; 
//   sketchProperties: SketchProperties;
//   geometryUri: string;
// }
// // Will be replaced by plugin with actual Report implementations
// const REPORTS: {[key: string]: React.ComponentType<ReportTabProps>} = {};
// const App = () => {
//   const [state, setState] = useState<ReportTabState | null>(null);
//   const [ initialized, setInitialized] = useState(false);
//   const onMessage = (event: MessageEvent) => {
//     const message: SeaSketchReportingMessageEvent = JSON.parse(event.data);
//     setState({
//       serviceResults: message.serviceResults,
//       ReportTab: REPORTS[message.reportTab],
//       sketchProperties: message.sketchProperties,
//       geometryUri: message.geometryUri
//     });
//   }
//   useEffect(() => {
//     if (window.opener instanceof Window) {
//       window.opener.addEventListener("message", onMessage);
//       if (!initialized) {
//         window.opener.postMessage("INIT", "*");
//         setInitialized(true);
//       }
//       return () => {
//         window.opener.removeEventListener("message", onMessage);
//       }
//     }
//   });
//   if (state !== null) {
//     const { ReportTab } = state;
//     return <ReportTab {...state} />
//   } else {
//     return <div>initialized</div>;
//   }
// }
//# sourceMappingURL=AppTemplate.js.map