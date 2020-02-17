import React from "react";
import { SketchProperties, GeoprocessingProject } from "./types";
/**
 * Provides necessary context to ReportClient components, particularly for
 * use by useFunction() and useSketchProperties() hooks
 */
interface ReportContextValue {
    /** Geoprocessing project metadata with details on functions, clients, uris */
    geoprocessingProject: GeoprocessingProject;
    /** uri where a geobuf representation of the sketch can be fetched */
    geometryUri: string;
    sketchProperties: SketchProperties;
    exampleOutputs?: TestExampleOutput[];
}
interface TestExampleOutput {
    sketchName: string;
    functionName: string;
    results: any;
}
declare const ReportContext: React.Context<ReportContextValue | null>;
export default ReportContext;
