import React from "react";
import Card from "../Card";
import { ClassTable } from "./ClassTable";
import ReportDecorator from "../ReportDecorator";
import { ReportContext } from "../../storybook";
import { dataClasses, classPercMetrics } from "../../testing/fixtures/metrics";

export default {
  component: ClassTable,
  title: "Components/Table/ClassTable",
  decorators: [ReportDecorator],
};

const defaultContext = {
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
  visibleLayers: ["1"],
};

export const simple = () => {
  return (
    <ReportContext.Provider value={defaultContext}>
      <Card title="Report Title">
        <ClassTable
          rows={Object.values(classPercMetrics)}
          classes={dataClasses}
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const withLayerToggle = () => {
  return (
    <ReportContext.Provider value={defaultContext}>
      <Card title="Report Title">
        <ClassTable
          rows={Object.values(classPercMetrics)}
          classes={dataClasses}
          showLayerToggle
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const withGoal = () => {
  return (
    <ReportContext.Provider value={defaultContext}>
      <Card title="Report Title">
        <ClassTable
          rows={Object.values(classPercMetrics)}
          classes={dataClasses}
          showGoal
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const withBoth = () => {
  return (
    <ReportContext.Provider value={defaultContext}>
      <Card title="Report Title">
        <ClassTable
          rows={Object.values(classPercMetrics)}
          classes={dataClasses}
          showLayerToggle
          showGoal
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const formatPerc = () => {
  return (
    <ReportContext.Provider value={defaultContext}>
      <Card title="Report Title">
        <ClassTable
          rows={Object.values(classPercMetrics)}
          classes={dataClasses}
          showGoal
          formatPerc
        />
      </Card>
    </ReportContext.Provider>
  );
};

export const overrideText = () => {
  return (
    <ReportContext.Provider value={defaultContext}>
      <Card title="Report Title">
        <ClassTable
          titleText="The Habitat"
          valueColText="The Value"
          layerColText="Toggle Map"
          goalColText="The Goal"
          rows={Object.values(classPercMetrics)}
          classes={dataClasses}
          showGoal
          formatPerc
        />
      </Card>
    </ReportContext.Provider>
  );
};
