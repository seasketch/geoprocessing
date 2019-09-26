import React, { useState, useEffect } from "react";
import { Sketch } from "@seasketch/serverless-geoprocessing/src/geometry";
import useGeoprocessingResults from "../hooks/useGeoprocessingResults";
import {
  GeoprocessingProject,
  ReportClient
} from "@seasketch/serverless-geoprocessing";
import styled, { css } from "styled-components";
import ReportSidebarContents from "./ReportSidebarContents";
import { FoldingCube, Circle, WaveLoading, WanderingCubes } from "styled-spinkit";

export interface Props {
  size?: ReportSidebarSize;
  sketch: Sketch;
  geoprocessingProjectUri: string;
  clientTitle: string;
  clientOptions?: GeoprocessingClientOptions;
  style?: React.CSSProperties;
}

export interface GeoprocessingClientOptions {
  excludeTabs: Array<string>;
  /* Replacement titles for tabs, {tabId: tabLabel} */
  tabTitles?: {
    [key: string]: string;
  };
}

export enum ReportSidebarSize {
  Normal,
  Large
}

const Container = styled.div<{ size: ReportSidebarSize }>`
  height: calc(100vh - 40px);
  ${props =>
    props.size === ReportSidebarSize.Normal
      ? css`
          width: 500px;
        `
      : css`
          width: 800px;
        `}
  border: 1px solid rgba(0,0,0,0.12);
  margin-left: auto;
  margin-right: auto;
  border-radius: 2px;
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  bottom: 0;
`;

const ContentContainer = styled.div`
  background-color: #efefef;
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  /* box-shadow: 0px 0px 0px transparent, 0px 4px 4px 0px rgba(0, 0, 0, 0.06) inset, */
    /* 0px 0px 0px transparent, 0px 0px 0px transparent; */
  flex: 1;
  overflow-y: scroll;
`;

const Header = styled.div`
  font-family: sans-serif;
  padding: 10px;
  background-color: #f5f5f5;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.13);
  flex: 0;
`;

const ReportSidebar = ({
  size,
  sketch,
  geoprocessingProjectUri,
  clientOptions,
  clientTitle,
  style
}: Props) => {
  size = size || ReportSidebarSize.Normal;
  const [project, setProject] = useState<GeoprocessingProject>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>();
  let client: ReportClient | undefined;
  if (project) {
    client = project.clients.find(c => c.title === clientTitle);
  }
  useEffect(() => {
    let didCancel = false;
    setLoading(true);
    const fetchProject = async () => {
      try {
        const response = await fetch(geoprocessingProjectUri);
        const data: GeoprocessingProject = await response.json();
        if (!didCancel) {
          // TODO: should check for compatible version here at some point?
          if (data.apiVersion) {
            setProject(data);
            setLoading(false);
            const client = data.clients.find(c => c.title === clientTitle);
            if (client) {
              setTab(client.tabs[0].id);
            } else {
              setError(
                `Could not find ReportClient with title ${clientTitle}.`
              );
            }
          } else {
            setError(
              `Problem interpretting geoprocessing project metadata. Missing apiVersion.`
            );
          }
        }
      } catch (e) {
        if (!didCancel) {
          setError(
            `Problem fetching geoprocessing project metadata. ${e.toString()}`
          );
        }
      }
    };
    fetchProject();
    return () => {
      didCancel = true;
    };
  }, [geoprocessingProjectUri]);
  return (
    <Container size={size} style={style}>
      <Header>
        <h1 style={{fontWeight: 500, fontSize: 18}}>{sketch.properties && sketch.properties.name}</h1>
      </Header>
      <ContentContainer>
        {loading && <WanderingCubes />}
        {error && <div>{error}</div>}
        {!loading && !error && client && project && tab && (
          <ReportSidebarContents
            sketch={sketch}
            client={client}
            clientUri={project.clientUri}
            clientOptions={clientOptions}
            tabId={tab}
          />
        )}
      </ContentContainer>
    </Container>
  );
};

export default ReportSidebar;