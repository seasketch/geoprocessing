import React from "react";
import BaseTable from "./BaseTable";
import ReportDecorator from "../ReportDecorator";
import fixtures from "../../fixtures";

export default {
  component: BaseTable,
  title: "Components|BaseTable",
  decorators: [ReportDecorator],
};

const columns: any = [
  { Header: "Name", accessor: "fullName" },
  { Header: "Area (%)", accessor: "percent" },
  { Header: "Rank", accessor: "rank", isSorted: true },
];

export const basic = () => (
  <BaseTable
    initialState={{
      pageSize: 10,
      sortBy: [
        { id: "percent", desc: true },
        { id: "rank", desc: false },
        { id: "zoneName", desc: false },
      ],
    }}
    columns={columns}
    data={fixtures.ranked}
  />
);
