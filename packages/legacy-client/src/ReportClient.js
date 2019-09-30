var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useState } from "react";
import { ReportSidebar } from "@seasketch/geoprocessing-client";
function ReportClient(_a) {
    var _b = useState([]), sidebarData = _b[0], setSidebarData = _b[1];
    var onSidebarClose = function (index) {
        setSidebarData(__spreadArrays(sidebarData.slice(0, index), sidebarData.slice(index + 1)));
    };
    // @ts-ignore
    window.openReportSidebar = function (sketch, project, clientTitle, contextMenuItems) {
        setSidebarData(__spreadArrays(sidebarData, [
            {
                sketch: sketch,
                clientTitle: clientTitle,
                project: project,
                contextMenuItems: contextMenuItems
            }
        ]));
    };
    return (React.createElement("div", { className: "SidebarContainer" }, sidebarData.map(function (sidebarData, index) {
        return React.createElement(ReportSidebar, { sketch: sidebarData.sketch, clientTitle: sidebarData.clientTitle, geoprocessingProjectUri: sidebarData.project, onClose: function () { return onSidebarClose(index); } });
    })));
}
export default ReportClient;
