import React from "react";
import { SketchClassTable } from "./SketchClassTable.js";
import { ReportDecorator, CardDecorator } from "../storybook/index.js";
import { ReportContext } from "../../context/index.js";
import {
  simpleMetricGroup,
  simpleSketchClassAggMetrics,
  simpleSketchClassAggMetricsPerc,
} from "../../testing/fixtures/metrics.js";

export default {
  component: SketchClassTable,
  title: "Components/Table/SketchClassTable",
  decorators: [CardDecorator, ReportDecorator],
};

const simpleContext = {
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
  language: "en",
};

export const simple = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <SketchClassTable
        rows={simpleSketchClassAggMetrics}
        metricGroup={simpleMetricGroup}
      />
    </ReportContext.Provider>
  );
};

export const simplePerc = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <SketchClassTable
        rows={simpleSketchClassAggMetricsPerc}
        metricGroup={simpleMetricGroup}
        formatPerc
      />
    </ReportContext.Provider>
  );
};
