import React, { useState } from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator, {
  createReportDecorator,
} from "./storybook/ReportDecorator";
import { ReportContext, sampleSketchReportContextValue } from "../context";
import Skeleton from "./Skeleton";
import { LayerToggle } from "../../client-ui";
import { Collapse } from "./Collapse";
import fixtures from "../testing/fixtures";
import DataDownload from "./DataDownload";
import ToolbarCard from "./ToolbarCard";

const contextValue = sampleSketchReportContextValue({
  visibleLayers: [],
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

export const basic = () => (
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
);

const geographyIds = ["nearshore", "offshore"];
export const extraParams = () => {
  const [geography, setGeography] = useState("nearshore");

  const geographySwitcher = (e: any) => {
    console.log("changing geography to", e.target.value);
    setGeography(e.target.value);
  };

  return (
    <>
      <select onChange={geographySwitcher}>
        {geographyIds.map((geographyId) => {
          return (
            <option key={geographyId} value={geographyId}>
              {geographyId}
            </option>
          );
        })}
      </select>{" "}
      <ResultsCard
        title="Card Title"
        functionName="area"
        extraParams={{ geography }}
      >
        {(data: any) => (
          <>
            <p>Cur geography: {geography}</p>
            <p>
              Note that smoke tests are not setup to generate output for more
              than one extraParams value. In fact, by default the extraParams
              value is not set for a story. Storybook is also not setup to load
              more than one output. So This story demonstrates how to use a UI
              switcher to control passing different values to extraParams, but
              it won't change the output. The approach to seeing what the output
              would be for different values of extraParams is to run the smoke
              tests is to create multiple independent smoke tests, each with
              different values.
            </p>
          </>
        )}
      </ResultsCard>
    </>
  );
};

export const loadingState = () => (
  <ReportContext.Provider
    value={{
      ...contextValue,
      simulateLoading: true,
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
      ...contextValue,
      simulateLoading: true,
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
      ...contextValue,
      simulateError: "Internal server error",
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
      ...contextValue,
      exampleOutputs: [
        {
          functionName: "area",
          sketchName: "My Sketch",
          results: null,
        },
      ],
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
      ...contextValue,
    }}
  >
    <ResultsCard title="Card Title" functionName="area">
      {(data: any) => {
        return <ThrowComponent />;
      }}
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
      placement="left-end"
    />
  </>
);

export const customCard = () => (
  <ReportContext.Provider
    value={{
      ...contextValue,
    }}
  >
    <ResultsCard title="Card Title" functionName="area" useChildCard>
      {(data: any) => (
        <ToolbarCard title="Card Title" items={loadedRightItems}>
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
        </ToolbarCard>
      )}
    </ResultsCard>
  </ReportContext.Provider>
);

export const customCardToggled = () => (
  <ReportContext.Provider
    value={{
      ...contextValue,
      visibleLayers: ["5e80c8a8cd44abca6e5268af"],
    }}
  >
    <ResultsCard title="Card Title" functionName="area" useChildCard>
      {(data: any) => (
        <ToolbarCard title="Card Title" items={loadedRightItems}>
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
        </ToolbarCard>
      )}
    </ResultsCard>
  </ReportContext.Provider>
);

export default {
  component: ResultsCard,
  title: "Components/Card/ResultsCard",
  decorators: [createReportDecorator(contextValue)],
};
