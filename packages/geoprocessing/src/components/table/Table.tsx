//@ts-nocheck
import React from "react";
import styled from "styled-components";

import {
  useTable,
  usePagination,
  useSortBy,
  useExpanded,
  TableOptions as ReactTableOptions,
} from "react-table";

import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "@styled-icons/boxicons-solid";

const Button = styled.button`
  display: inline;
  color: blue;
  font-size: 1em;
  margin: 0px;
  padding: 0px;
  background-color: none;
`;

export const TableStyle = styled.div`
  table {
    font-family: sans-serif;
    width: 100%;
    border-collapse: collapse;

    th {
      padding-top: 8px;
      padding: 5px;
      font-weight: bolder;
    }

    .up-arrow {
      position: relative;
    }

    .up-arrow::before {
      content: "▲";
      position: absolute;
      left: 2px;
      bottom: 3px;
      font-size: 8px;
      color: #bbb;
    }

    .down-arrow {
      position: relative;
    }

    .down-arrow::before {
      content: "▼";
      position: absolute;
      left: 2px;
      bottom: 3px;
      font-size: 8px;
      color: #bbb;
    }

    tr {
      font-size: 1em;
      text-align: left;
      width: 100%;
      padding: 2px 5px;
    }
    td {
      padding: 3px 5px;
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

const defaultPropGetter = () => ({});

type TableOptions = ReactTableOptions<{}>;

export const Table = (props: TableOptions) => {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: undefined, // default filter UI
      Cell: undefined, // default editable cell
    }),
    []
  );

  // Can be overridden
  const defaultState: TableState = {
    disableMultiSort: true,
    defaultColumn,
    initialState: {
      pageSize: 50, // Adds paging at 50 records
    },
  };

  const {
    headerProps = defaultPropGetter,
    columnProps = defaultPropGetter,
    rowProps = defaultPropGetter,
    cellProps = defaultPropGetter,
    ...otherProps
  } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of 'rows', page just has rows for the active page
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize,
      sortBy,
      groupBy,
      expanded,
      filters,
      selectedRowIds,
    },
  } = useTable(
    {
      ...defaultState,
      ...otherProps,
    },
    useSortBy,
    useExpanded,
    usePagination,
    // Plugin to add our selection column
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [...columns];
      });
    }
  );

  return (
    <TableStyle>
      <table className={props.className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  // Return an array of prop objects and react-table will merge them appropriately
                  {...column.getHeaderProps([
                    {
                      className: column.className,
                      style: column.style,
                    },
                    columnProps(column), // user passed
                    headerProps(column), // user passed
                  ])}
                >
                  <div>
                    {column.canGroupBy ? (
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "🛑 " : "👊 "}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <span className="up-arrow" />
                        ) : (
                          <span className="down-arrow" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            console.log("row", row);
            return (
              <tr {...row.getRowProps(rowProps(row))}>
                {row.cells.map((cell) => {
                  let cellVal = cell.value;
                  return (
                    <td
                      // Return an array of prop objects and react-table will merge them appropriately
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                          style: cell.column.style,
                        },
                        columnProps(cell.column),
                        cellProps(cell),
                      ])}
                    >
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>{" "}
                          {cell.render("Cell", { editable: false })} (
                          {row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cellVal
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className="pagination"
        style={
          !canNextPage && !canPreviousPage
            ? { display: "none" }
            : { display: "block" }
        }
      >
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <ChevronsLeft
            size="24"
            style={!canPreviousPage ? { color: "gray" } : { color: "blue" }}
          />
        </Button>{" "}
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <ChevronLeft
            size="24"
            style={!canPreviousPage ? { color: "gray" } : { color: "blue" }}
          />
        </Button>{" "}
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          <ChevronRight
            size="24"
            style={!canNextPage ? { color: "gray" } : { color: "blue" }}
          />
        </Button>{" "}
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <ChevronsRight
            size="24"
            style={!canNextPage ? { color: "gray" } : { color: "blue" }}
          />
        </Button>{" "}
        <span style={{ paddingLeft: "22px" }}>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </TableStyle>
  );
};

export default Table;
