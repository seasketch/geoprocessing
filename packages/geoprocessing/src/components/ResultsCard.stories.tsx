import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./storybook/ReportDecorator";
import { ReportContext, sampleSketchReportContextValue } from "../context";
import { SketchProperties } from "../types";
import { v4 as uuid } from "uuid";
import Skeleton from "./Skeleton";
import { LayerToggle } from "../../client-ui";
import { Collapse } from "./Collapse";
import { CloudDownload } from "@styled-icons/boxicons-solid/CloudDownload";
import fixtures from "../testing/fixtures";
import DataDownload from "./DataDownload";

export default {
  component: ResultsCard,
  title: "Components/Card/ResultsCard",
  decorators: [ReportDecorator],
};

const sampleContextValue = sampleSketchReportContextValue({
  visibleLayers: ["5e80c8a8cd44abca6e5268af"],
  exampleOutputs: [
    {
      functionName: "area",
      sketchName: "My Sketch",
      results: {
        area: 704,
      },
    },
  ],
});

export const titleOnly = () => (
  <ReportContext.Provider value={sampleContextValue}>
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

const loadedRightItems = (
  <>
    <LayerToggle
      label="Show EEZ Boundary"
      layerId="5e80c8a8cd44abca6e5268af"
      simple
    />
    <DataDownload
      filename="sample"
      data={fixtures.ranked}
      formats={["csv", "json"]}
      titleElement={<CloudDownload color="#999" size="26" />}
    />
  </>
);

export const toolbarItems = () => (
  <ReportContext.Provider value={sampleContextValue}>
    <ResultsCard title="Size" functionName="area" rightItems={loadedRightItems}>
      {(data: any) => (
        <>
          <p>
            This zone is {data.area} sq km. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Ut nisi beatae, officiis perferendis
            quis inventore quisquam? Provident doloremque inventore, natus
            beatae quam nisi eius quidem deserunt, aperiam aliquid corrupti
            eveniet.
          </p>
          <Collapse title="Learn More">
            <p>Additional elements in here</p>
          </Collapse>
          <Collapse title="Show by MPA">
            <p>Additional elements in here</p>
          </Collapse>
        </>
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
      skeleton={<DefaultSkeleton />}
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

const DefaultSkeleton = () => (
  <div>
    <Skeleton style={{ width: "100%", height: "130px" }} />
    <Skeleton />
    <Skeleton />
    <Skeleton style={{ width: "50%" }} />
  </div>
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

const ThrowComponent = () => {
  throw Error("error!");
  return <></>;
};

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
        return <ThrowComponent />;
      }}
    </ResultsCard>
  </ReportContext.Provider>
);
