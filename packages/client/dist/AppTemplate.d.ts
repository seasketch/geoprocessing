import React from 'react';
import { SketchProperties } from '@seasketch/serverless-geoprocessing';
export interface ReportTabProps {
    serviceResults: {
        [key: string]: any;
    };
    sketchProperties: SketchProperties;
    geometryUri: string;
}
export interface ReportTabState {
    ReportTab: React.ComponentType<ReportTabProps>;
    serviceResults: {
        [key: string]: any;
    };
    sketchProperties: SketchProperties;
    geometryUri: string;
}
