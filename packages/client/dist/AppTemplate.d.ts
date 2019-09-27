import React from 'react';
import { Sketch } from '@seasketch/serverless-geoprocessing';
export interface SeaSketchReportingMessageEvent {
    reportTab: string;
    serviceData: {
        [key: string]: any;
    };
    sketch: Sketch;
}
export interface ReportTabProps {
    serviceData: {
        [key: string]: any;
    };
    sketch: Sketch;
}
export interface ReportTabState {
    ReportTab: React.ComponentType<ReportTabProps>;
    serviceData: {
        [key: string]: any;
    };
    sketch: Sketch;
}
