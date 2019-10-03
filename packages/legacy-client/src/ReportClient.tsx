import React, { useState } from "react";
import { ReportSidebar, Sketch, ReportContextMenuItem } from "@seasketch/geoprocessing-client";
import { SketchProperties } from "@seasketch/serverless-geoprocessing";

interface SidebarData {
  sketchProperties: SketchProperties;
  clientTitle: string;
  geoprocessingProjectUri: string;
  contextMenuItems: Array<ReportContextMenuItem>;
  geometryUri: string;
}

const ReportClient = () => {
  console.log('reportClient');
  const [sidebarData, setSidebarData] = useState<Array<SidebarData>>([]);
  const onSidebarClose = (index: number) => {
    setSidebarData([
      ...sidebarData.slice(0, index),
      ...sidebarData.slice(index + 1)
    ]);
  }
  // @ts-ignore
  window.openReportSidebar = (sketch: {attributes: {[name: string] : any}}, project: string, clientTitle: string, contextMenuItems: Array<ReportContextMenuItem>) => {
    console.log('openReportSidebar', sketch.attributes, project, clientTitle, contextMenuItems);
    setSidebarData([
      ...sidebarData,
      {
        sketchProperties: sketch.attributes as SketchProperties,
        clientTitle,
        geoprocessingProjectUri: project,
        contextMenuItems,
        geometryUri: `https://www.seasketch.org/geojson/${sketch.attributes.id}`
      }
    ]);
  }

  console.log('render', sidebarData, ReportSidebar);
  return (
    <div className="SidebarContainer">
      {sidebarData.map((sidebarData, index) => {
        return <ReportSidebar {...sidebarData} onClose={() => onSidebarClose(index)} />;
      })}
    </div>
  );
}

export default ReportClient;
