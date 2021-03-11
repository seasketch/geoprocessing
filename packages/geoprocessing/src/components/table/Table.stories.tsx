import React from "react";
import Table, { TableStyle } from "./Table";
import ReportCardDecorator from "../ReportCardDecorator";
import fixtures, { HumanUse, Ranked } from "../../fixtures";
import { Column, Row, Cell, HeaderGroup } from "react-table";
import "./Table.css";

export default {
  component: Table,
  title: "Components|Table",
  decorators: [ReportCardDecorator],
};

/**
 * Types don't have to be specified for table columns or data in simple use cases
 * but it provides you with Intellisense and can help avoid unexpected behavior
 * Both columns and data can/should be wrapped in React.useMemo to avoid extra renders,
 * In a contained report this is less important
 */

export const simple = () => {
  const columns: Column[] = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Count",
      accessor: "count",
    },
  ];
  return <Table columns={columns} data={fixtures.humanUse} />;
};

/**** Centered */

export const centered = () => {
  const columns: Column<Ranked>[] = [
    { Header: "Name", accessor: "fullName" },
    { Header: "Area", accessor: "value" },
    { Header: "Rank", accessor: "rank" },
  ];
  return (
    <Table className="centered" columns={columns} data={fixtures.ranked} />
  );
};

/**** Set width */
export const setWidth = () => {
  const columns: Column[] = [
    { Header: "Name", accessor: "fullName", style: { width: "70%" } },
    { Header: "Area", accessor: "value" },
    { Header: "Rank", accessor: "rank" },
  ];
  return <Table columns={columns} data={fixtures.ranked} />;
};

/**** Formatted column ****/

/**
 * Beware the formatted value is what's used by sort function, Cell function can be better
 */
export const formattedPercColumn = () => {
  const Percent = new Intl.NumberFormat("en", {
    style: "percent",
  });
  const columns: Column<HumanUse>[] = [
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
      accessor: (row) => Percent.format(row.perc),
    },
  ];
  return <Table columns={columns} data={fixtures.humanUse} />;
};

/**** Paging */

export const paging = () => {
  const columns: Column[] = [
    { Header: "Name", accessor: "fullName", style: { width: "60%" } },
    { Header: "Area", accessor: "value", style: { width: "20%" } },
    { Header: "Rank", accessor: "rank" },
  ];
  return (
    <Table
      initialState={{ pageSize: 2 }}
      columns={columns}
      data={fixtures.ranked}
    />
  );
};

/**** Style override */
// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/data-driven-classes-and-styles?file=/src/App.js:3903-3909

export const configDrivenStyle = () => {
  const columns: Column[] = [
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
  ];
  return <Table columns={columns} data={fixtures.humanUse} />;
};

/**** Class-driven styling */

export const classDrivenStyle = () => {
  const columns: Column[] = React.useMemo(
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
  return <Table columns={columns} data={fixtures.humanUse} />;
};

/**** Data-driven styling */

const dataDrivenColumns: Column[] = [
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
  const columns: Column[] = React.useMemo(() => dataDrivenColumns, [
    dataDrivenColumns,
  ]);

  // Make name header green
  const headerFn = (header: HeaderGroup) =>
    header.id === "name" ? { style: { color: "green" } } : {};

  // Make count column italic
  const colFn = (column: Column) =>
    column.id === "count" ? { style: { fontStyle: "italic" } } : {};

  // Apply bold to entire row where value > 1
  const rowFn = (row: Row) =>
    row.values.count > 1 ? { style: { fontWeight: "bold" } } : {};

  // Apply background color where count column and value > 1
  const cellFn = (cell: Cell) =>
    cell.column.id === "count" && cell.value > 1
      ? { style: { backgroundColor: "#aaa" } }
      : {};

  return (
    <Table
      columns={columns}
      data={fixtures.humanUse}
      headerProps={headerFn}
      columnProps={colFn}
      rowProps={rowFn}
      cellProps={cellFn}
    />
  );
};
