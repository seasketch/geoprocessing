import React, { CSSProperties } from "react";
import Table, { Column, Row } from "./Table";
import FilterSelectTable, { FilterSelect } from "./FilterSelectTable";
import ReportCardDecorator from "../ReportCardDecorator";
import fixtures, {
  HumanUse,
  Ranked,
  Categorical,
  getRandomCategorical,
} from "../../fixtures";
import styled from "styled-components";

export default {
  component: Table,
  title: "Components|Table",
  decorators: [ReportCardDecorator],
};

const TableStyled = styled.div`
  .dark {
    background-color: #000;
    color: #eee;
  }
  .med {
    background-color: #ddd;
  }
  .light {
    background-color: #efefef;
  }

  .centered th:not(:first-child) {
    text-align: center;
  }

  .centered td:not(:first-child) {
    text-align: center;
  }

  .squeeze {
    font-size: 11px;
  }
`;

const Percent = new Intl.NumberFormat("en", {
  style: "percent",
});

const Number = new Intl.NumberFormat("en");

/**
 * Types don't have to be specified for table Columns or data in simple use cases
 * but it provides you with Intellisense and can help avoid unexpected behavior
 * If the columns or data change they can/should be wrapped in React.useMemo to avoid
 * extra renders or infinite call stack errors,
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

export const squeeze = () => {
  const Percent2 = new Intl.NumberFormat("en", {
    style: "percent",
    minimumFractionDigits: 2,
  });
  const columns: Column<Categorical>[] = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Count",
      Cell: (cell) => <div>Number.format(cell.value)</div>, // Not working?
      accessor: "count",
    },
    {
      Header: "High",
      accessor: (row) => Percent2.format(row.high),
    },
    {
      Header: "Med",
      accessor: (row) => Percent2.format(row.med),
    },
    {
      Header: "Low",
      accessor: (row) => Percent2.format(row.low),
    },
    {
      Header: "Comment",
      accessor: "comment",
    },
  ];
  return (
    <TableStyled>
      <Table
        className="squeeze"
        columns={columns}
        data={fixtures.randomCategorical}
      />
    </TableStyled>
  );
};

/**** Centered */

export const centered = () => {
  const columns: Column[] = [
    { Header: "Name", accessor: "fullName" },
    { Header: "Area", accessor: "value" },
    { Header: "Rank", accessor: "rank" },
  ];
  return (
    <TableStyled>
      <Table className="centered" columns={columns} data={fixtures.ranked} />
    </TableStyled>
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
    { Header: "Name", accessor: "fullName", style: { width: "60%" } }, // Fixed width prevents dynamic variation between pages
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
  return (
    <TableStyled>
      <Table columns={columns} data={fixtures.humanUse} />
    </TableStyled>
  );
};

/**** Data-driven styling */

/**
 * Any prop can be overridden with these functions, for example onClick, onEnter
 */
export const dataDrivenProps = () => {
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

  const headerFn = (header) =>
    header.id === "name" ? { style: { color: "green" } } : {};

  const colFn = (column) =>
    column.id === "count" ? { style: { fontStyle: "italic" } } : {};

  const rowFn = (row) =>
    row.values.count > 1
      ? { style: { fontWeight: "bold" } as CSSProperties }
      : {};

  const cellFn = (cell) =>
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

/**** Filtering */

export const filterCheckboxes = () => {
  const filterSelect: FilterSelect<Categorical> = {
    type: "every",
    filters: [
      {
        name: "Show only count < 500K",
        defaultValue: false,
        filterFn: (row) => row.count < 2_000_000,
      },
      {
        name: "Show only odd IDs",
        defaultValue: true,
        filterFn: (row) => parseInt(row.id) % 2 !== 0,
      },
    ],
  };

  const columns: Column<Categorical>[] = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Count",
      accessor: "count",
    },
  ];

  return (
    <FilterSelectTable
      filterSelect={filterSelect}
      columns={React.useMemo(() => columns, [])}
      data={getRandomCategorical()}
    />
  );
};

export const tableWithTitle = () => {
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
  return (
    <Table title="Table Title" columns={columns} data={fixtures.humanUse} />
  );
};

export const tableWithDownload = () => {
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
  return (
    <Table
      title="Table Title"
      downloadEnabled={true}
      downloadFilename="humanUse"
      columns={columns}
      data={fixtures.humanUse}
    />
  );
};

export const tableWithNoData = () => {
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
  return (
    <Table
      title="Table Title"
      downloadEnabled={true}
      downloadFilename="humanUse"
      columns={columns}
      data={[]}
    />
  );
};
