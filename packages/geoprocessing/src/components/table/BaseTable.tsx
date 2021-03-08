//@ts-nocheck
import React from "react";
import styled from "styled-components";

import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  TableOptions,
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

export function BaseTable(props: TableOptions) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: undefined, // default filter UI
      Cell: undefined, // default editable cell
    }),
    []
  );

  const defaultState: TableState = {
    disableMultiSort: true,
    defaultColumn,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of 'rows', page just has rows for the active page
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
      ...props,
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
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "🛑 " : "👊 "}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
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
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  let cellVal = cell.value;
                  return (
                    <td {...cell.getCellProps()}>
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
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
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
        <span>
          <div style={{ paddingLeft: "0px", display: "inline" }}>
            <span style={{ paddingLeft: "8px", paddingRight: "8px" }}></span>
            <span>Go to page: </span>
          </div>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
      </div>
    </>
  );
}

export default BaseTable;
