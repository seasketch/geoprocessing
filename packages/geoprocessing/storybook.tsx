import React, { ComponentType } from "react";
import { storiesOf } from "@storybook/react";
import ReportDecorator from "./src/components/ReportDecorator";
import ReportContext, { TestExampleOutput } from "./src/ReportContext";
import { GeoprocessingProject } from "./src/types";
import { v4 as uuid } from "uuid";
const examples = require("./src/examples-loader.js");

export const registerExampleStories = (
  title: string,
  Component: ComponentType
) => {
  const stories = storiesOf(title, module)
    .addDecorator(ReportDecorator)

  for (const sketch of examples.sketches) {
    const id = uuid();
    stories.add(sketch.properties.name, () => <ReportContext.Provider value={{
      geometryUri: `https://localhost/${uuid}`,
      sketchProperties: sketch.properties,
      geoprocessingProject: {} as GeoprocessingProject,
      exampleOutputs: examples.outputs.filter((o:TestExampleOutput) => o.sketchName === sketch.properties.name)
    }}>
      <Component />
    </ReportContext.Provider>)
  }
};
