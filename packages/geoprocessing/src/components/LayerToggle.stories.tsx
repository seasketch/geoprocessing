import React from "react";
import Card from "./Card";
import { LayerToggle } from "./LayerToggle";
import ReportDecorator from "./ReportDecorator";
import { ReportContext } from "../storybook";

export default {
  component: LayerToggle,
  title: "Components/LayerToggle",
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
  visibleLayers: [],
};

const checkedContext = {
  ...defaultContext,
  visibleLayers: ["5e80c8a8cd44abca6e5268af"],
};

export const simpleUnchecked = () => (
  <ReportContext.Provider value={defaultContext}>
    <Card title="Card Title">
      <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} simple />
    </Card>
  </ReportContext.Provider>
);

export const unchecked = () => (
  <ReportContext.Provider value={defaultContext}>
    <Card title="Card Title">
      <LayerToggle
        layerId={"5e80c8a8cd44abca6e5268af"}
        label="Show Map Layer"
      />
    </Card>
  </ReportContext.Provider>
);

export const checked = () => (
  <ReportContext.Provider value={checkedContext}>
    <Card title="Card Title">
      <LayerToggle
        layerId={"5e80c8a8cd44abca6e5268af"}
        label="Show Map Layer"
      />
    </Card>
  </ReportContext.Provider>
);

export const emptyStringLayerId = () => (
  <ReportContext.Provider value={defaultContext}>
    <Card title="Card Title">
      <LayerToggle layerId={""} label="Show Map Layer" />
    </Card>
  </ReportContext.Provider>
);

export const noLayerId = () => (
  <ReportContext.Provider value={defaultContext}>
    <Card title="Card Title">
      <LayerToggle label="Show Map Layer" />
    </Card>
  </ReportContext.Provider>
);
