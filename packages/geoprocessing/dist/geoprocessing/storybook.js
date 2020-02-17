import React from "react";
import { storiesOf } from "@storybook/react";
import ReportDecorator from "./src/components/ReportDecorator";
import ReportContext from "./src/ReportContext";
export const registerExampleStories = (title, Component) => {
    storiesOf(title, module)
        .addDecorator(ReportDecorator)
        .add("Campus Point", () => React.createElement(ReportContext.Provider, { value: {
            geometryUri: "https://localhost/123abc",
            sketchProperties: {
                id: "123abc",
                updatedAt: new Date().toISOString(),
                name: "My Test",
                sketchClassId: "123zxv"
            },
            geoprocessingProject: {},
            exampleOutputs: [{
                    sketchName: "My Test",
                    functionName: "area",
                    results: {
                        area: 12345678
                    }
                }]
        } },
        React.createElement(Component, null)));
};
//# sourceMappingURL=storybook.js.map