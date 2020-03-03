import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext from "../ReportContext";
import { v4 as uuid } from "uuid";
import Skeleton from "./Skeleton";
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
        exampleOutputs: [
            {
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }
        ]
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area" }, (data) => (React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nisi beatae, officiis perferendis quis inventore quisquam? Provident doloremque inventore, natus beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti eveniet.")))));
export const loadingState = () => (React.createElement(ReportContext.Provider, { value: {
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
            name: "My Sketch",
            updatedAt: new Date().toISOString(),
            sketchClassId: "abc123"
        },
        geoprocessingProject: {},
        exampleOutputs: [
            {
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }
        ],
        simulateLoading: true
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area" }, (data) => (React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur illo voluptatem temporibus totam et incidunt.")))));
export const customSkeleton = () => (React.createElement(ReportContext.Provider, { value: {
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
            name: "My Sketch",
            updatedAt: new Date().toISOString(),
            sketchClassId: "abc123"
        },
        geoprocessingProject: {},
        exampleOutputs: [
            {
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }
        ],
        simulateLoading: true
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area", skeleton: React.createElement(CustomSkeleton, null) }, (data) => (React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur illo voluptatem temporibus totam et incidunt.")))));
const CustomSkeleton = () => (React.createElement("p", null,
    React.createElement(Skeleton, { style: { width: "100%", height: "130px" } }),
    React.createElement(Skeleton, null),
    React.createElement(Skeleton, null),
    React.createElement(Skeleton, { style: { width: "50%" } })));
export const errorState = () => (React.createElement(ReportContext.Provider, { value: {
        geometryUri: `https://localhost/${uuid()}`,
        sketchProperties: {
            name: "My Sketch",
            updatedAt: new Date().toISOString(),
            sketchClassId: "abc123"
        },
        geoprocessingProject: {},
        exampleOutputs: [
            {
                functionName: "area",
                sketchName: "My Sketch",
                results: {
                    area: 704
                }
            }
        ],
        simulateError: "Internal server error"
    } },
    React.createElement(ResultsCard, { title: "Card Title", functionName: "area" }, (data) => React.createElement("p", null,
        "This zone is ",
        data.area,
        " sq km."))));
//# sourceMappingURL=ResultsCard.stories.js.map