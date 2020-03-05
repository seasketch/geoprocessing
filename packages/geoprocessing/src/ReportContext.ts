import React from "react";
import { SketchProperties, GeoprocessingProject } from "./types";

/**
 * Provides necessary context to ReportClient components, particularly for
 * use by useFunction() and useSketchProperties() hooks
 */
export interface ReportContextValue {
  /** Geoprocessing project metadata with details on functions, clients, uris */
  projectUrl: string;
  /** uri where a geobuf representation of the sketch can be fetched */
  geometryUri: string;
  sketchProperties: SketchProperties;
  // only in testing
  exampleOutputs?: TestExampleOutput[];
  simulateLoading?: boolean;
  simulateError?: string;
}

export interface TestExampleOutput {
  sketchName: string;
  functionName: string;
  results: any;
}

const ReportContext = React.createContext<ReportContextValue | null>(null);

export default ReportContext;
