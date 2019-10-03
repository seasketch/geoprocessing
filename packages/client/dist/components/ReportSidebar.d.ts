import React from "react";
import { SketchProperties } from "@seasketch/serverless-geoprocessing";
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
}
export interface ReportContextMenuItem {
    label: string;
    onClick: () => void;
}
export interface GeoprocessingClientOptions {
    excludeTabs: Array<string>;
    tabTitles?: {
        [key: string]: string;
    };
}
export declare enum ReportSidebarSize {
    Normal = 0,
    Large = 1
}
declare const ReportSidebar: ({ size, sketchProperties, geometryUri, geoprocessingProjectUri, clientOptions, clientTitle, style, contextMenuItems, onClose }: Props) => JSX.Element;
export default ReportSidebar;
