import React from "react";
import Table, { TableStyle } from "./Table";
import ReportCardDecorator from "../ReportCardDecorator";
import fixtures from "../../fixtures";
import "./Table.css";

const Percent = new Intl.NumberFormat("en", {
  style: "percent",
});

export default {
  component: Table,
  title: "Components|Table",
  decorators: [ReportCardDecorator],
};

export const simple = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Count",
        accessor: "count",
      },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.humanUseData, []);
  return <Table columns={columns} data={data} />;
};

/**** Centered */

export const centered = () => {
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "fullName" },
      { Header: "Area", accessor: "value" },
      { Header: "Rank", accessor: "rank" },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.ranked, []);
  return <Table className="centered" columns={columns} data={data} />;
};

/**** Set width */
export const setWidth = () => {
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "fullName", style: { width: "70%" } },
      { Header: "Area", accessor: "value" },
      { Header: "Rank", accessor: "rank" },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.ranked, []);
  return <Table columns={columns} data={data} />;
};

/**** Formatted column ****/

export const formattedColumn = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Count",
        accessor: "count",
      },
      {
        Header: "Percent of Activity",
        accessor: (row) => Percent.format(row.perc), // resulting value used by sort function, Cell function can be better
      },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.humanUseData, [
    fixtures.humanUseData,
  ]);

  return <Table columns={columns} data={data} />;
};

/**** Paging */

export const paging = () => {
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "fullName", style: { width: "60%" } },
      { Header: "Area", accessor: "value", style: { width: "20%" } },
      { Header: "Rank", accessor: "rank" },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.ranked, []);
  return (
    <Table
      initialState={{
        pageSize: 2,
      }}
      columns={columns}
      data={data}
    />
  );
};

/**** Style override */
// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/data-driven-classes-and-styles?file=/src/App.js:3903-3909

export const configDrivenStyle = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        style: { backgroundColor: "#000", color: "#eee" },
        columns: [
          {
            Header: "Place Name",
            accessor: "name",
            style: { backgroundColor: "#efefef" },
          },
        ],
      },
      {
        Header: "Count",
        accessor: "count",
        style: { backgroundColor: "#ddd" },
      },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.humanUseData, [
    fixtures.humanUseData,
  ]);

  return <Table columns={columns} data={data} />;
};

/**** Class-driven styling */

export const classDrivenStyle = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        className: "dark",
        columns: [
          {
            Header: "Place Name",
            accessor: "name",
            className: "light",
          },
        ],
      },
      {
        Header: "Count",
        accessor: "count",
        className: "med",
      },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.humanUseData, [
    fixtures.humanUseData,
  ]);

  return <Table columns={columns} data={data} />;
};

/**** Data-driven styling */

const dataDrivenColumns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Count",
    accessor: "count",
  },
];

/**
 * Any prop can be overridden with these functions, for example onClick, onEnter
 */
export const dataDrivenProps = () => {
  const columns = React.useMemo(() => dataDrivenColumns, [dataDrivenColumns]);
  const data = React.useMemo(() => fixtures.humanUseData, [
    fixtures.humanUseData,
  ]);

  // Make name header green
  const headerFn = (col) =>
    col.id === "name" ? { style: { color: "green" } } : {};

  // Make count column italic
  const colFn = (col) =>
    col.id === "count" ? { style: { fontStyle: "italic" } } : {};

  // Apply bold to entire row where value > 1
  const rowFn = (row) =>
    row.values.count > 1 ? { style: { fontWeight: "bold" } } : {};

  // Apply background color where count column and value > 1
  const cellFn = (cell) =>
    cell.column.id === "count" && cell.value > 1
      ? { style: { backgroundColor: "#aaa" } }
      : {};

  return (
    <Table
      columns={columns}
      data={data}
      headerProps={headerFn}
      columnProps={colFn}
      rowProps={rowFn}
      cellProps={cellFn}
    />
  );
};
