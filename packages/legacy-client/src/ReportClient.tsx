import React, { useState } from "react";
import { ReportSidebar, Sketch, ReportContextMenuItem } from "@seasketch/geoprocessing-client";

interface SidebarData {
  sketch: Sketch;
  clientTitle: string;
  project: string;
  contextMenuItems: Array<ReportContextMenuItem>
}

function ReportClient({}) {
  const [sidebarData, setSidebarData] = useState<Array<SidebarData>>([]);
  const onSidebarClose = (index: number) => {
    setSidebarData([
      ...sidebarData.slice(0, index),
      ...sidebarData.slice(index + 1)
    ]);
  }
  // @ts-ignore
  window.openReportSidebar = (sketch: Sketch, project: string, clientTitle: string, contextMenuItems: Array<ReportContextMenuItem>) => {
    setSidebarData([
      ...sidebarData,
      {
        sketch,
        clientTitle,
        project,
        contextMenuItems
      }
    ]);
  }

  return (
    <div className="SidebarContainer">
      {sidebarData.map((sidebarData, index) => {
        return <ReportSidebar sketch={sidebarData.sketch} clientTitle={sidebarData.clientTitle} geoprocessingProjectUri={sidebarData.project} onClose={() => onSidebarClose(index)} />;
      })}
    </div>
  );
}

export default ReportClient;
