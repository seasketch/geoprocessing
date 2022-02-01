import React from "react";
import Card from "../Card";
import { ClassTable } from "./ClassTable";
import ReportDecorator from "../ReportDecorator";
import { ReportContext } from "../../storybook";
import {
  simpleGroup,
  categoricalGroup,
  simpleClassMetrics,
  categoricalClassMetrics,
} from "../../testing/fixtures/metrics";

export default {
  component: ClassTable,
  title: "Components/Table/ClassTable",
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
        <ClassTable rows={simpleClassMetrics} dataGroup={simpleGroup} />
      </Card>
    </ReportContext.Provider>
  );
};

export const simpleLayerToggle = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <ClassTable
          rows={simpleClassMetrics}
          dataGroup={simpleGroup}
          showLayerToggle
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const simpleGoal = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <ClassTable
          rows={simpleClassMetrics}
          dataGroup={simpleGroup}
          showGoal
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const simpleBoth = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <ClassTable
          rows={simpleClassMetrics}
          dataGroup={simpleGroup}
          showLayerToggle
          showGoal
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const simpleFormatPerc = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <ClassTable
          rows={simpleClassMetrics}
          dataGroup={simpleGroup}
          showGoal
          formatPerc
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const simpleOverrideText = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Simple">
        <ClassTable
          titleText="The Habitat"
          valueColText="The Value"
          layerColText="Toggle Map"
          goalColText="The Goal"
          rows={simpleClassMetrics}
          dataGroup={simpleGroup}
          showGoal
          formatPerc
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const categoricalLayerToggle = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <Card title="Categorical">
        <ClassTable
          rows={categoricalClassMetrics}
          dataGroup={categoricalGroup}
          showLayerToggle
        />
      </Card>
    </ReportContext.Provider>
  );
};
