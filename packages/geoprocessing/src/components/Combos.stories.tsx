import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext, { TestExampleOutput } from "../ReportContext";
import DataDownload from "./DataDownload";
import SimpleButton from "./buttons/SimpleButton";
import Toolbar from "./Toolbar";
import { GeoprocessingProject, SketchProperties } from "../types";
import { v4 as uuid } from "uuid";
import "./Combos.stories.css";

export default {
  component: DataDownload,
  title: "Combinations|DataDownload",
  decorators: [ReportDecorator],
};

export const dataDownloadCard = () => {
  return (
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
              rows: [
                ["col1", "col2"],
                [1, 2],
                [3, 4],
              ],
            },
          },
        ],
      }}
    >
      <ResultsCard functionName="area">
        {(data: any) => {
          return (
            <>
              <Toolbar
                variant="dense"
                useGutters={false}
                toolbarCls="gp-download-toolbar"
              >
                <h2>Download Toolbar</h2>
                <div>
                  <DataDownload filename="sample" data={data.rows} />
                </div>
              </Toolbar>
              <p>The result has rows {JSON.stringify(data)}</p>
            </>
          );
        }}
      </ResultsCard>
    </ReportContext.Provider>
  );
};
