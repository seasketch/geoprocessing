/// <reference types="react" />
import { Sketch, ReportClient } from "@seasketch/serverless-geoprocessing";
import { GeoprocessingClientOptions } from "../components/ReportSidebar";
export interface Props {
    sketch: Sketch;
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
    sketch: Sketch;
    type: "SeaSketchReportingMessageEventType";
}
declare const ReportSidebarContents: ({ sketch, client, clientUri, clientOptions, tabId }: Props) => JSX.Element;
export default ReportSidebarContents;
