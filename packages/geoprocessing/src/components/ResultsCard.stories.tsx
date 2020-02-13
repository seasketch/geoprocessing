import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext, { TestExampleOutput } from "../ReportContext";
import { GeoprocessingProject } from "../types";
import { v4 as uuid } from "uuid";

export default {
  component: ResultsCard,
  title: "Components|ResultsCard",
  decorators: [ReportDecorator]
};

export const usage = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123"
      },
      geoprocessingProject: {} as GeoprocessingProject,
      exampleOutputs: [{
        functionName: "area",
        sketchName: "My Sketch",
        results: {
          area: 704
        }
      }]
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>
);

export const loadingState = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123"
      },
      geoprocessingProject: {} as GeoprocessingProject,
      exampleOutputs: [{
        functionName: "area",
        sketchName: "My Sketch",
        results: {
          area: 704
        }
      }],
      simulateLoading: true
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>
);

export const errorState = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123"
      },
      geoprocessingProject: {} as GeoprocessingProject,
      exampleOutputs: [{
        functionName: "area",
        sketchName: "My Sketch",
        results: {
          area: 704
        }
      }],
      simulateError: "Internal server error"
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>
);