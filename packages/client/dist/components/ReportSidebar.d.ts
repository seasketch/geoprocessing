import React from "react";
import { Sketch } from "@seasketch/serverless-geoprocessing";
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
    tabTitles?: {
        [key: string]: string;
    };
}
export declare enum ReportSidebarSize {
    Normal = 0,
    Large = 1
}
declare const ReportSidebar: ({ size, sketch, geoprocessingProjectUri, clientOptions, clientTitle, style }: Props) => JSX.Element;
export default ReportSidebar;
