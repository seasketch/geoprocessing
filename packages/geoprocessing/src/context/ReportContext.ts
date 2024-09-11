import React from "react";
import { SketchProperties } from "../types/index.js";

/**
 * Provides necessary context to ReportClient components, particularly for
 * use by useFunction() and useSketchProperties() hooks
 */
export interface ReportContextValue {
  /** Geoprocessing project metadata with details on functions, clients, uris */
  projectUrl: string;
  /** uri where the sketch can be fetched */
  geometryUri: string;
  sketchProperties: SketchProperties;
  // only in testing
  exampleOutputs?: TestExampleOutput[];
  simulateLoading?: boolean;
  simulateError?: string;
  visibleLayers: string[];
  toggleLayerVisibility?: (layerId: string) => void;
  language: string;
  changeLanguage?: (language: string) => void;
}

export type PartialReportContextValue = Partial<{
  /** Geoprocessing project metadata with details on functions, clients, uris */
  projectUrl: string;
  /** uri where the sketch can be fetched */
  geometryUri: string;
  sketchProperties: Partial<SketchProperties>;
  // only in testing
  exampleOutputs?: TestExampleOutput[];
  simulateLoading?: boolean;
  simulateError?: string;
  visibleLayers: string[];
  toggleLayerVisibility?: (layerId: string) => void;
  language: string;
  changeLanguage?: (language: string) => void;
}>;

export interface TestExampleOutput {
  sketchName: string;
  functionName: string;
  results: any;
}

export const ReportContext = React.createContext<ReportContextValue | null>(
  null,
);

export const defaultReportContext: ReportContextValue = {
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
  visibleLayers: ["a"],
  // Default to english language
  language: "en",
};

/**
 * Creates a ReportContextValue object for a Sketch with sample values.  overrides will be merged in, replacing default values
 */
export const sampleSketchReportContextValue = (
  overrides?: PartialReportContextValue,
): ReportContextValue => {
  return {
    ...(defaultReportContext || {}),
    ...overrides,
    sketchProperties: {
      ...defaultReportContext.sketchProperties,
      ...(overrides?.sketchProperties || {}),
    },
  };
};
