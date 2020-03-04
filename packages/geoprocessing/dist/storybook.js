import React from "react";
import { storiesOf } from "@storybook/react";
import ReportDecorator from "./src/components/ReportDecorator";
import ReportContext from "./src/ReportContext";
import { v4 as uuid } from "uuid";
const examples = require("./src/examples-loader.js");
export const registerExampleStories = (title, Component) => {
    const stories = storiesOf(title, module).addDecorator(ReportDecorator);
    for (const sketch of examples.sketches) {
        const id = uuid();
        stories.add(sketch.properties.name, () => (React.createElement(ReportContext.Provider, { value: {
                geometryUri: `https://localhost/${uuid}`,
                sketchProperties: sketch.properties,
                geoprocessingProject: {},
                exampleOutputs: examples.outputs.filter((o) => o.sketchName === sketch.properties.name)
            } },
            React.createElement(Component, null))));
    }
    stories.add("Loading state", () => (React.createElement(ReportContext.Provider, { value: {
            geometryUri: `https://localhost/${uuid()}`,
            sketchProperties: {
                name: "My Sketch",
                updatedAt: new Date().toISOString(),
                sketchClassId: "abc123"
            },
            geoprocessingProject: {},
            exampleOutputs: [],
            simulateLoading: true
        } },
        React.createElement(Component, null))));
    stories.add("Error state", () => (React.createElement(ReportContext.Provider, { value: {
            geometryUri: `https://localhost/${uuid()}`,
            sketchProperties: {
                name: "My Sketch",
                updatedAt: new Date().toISOString(),
                sketchClassId: "abc123"
            },
            geoprocessingProject: {},
            exampleOutputs: [],
            simulateError: "Internal server error"
        } },
        React.createElement(Component, null))));
};
//# sourceMappingURL=storybook.js.map