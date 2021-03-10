import React from "react";
import Table, { TableStyle } from "./Table";
import ReportCardDecorator from "../ReportCardDecorator";
import fixtures from "../../fixtures";
import styled from "styled-components";

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

const CenterTable = styled(TableStyle)`
  th:not(:first-child) {
    text-align: center;
  }

  td:not(:first-child) {
    text-align: center;
  }
`;

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
  return (
    <CenterTable>
      <Table columns={columns} data={data} />
    </CenterTable>
  );
};

/**** Set width */

const SetWidthTable = styled(TableStyle)`
  th:nth-child(1) {
    width: 80%;
  }
`;

export const setWidth = () => {
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "fullName" },
      { Header: "Area", accessor: "value" },
      { Header: "Rank", accessor: "rank" },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.ranked, []);
  return (
    <SetWidthTable>
      <Table columns={columns} data={data} />
    </SetWidthTable>
  );
};

/**** Formatted column ****/

const ClassStyle = styled.div`
  .red {
    color: red;
  }
`;

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
        accessor: (row) => Percent.format(row.perc), // Format value
        className: "red", // Assign class name
      },
    ],
    []
  );
  const data = React.useMemo(() => fixtures.humanUseData, [
    fixtures.humanUseData,
  ]);

  return (
    <ClassStyle>
      <Table columns={columns} data={data} />
    </ClassStyle>
  );
};

/**** Paging */

export const paging = () => {
  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "fullName" },
      { Header: "Area", accessor: "value" },
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
 * @returns
 */
export const dataDrivenProps = () => {
  const columns = React.useMemo(() => dataDrivenColumns, [dataDrivenColumns]);
  const data = React.useMemo(() => fixtures.humanUseData, [
    fixtures.humanUseData,
  ]);

  // Make name header green
  const headerFn = (col: any) =>
    col.id === "name" ? { style: { color: "green" } } : {};

  // Make count column italic
  const colFn = (col: any) =>
    col.id === "count" ? { style: { fontStyle: "italic" } } : {};

  // Apply bold to entire row where value > 1
  const rowFn = (row: any) =>
    row.values.count > 1 ? { style: { fontWeight: "bold" } } : {};

  // Apply background color where count column and value > 1
  const cellFn = (cell: any) =>
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
