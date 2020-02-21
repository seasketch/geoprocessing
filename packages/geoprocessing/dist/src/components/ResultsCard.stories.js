import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext from "../ReportContext";
import { v4 as uuid } from "uuid";
export default {
    component: ResultsCard,
    title: "Components|ResultsCard",
    decorators: [ReportDecorator]
};
export const usage = () => (React.createElement(ReportContext.Provider, { value: {
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
            name: "My Sketch",
            updatedAt: new Date().toISOString(),
            sketchClassId: "abc123"
        },
        geoprocessingProject: {},
        exampleOutputs: [{
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }]
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area" }, (data) => React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km."))));
export const loadingState = () => (React.createElement(ReportContext.Provider, { value: {
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
            name: "My Sketch",
            updatedAt: new Date().toISOString(),
            sketchClassId: "abc123"
        },
        geoprocessingProject: {},
        exampleOutputs: [{
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }],
        simulateLoading: true
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area" }, (data) => React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km."))));
export const errorState = () => (React.createElement(ReportContext.Provider, { value: {
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
            name: "My Sketch",
            updatedAt: new Date().toISOString(),
            sketchClassId: "abc123"
        },
        geoprocessingProject: {},
        exampleOutputs: [{
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }],
        simulateError: "Internal server error"
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area" }, (data) => React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km."))));
//# sourceMappingURL=ResultsCard.stories.js.map