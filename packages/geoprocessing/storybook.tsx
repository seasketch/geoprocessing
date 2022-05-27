import React, { ComponentType } from "react";
import { storiesOf } from "@storybook/react";
import { ReportDecorator } from "./src/components/storybook/ReportDecorator";
import { TestExampleOutput, ReportContext } from "./src/context";
import { SketchProperties } from "./src/types";
import { v4 as uuid } from "uuid";
const examples = require("./src/storybook/examples-loader.js");

// top-level component for storybook

export function registerExampleStories<T>(
  title: string,
  component: ComponentType<T>
) {
  const stories = storiesOf(title, module).addDecorator(ReportDecorator);

  // This cast avoids a typing issue with passing the generic into the ComponentType
  const Component = component as ComponentType<{}>;

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
}
