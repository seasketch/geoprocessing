import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Sketch, SketchProperties } from "@seasketch/serverless-geoprocessing";
import {
  GeoprocessingProject,
  ReportClient
} from "@seasketch/serverless-geoprocessing";
import styled, { css } from "styled-components";
import ReportSidebarContents from "./ReportSidebarContents";
import { FoldingCube, Circle, WaveLoading, WanderingCubes } from "styled-spinkit";
import { Close } from "styled-icons/material/Close";
import { MoveHorizontal } from "styled-icons/boxicons-regular/MoveHorizontal";
import { Cog } from "styled-icons/fa-solid/Cog";

export interface Props {
  size?: ReportSidebarSize;
  sketchProperties: SketchProperties;
  geometryUri: string;
  geoprocessingProjectUri: string;
  clientTitle: string;
  clientOptions?: GeoprocessingClientOptions;
  style?: React.CSSProperties;
  contextMenuItems?: Array<ReportContextMenuItem>;
  onClose?: () => void;
  onContextMenuItemClick?: (item: ReportContextMenuItem) => void;
  onMoveWindowClick?: () => void;
  onWindowClick?: () => void;
  offset?: boolean;
  foreground?: boolean;
}

export interface ReportContextMenuItem {
  label: string;
  onClick: () => void;
  preventHideOnClick: boolean;
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

const Container = styled.div<{ foreground?: boolean, size: ReportSidebarSize, offset?: boolean }>`
  height: calc(100vh - 60px);
  ${props =>
    props.size === ReportSidebarSize.Normal
      ? css`
          width: 500px;
        `
      : css`
          width: 800px;
        `}
  /* border: 1px solid rgba(0,0,0,0.2); */
  border-radius: 3px 0px 0px 0px;
  ${ props => props.foreground ? css`box-shadow: 0px -1px 15px #1fb2fb, 0px 0px 20px rgba(0, 0, 0, 0.6);` : css`box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 4px;`}
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  ${ props => props.offset ? css`right: 499px;` : css`right: -1px`}
  display: flex;
  flex-direction: column;
  bottom: -1px;
  ${ props => props.foreground ? css`z-index: 100001;` : css`z-index: 10000;`}
  transition: right 250ms;
`;

const ContentContainer = styled.div`
  background-color: rgb(244,247,249);
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.12);
  flex: 1;
  overflow-y: scroll;
`;

const Header = styled.div`
  font-family: sans-serif;
  padding: 10px;
  padding-left: 14px;
  background-color: #f5f5f5;
  z-index: 2;
  flex: 0;
  border-radius: 3px 3px 0px 0px;
  border-bottom: 1px solid rgba(0,0,0,0.16);
`;

const Actions = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 12px;
`

const ActionButton = styled.button`
  float: right;
  cursor: pointer;
  border: none;
  background: transparent;
  border-radius: 24px;
  padding: 4px;
  width: 25px;
  height: 25px;
  margin-left: 4px;
  font-weight: bold;
  color: #555;
  line-height: normal;
  &:focus {
    border: none;
    box-shadow: none;
    outline: none;
  }

  &:hover {
    background-color: #efefef;
    color: black;
  }
  &:active {
    background-color: #ccc;
  }
`

interface ActionMenuState {
  x: number;
  y: number;
  hidden: boolean;
}

const DropdownMenu = styled.ul<ActionMenuState>`
  width: 160px;
  z-index: 100004;
  position: absolute;
  background-color: white;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
  padding: 4px 0px;
  ${props => css`
    left: ${props.x - 160 - 14}px;
    top: ${props.y + 6}px;
    display: ${ props.hidden ? "none" : "block"};
  `}
`

const DropdownMenuItem = styled.li`
  list-style: none;
  cursor: pointer;
  padding: 5px;
  padding-left: 12px;
  padding-right: 12px;
  &:hover {
    background-color: cornflowerblue;
    color: white
  }
`;

const ReportSidebar = ({
  size,
  sketchProperties,
  geometryUri,
  geoprocessingProjectUri,
  clientOptions,
  clientTitle,
  style,
  contextMenuItems,
  onClose,
  onContextMenuItemClick,
  onMoveWindowClick,
  offset,
  onWindowClick,
  foreground
}: Props) => {
  size = size || ReportSidebarSize.Normal;
  const [project, setProject] = useState<GeoprocessingProject>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>();
  const [ actionMenuState, setActionMenuState ] = useState<ActionMenuState>({
    x: 0,
    y: 0,
    hidden: true
  });
  let client: ReportClient | undefined;
  if (project) {
    client = project.clients.find(c => c.title === clientTitle);
  }

  useEffect(() => {
    document.addEventListener('click', onBodyClick);
    return () => {
      document.removeEventListener('click', onBodyClick);
    }
  });

    // @ts-ignore
    const onBodyClick = (e) => {
      if (!actionMenuState.hidden) {
        setActionMenuState({
          ...actionMenuState,
          hidden: true
        })
      }
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
  const onActionsMenuClick = (e:React.MouseEvent) => {
    setActionMenuState({
      ...actionMenuState,
      x: e.clientX,
      y: e.clientY,
      hidden: false
    });
    e.stopPropagation()
    return;
  }
  const handleContextMenuItemClick = (item: ReportContextMenuItem) => {
    item.onClick();
    if (onContextMenuItemClick) {
      onContextMenuItemClick(item);
    }
  }
  return (
    <Container foreground={foreground} onClick={onWindowClick} offset={offset} style={style} size={size}>
      <Header>
        <h1 style={{fontWeight: 500, fontSize: 18}}>{sketchProperties.name || "Untitled Sketch"}</h1>
        <Actions>
          <ActionButton onClick={(e) => {
            e.stopPropagation();
            onClose && onClose();
          }}><Close /></ActionButton>
        <ActionButton onClick={onActionsMenuClick}><Cog /></ActionButton>
        <ActionButton onClick={(e) => {
          e.stopPropagation();
          onMoveWindowClick && onMoveWindowClick();
        }}><MoveHorizontal /></ActionButton>
        </Actions>
      </Header>
      { ReactDOM.createPortal(<DropdownMenu {...actionMenuState}>
        { (contextMenuItems || []).map((item) => <DropdownMenuItem key={item.label} onClick={(e) => {
          e.stopPropagation();
          handleContextMenuItemClick(item);
        }}>
          {item.label}
        </DropdownMenuItem>)}
      </DropdownMenu> , document.body)}
      <ContentContainer>
        {loading && <WanderingCubes />}
        {error && <div>{error}</div>}
        {!loading && !error && client && project && tab && (
          <ReportSidebarContents
            sketchProperties={sketchProperties}
            geometryUri={geometryUri}
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