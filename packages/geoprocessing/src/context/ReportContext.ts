import React from "react";
import { SketchProperties, GeoprocessingProject } from "../types";

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
  visibleLayers: string[];
  toggleLayerVisibility?: (layerId: string) => void;
}

export interface TestExampleOutput {
  sketchName: string;
  functionName: string;
  results: any;
}

export const ReportContext =
  React.createContext<ReportContextValue | null>(null);

export const defaultReportContextValue: ReportContextValue = {
  sketchProperties: {
    name: "My Sketch",
    id: "abc123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sketchClassId: "efg345",
    isCollection: false,
    userAttributes: [
      {
        exportId: "DESIGNATION",
        fieldType: "ChoiceField",
        label: "Designation",
        value: "Marine Reserve",
      },
      {
        exportId: "COMMENTS",
        fieldType: "TextArea",
        label: "Comments",
        value: "This is my MPA and it is going to be the greatest. Amazing.",
      },
    ],
  },
  geometryUri: "",
  projectUrl: "https://example.com/project",
  visibleLayers: [],
};

/**
 * Creates a ReportContextValue object for a Sketch with sample values.  overrides will be merged in, replacing default values
 */
export const sampleSketchReportContextValue = (
  overrides?: Partial<ReportContextValue>
): ReportContextValue => {
  return {
    ...(defaultReportContextValue || {}),
    ...overrides,
  };
};
