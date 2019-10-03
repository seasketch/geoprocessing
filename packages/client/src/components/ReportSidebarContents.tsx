import React, { useState, useRef, useEffect, CSSProperties } from "react";
import useGeoprocessingResults from "../hooks/useGeoprocessingResults";
import { Sketch, ReportClient, SketchProperties } from "@seasketch/serverless-geoprocessing";
import { GeoprocessingClientOptions } from "../components/ReportSidebar";
import styled, { css } from "styled-components";
import { WanderingCubes } from "styled-spinkit";

export interface Props {
  sketchProperties: SketchProperties;
  geometryUri: string;
  client: ReportClient;
  clientOptions?: GeoprocessingClientOptions;
  tabId: string;
  clientUri: string;
}

export const SeaSketchReportingMessageEventType =
  "SeaSketchReportingMessageEventType";

export interface SeaSketchReportingMessageEvent {
  reportTab: string;
  serviceResults: { [key: string]: any };
  sketchProperties: SketchProperties;
  geometryUri: string;
  type: "SeaSketchReportingMessageEventType";
}

const Sandbox = styled.iframe<{ hide: boolean }>`
  width: 100%;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  border: none;
  ${props =>
    props.hide &&
    css`
      position: absolute;
      left: -20000px;
    `}
`;

const ReportSidebarContents = ({
  sketchProperties,
  geometryUri,
  client,
  clientUri,
  clientOptions,
  tabId
}: Props) => {
  const iframeEl = useRef<HTMLIFrameElement>(null);
  const [ iframeLoaded, setIframeLoaded ] = useState(false);
  const { results, failed, loading, tasks, eta } = useGeoprocessingResults(
    sketchProperties,
    geometryUri,
    client,
    tabId,
    clientOptions
  );

  const onMessage = (e:MessageEvent) => {
    if (e.data === "INIT") {
      setIframeLoaded(true);
    }
  }

  useEffect(() => {
    window.addEventListener("message", onMessage);
    if (!loading && iframeLoaded && iframeEl.current && iframeEl.current.contentWindow) {
      const msg: SeaSketchReportingMessageEvent = {
        type: SeaSketchReportingMessageEventType,
        reportTab: tabId,
        serviceResults: results,
        sketchProperties,
        geometryUri
      };
      console.log('postMessage', msg);
      iframeEl.current.contentWindow.postMessage(msg, "*");  
    }
    return () => {
      window.removeEventListener("message", onMessage);
    }
  }, [results, iframeLoaded, loading]);

  return (
    <>
      {loading && <WanderingCubes />}
      {/* TODO: Error display */}
      {failed && <div>An error occurred</div>}
      <Sandbox
        ref={iframeEl}
        src={clientUri}
        sandbox="allow-same-origin allow-scripts"
        hide={loading || !iframeLoaded}
      />
    </>
  );
};

export default ReportSidebarContents;