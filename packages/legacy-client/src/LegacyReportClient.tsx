import React, { useState } from "react";
import {
  ReportSidebar,
  Sketch,
  ReportContextMenuItem
} from "@seasketch/geoprocessing-client";
import { SketchProperties } from "@seasketch/serverless-geoprocessing";

interface SidebarData {
  sketchProperties: SketchProperties;
  clientTitle: string;
  geoprocessingProjectUri: string;
  contextMenuItems: Array<ReportContextMenuItem>;
  geometryUri: string;
  foreground: boolean;
  offset?: boolean;
}

const LegacyReportClient = () => {
  const [sidebarData, setSidebarData] = useState<Array<SidebarData>>([]);
  const onSidebarClose = (index: number) => {
    setSidebarData([
      ...sidebarData.slice(0, index),
      ...sidebarData.slice(index + 1)
    ]);
  };
  // @ts-ignore
  window.openReportSidebar = (
    sketch: { attributes: { [name: string]: any } },
    project: string,
    clientTitle: string,
    contextMenuItems: Array<ReportContextMenuItem>
  ) => {
    const inactive = sidebarData.map(data => {
      return {
        ...data,
        foreground: false
      };
    });
    setSidebarData([
      ...inactive,
      {
        sketchProperties: sketch.attributes as SketchProperties,
        clientTitle,
        geoprocessingProjectUri: project,
        contextMenuItems,
        geometryUri: `https://www.seasketch.org/geojson/${sketch.attributes.id}`,
        foreground: true
      }
    ]);
  };

  // @ts-ignore
  window.moveActiveReport = () => {
    const data = sidebarData.find(d => d.foreground);
    if (data) {
      const index = sidebarData.indexOf(data);
      setSidebarData([
        ...sidebarData.slice(0, index),
        {
          ...data,
          offset: !data.offset
        },
        ...sidebarData.slice(index + 1)
      ]);
    }
  };

  // @ts-ignore
  window.closeActiveReport = () => {
    const data = sidebarData.find(d => d.foreground);
    let index = 0;
    if (data) {
      index = sidebarData.indexOf(data);
    }
    if (sidebarData[0]) {
      sidebarData[0] = {
        ...sidebarData[0],
        foreground: true
      };
    }
    setSidebarData([
      ...sidebarData.slice(0, index),
      ...sidebarData.slice(index + 1)
    ]);
  };

  function handleContextMenuItemClick(
    item: ReportContextMenuItem,
    index: number
  ) {
    if (!item.preventHideOnClick) {
      onSidebarClose(index);
    }
  }

  const onMoveWindowClick = (index: number) => {
    setSidebarData([
      ...sidebarData.slice(0, index),
      {
        ...sidebarData[index],
        offset: !sidebarData[index].offset
      },
      ...sidebarData.slice(index + 1)
    ]);
  };

  const onWindowClick = (index: number) => {
    const inactive = sidebarData.map(data => {
      return {
        ...data,
        foreground: false
      };
    });
    setSidebarData([
      ...inactive.slice(0, index),
      {
        ...sidebarData[index],
        foreground: true
      },
      ...inactive.slice(index + 1)
    ]);
  };

  return (
    <div className="SidebarContainer">
      {sidebarData.map((sidebarData, index) => {
        return (
          <ReportSidebar
            key={
              sidebarData.sketchProperties.id ||
              sidebarData.sketchProperties.name
            }
            onWindowClick={() => onWindowClick(index)}
            onMoveWindowClick={() => onMoveWindowClick(index)}
            onContextMenuItemClick={item =>
              handleContextMenuItemClick(item, index)
            }
            {...sidebarData}
            onClose={() => onSidebarClose(index)}
          />
        );
      })}
    </div>
  );
};

export default LegacyReportClient;
