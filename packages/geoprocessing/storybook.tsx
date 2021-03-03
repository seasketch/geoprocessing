import React, { ComponentType } from "react";
import { storiesOf } from "@storybook/react";
import ReportDecorator from "./src/components/ReportDecorator";
import ReportContext, { TestExampleOutput } from "./src/ReportContext";
import { GeoprocessingProject, SketchProperties } from "./src/types";
import { v4 as uuid } from "uuid";
const examples = require("./src/examples-loader.js");

export const registerExampleStories = (
  title: string,
  Component: ComponentType
) => {
  const stories = storiesOf(title, module).addDecorator(ReportDecorator);

  for (const sketch of examples.sketches) {
    const id = uuid();
    stories.add(sketch.properties.name, () => (
      <ReportContext.Provider
        value={{
          geometryUri: `https://localhost/${uuid}`,
          sketchProperties: sketch.properties,
          projectUrl: "https://example.com/project",
          exampleOutputs: examples.outputs.filter(
            (o: TestExampleOutput) => o.sketchName === sketch.properties.name
          ),
          visibleLayers: [],
        }}
      >
        <Component />
      </ReportContext.Provider>
    ));
  }

  stories.add("Loading state", () => (
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
          name: "My Sketch",
          updatedAt: new Date().toISOString(),
          sketchClassId: "abc123",
        } as SketchProperties,
        projectUrl: "https://example.com/project",
        exampleOutputs: [],
        simulateLoading: true,
        visibleLayers: [],
      }}
    >
      <Component />
    </ReportContext.Provider>
  ));

  stories.add("Error state", () => (
    <ReportContext.Provider
      value={{
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
          name: "My Sketch",
          updatedAt: new Date().toISOString(),
          sketchClassId: "abc123",
        } as SketchProperties,
        projectUrl: "https://example.com/project",
        exampleOutputs: [],
        simulateError: "Internal server error",
        visibleLayers: [],
      }}
    >
      <Component />
    </ReportContext.Provider>
  ));
};
