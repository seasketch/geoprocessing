/// <reference types="react" />
import { ReportClient, SketchProperties } from "@seasketch/serverless-geoprocessing";
import { GeoprocessingClientOptions } from "../components/ReportSidebar";
export interface Props {
    sketchProperties: SketchProperties;
    geometryUri: string;
    client: ReportClient;
    clientOptions?: GeoprocessingClientOptions;
    tabId: string;
    clientUri: string;
}
export declare const SeaSketchReportingMessageEventType = "SeaSketchReportingMessageEventType";
export interface SeaSketchReportingMessageEvent {
    reportTab: string;
    serviceResults: {
        [key: string]: any;
    };
    sketchProperties: SketchProperties;
    geometryUri: string;
    type: "SeaSketchReportingMessageEventType";
}
declare const ReportSidebarContents: ({ sketchProperties, geometryUri, client, clientUri, clientOptions, tabId }: Props) => JSX.Element;
export default ReportSidebarContents;
