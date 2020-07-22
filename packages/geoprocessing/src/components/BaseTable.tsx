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
} from "react-table";
/*
import {
  ArrowToLeft,
  LeftArrowAlt,
  ArrowToRight,
  RightArrowAlt,
} from "@styled-icons/boxicons-solid";
*/
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "@styled-icons/boxicons-solid";
import matchSorter from "match-sorter";

const Button = styled.button`
  display: inline;
  color: blue;
  font-size: 1em;
  margin: 0px;
  padding: 0px;
  background-color: none;
`;

// Be sure to pass our updateMyData and the skipReset option
export function BaseTable({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: undefined,
      // And also our default editable cell
      Cell: undefined,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
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
      columns,
      data,
      defaultColumn,
      //@ts-ignore
      disableMultiSort: true,
    },
    useSortBy,
    useExpanded,
    usePagination,
    // Here we will use a plugin to add our selection column
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [...columns];
      });
    }
  );
  // Render the UI for your table
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

/*
  //to allow the user to select the number of entries per page
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
  add this back in if you want to see current state
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              sortBy,
              groupBy,
              expanded: expanded,
              filters,
              selectedRowIds: selectedRowIds,
            },
            null,
            2
          )}
        </code>
      </pre>
*/
