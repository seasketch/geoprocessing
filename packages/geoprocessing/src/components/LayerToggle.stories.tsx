import React from "react";
import Card from "./Card.js";
import { LayerToggle } from "./LayerToggle.js";
import ReportDecorator from "./storybook/ReportDecorator.js";
import {
  ReportContext,
  sampleSketchReportContextValue,
} from "../context/index.js";

export default {
  component: LayerToggle,
  title: "Components/LayerToggle",
  decorators: [ReportDecorator],
};

const sampleContextValue = sampleSketchReportContextValue();

const checkedContext = {
  ...sampleContextValue,
  visibleLayers: ["5e80c8a8cd44abca6e5268af"],
};

export const simpleUnchecked = () => (
  <ReportContext.Provider value={sampleContextValue}>
    <Card title="Card Title">
      <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} simple />
    </Card>
  </ReportContext.Provider>
);

export const simpleChecked = () => (
  <ReportContext.Provider value={checkedContext}>
    <Card title="Card Title">
      <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} simple />
    </Card>
  </ReportContext.Provider>
);

export const simpleSmallUnchecked = () => (
  <ReportContext.Provider value={sampleContextValue}>
    <Card title="Card Title">
      <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} simple size="small" />
    </Card>
  </ReportContext.Provider>
);

export const simpleSmallChecked = () => (
  <ReportContext.Provider value={checkedContext}>
    <Card title="Card Title">
      <LayerToggle layerId={"5e80c8a8cd44abca6e5268af"} simple size="small" />
    </Card>
  </ReportContext.Provider>
);

export const simpleUncheckedLabel = () => (
  <ReportContext.Provider value={sampleContextValue}>
    <Card title="Card Title">
      <LayerToggle
        layerId={"5e80c8a8cd44abca6e5268af"}
        label="Show Map"
        simple
      />
    </Card>
  </ReportContext.Provider>
);
export const simpleCheckedLabel = () => (
  <ReportContext.Provider value={checkedContext}>
    <Card title="Card Title">
      <LayerToggle
        layerId={"5e80c8a8cd44abca6e5268af"}
        label="Show Map"
        simple
      />
    </Card>
  </ReportContext.Provider>
);

export const unchecked = () => (
  <ReportContext.Provider value={sampleContextValue}>
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
  <ReportContext.Provider value={sampleContextValue}>
    <Card title="Card Title">
      <LayerToggle layerId={""} label="Show Map Layer" />
    </Card>
  </ReportContext.Provider>
);

export const noLayerId = () => (
  <ReportContext.Provider value={sampleContextValue}>
    <Card title="Card Title">
      <LayerToggle label="Show Map Layer" />
    </Card>
  </ReportContext.Provider>
);
