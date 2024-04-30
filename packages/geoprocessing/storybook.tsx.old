import React, { ComponentType } from "react";
import { storiesOf } from "@storybook/react";
import { TestExampleOutput } from "./src/context/index.js";
import { SketchProperties } from "./src/types/index.js";
import { v4 as uuid } from "uuid";
import { ReportStoryLayout } from "./src/components/storybook/ReportStoryLayout.js";
const examples = require("./src/storybook/examples-loader.js");

/**
 * Creates a story rendering the given component with the output for each sketch in the examples/output directory of a gp project
 * which typically contains geoprocessing function output, but it could be anything.
 * This allows the developer to see how the component renders with each output
 */
export function registerExampleStories<T>(
  /** Storybook title in section/category/storyname form, just use slashes */
  title: string,
  /** The component to render into the story */
  component: ComponentType<T>
) {
  const stories = storiesOf(title, module); //.addDecorator(ReportDecorator);

  // This cast avoids a typing issue with passing the generic into the ComponentType
  const Component = component as ComponentType<{}>;

  for (const sketch of examples.sketches) {
    stories.add(sketch.properties.name, () => (
      <ReportStoryLayout
        value={{
          geometryUri: `https://localhost/${uuid()}`,
          sketchProperties: sketch.properties,
          projectUrl: "https://example.com/project",
          exampleOutputs: examples.outputs.filter(
            (o: TestExampleOutput) => o.sketchName === sketch.properties.name
          ),
          visibleLayers: [],
          language: "en",
        }}
      >
        <Component />
      </ReportStoryLayout>
    ));
  }

  stories.add("Loading state", () => (
    <ReportStoryLayout
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
        language: "en",
      }}
    >
      <Component />
    </ReportStoryLayout>
  ));

  stories.add("Error state", () => (
    <ReportStoryLayout
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
        language: "en",
      }}
    >
      <Component />
    </ReportStoryLayout>
  ));
}
