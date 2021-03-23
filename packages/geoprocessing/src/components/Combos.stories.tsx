import React from "react";
import ResultsCard from "./ResultsCard";
import ReportDecorator from "./ReportDecorator";
import ReportContext from "../ReportContext";
import DataDownload from "./DataDownload";
import Toolbar from "./Toolbar";
import Table, { Column } from "./table/Table";
import { SketchProperties } from "../types";
import { v4 as uuid } from "uuid";
import fixtures, { Ranked } from "../fixtures";
import "./Combos.stories.css";

export default {
  component: DataDownload,
  title: "Combinations|DataDownloadCard",
  decorators: [ReportDecorator],
};

const columns: Column<Ranked>[] = [
  { Header: "Name", accessor: "fullName" },
  { Header: "Area", accessor: "value" },
  { Header: "Rank", accessor: "rank" },
];

interface ResultData {
  ranked: Ranked[];
}

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
              ranked: fixtures.ranked,
            },
          },
        ],
      }}
    >
      <ResultsCard functionName="area">
        {(data: ResultData) => {
          return (
            <>
              <Toolbar
                variant="dense"
                useGutters={false}
                toolbarCls="gp-download-toolbar"
              >
                <h2>Download Toolbar</h2>
                <div>
                  <DataDownload filename="ranked" data={data.ranked} />
                </div>
              </Toolbar>
              <Table
                className="centered"
                columns={columns}
                data={fixtures.ranked}
              />
            </>
          );
        }}
      </ResultsCard>
    </ReportContext.Provider>
  );
};
