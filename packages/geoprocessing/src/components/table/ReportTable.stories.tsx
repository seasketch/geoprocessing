import React from "react";
import ReportTable from "./ReportTable";
import ReportDecorator from "../ReportDecorator";
import fixtures from "../../fixtures";

export default {
  component: ReportTable,
  title: "Components|ReportTable",
  decorators: [ReportDecorator],
};

const columns: any = [
  { Header: "Name", accessor: "fullName" },
  { Header: "Area (%)", accessor: "percent" },
  { Header: "Rank", accessor: "rank", isSorted: true },
];

export const basic = () => (
  <ReportTable
    pageSize={10}
    sortOptions={[
      { id: "percent", desc: true },
      { id: "rank", desc: false },
      { id: "zoneName", desc: false },
    ]}
    columns={columns}
    data={fixtures.ranked}
  />
);

export const paging = () => (
  <ReportTable
    pageSize={2}
    sortOptions={[
      { id: "percent", desc: true },
      { id: "rank", desc: false },
      { id: "zoneName", desc: false },
    ]}
    columns={columns}
    data={fixtures.ranked}
  />
);
