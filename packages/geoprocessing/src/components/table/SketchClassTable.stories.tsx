import React from "react";
import Card from "../Card";
import { SketchClassTable } from "./SketchClassTable";
import ReportDecorator from "../ReportDecorator";
import { ReportContext } from "../../storybook";
import {
  simpleGroup,
  simpleSketchClassAggMetrics,
  simpleSketchClassAggMetricsPerc,
} from "../../testing/fixtures/metrics";

export default {
  component: SketchClassTable,
  title: "Components/Table/SketchClassTable",
  decorators: [ReportDecorator],
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
};

export const simple = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <SketchClassTable
          rows={simpleSketchClassAggMetrics}
          dataGroup={simpleGroup}
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const simplePerc = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <SketchClassTable
          rows={simpleSketchClassAggMetricsPerc}
          dataGroup={simpleGroup}
          formatPerc
        />
      </Card>
    </ReportContext.Provider>
  );
};
