import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext, { TestExampleOutput } from "../ReportContext";
import { GeoprocessingProject, SketchProperties } from "../types";
import { v4 as uuid } from "uuid";
import Skeleton from "./Skeleton";

export default {
  component: ResultsCard,
  title: "Components/ResultsCard",
  decorators: [ReportDecorator],
};

export const usage = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123",
      } as SketchProperties,
      projectUrl: "https://example.com/project",
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: {
            area: 704,
          },
        },
      ],
      visibleLayers: [],
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => (
        <p>
          This zone is {data.area} sq km. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ut nisi beatae, officiis perferendis quis inventore
          quisquam? Provident doloremque inventore, natus beatae quam nisi eius
          quidem deserunt, aperiam aliquid corrupti eveniet.
        </p>
      )}
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
        sketchClassId: "abc123",
      } as SketchProperties,
      projectUrl: "https://example.com/project",
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: {
            area: 704,
          },
        },
      ],
      simulateLoading: true,
      visibleLayers: [],
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => (
        <p>
          This zone is {data.area} sq km. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur
          corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur
          illo voluptatem temporibus totam et incidunt.
        </p>
      )}
    </ResultsCard>
  </ReportContext.Provider>
);

export const customSkeleton = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123",
      } as SketchProperties,
      projectUrl: "https://example.com/project",
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: {
            area: 704,
          },
        },
      ],
      simulateLoading: true,
      visibleLayers: [],
    }}
  >
    <ResultsCard
      title="Card Title"
      functionName="area"
      skeleton={<CustomSkeleton />}
    >
      {(data: any) => (
        <p>
          This zone is {data.area} sq km. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Neque illo ipsum odit rerum delectus consequuntur
          corrupti, magnam quas? Ipsam quis soluta labore. Laudantium tenetur
          illo voluptatem temporibus totam et incidunt.
        </p>
      )}
    </ResultsCard>
  </ReportContext.Provider>
);

const CustomSkeleton = () => (
  <p>
    <Skeleton style={{ width: "100%", height: "130px" }} />
    <Skeleton />
    <Skeleton />
    <Skeleton style={{ width: "50%" }} />
  </p>
);

export const errorState = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123",
      } as SketchProperties,
      projectUrl: "https://example.com/project",
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: {
            area: 704,
          },
        },
      ],
      simulateError: "Internal server error",
      visibleLayers: [],
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>
);

export const noDataState = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123",
      } as SketchProperties,
      projectUrl: "https://example.com/project",
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: null,
        },
      ],
      visibleLayers: [],
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => <p>This zone is {data.area} sq km.</p>}
    </ResultsCard>
  </ReportContext.Provider>
);

export const errorBoundary = () => (
  <ReportContext.Provider
    value={{
      geometryUri: `https://localhost/${uuid()}`,
      sketchProperties: {
        name: "My Sketch",
        updatedAt: new Date().toISOString(),
        sketchClassId: "abc123",
      } as SketchProperties,
      projectUrl: "https://example.com/project",
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: {
            area: 704,
          },
        },
      ],
      visibleLayers: [],
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => {
        throw new Error("ErrorBoundary should display here in production");
        return (
          <p>
            This zone is {data.area} sq km. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Ut nisi beatae, officiis perferendis
            quis inventore quisquam? Provident doloremque inventore, natus
            beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti
            eveniet.
          </p>
        );
      }}
    </ResultsCard>
  </ReportContext.Provider>
);
