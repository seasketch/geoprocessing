import {
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  TableCommonProps,
  TableOptions,
} from "react-table";

declare module "react-table" {
  /**
   * Types for Table component.  As the library is plugin-based, so are the community types
   * This module combines the @types/react-table base and plugin types and re-exports them with the same name
   * This is possible through "interface merging", as long as the type signature stays the same
   * The Table component that imports 'react-table' will find and use this extended module automatically
   * Custom properties we support on our Table component are also included.
   * Adjust this module as feature needs change or if react-library has breaking changes!
   * Unused plugings are commented out
   */

  export interface TableOptions<
    D extends object = {}
  > extends UseExpandedOptions<D>,
      // UseFiltersOptions<D>,
      // UseGlobalFiltersOptions<D>,
      // UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      // UseResizeColumnsOptions<D>,
      // UseRowSelectOptions<D>,
      // UseRowStateOptions<D>,
      UseSortByOptions<D> {
    // Use this if you want to allow any prop to passed to the Table component, but specific is good
    // Record<string, any>
    /** Optional method to pass style.  Added to table element */
    className?: string;
    data: D[];
    /** Function called for each table header allowing style/className/role props to be overridden */
    headerProps?: (header: HeaderGroup<D>) => TableCommonProps;
    /** Function called for each table column allowing style/className/role props to be overridden */
    columnProps?: (column: Column<D>) => TableCommonProps;
    /** Function called for each table row allowing style/className/role props to be overridden */
    rowProps?: (row: Row<D>) => TableCommonProps;
    /** Function called for each table cell allowing style/className/role props to be overridden */
    cellProps?: (cell: Cell<D>) => TableCommonProps;
  }

  export interface Hooks<D extends object = {}>
    extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends object = {}>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<D extends object = {}>
    extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D>,
      TableCommonProps {} // added style, className, role props

  export interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D>,
      TableCommonProps {} // added style, className, role props

  export interface Cell<D extends object = {}, V = any>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {}
}

/**
 * Adapted from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-table/react-table-tests.tsx
 * For more inspiration see https://codesandbox.io/s/github/ggascoigne/react-table-example?file=/src/Table/Table.tsx:0-62
 * See react-table-config.d.ts for full merged types
 * @types/react-table README has more info on this approach
 */

import React, { ReactElement } from "react";
import { useTable, usePagination, useSortBy, useExpanded } from "react-table";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "@styled-icons/boxicons-solid";

const Button = styled.button`
  display: inline;
  color: #777;
  font-size: 1em;
  margin: 0px;
  padding: 0px;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 0.2rem;

  &:disabled {
    color: #ccc;
  }
`;

export { Column } from "react-table"; // Re-export for user convenience

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
    font-family: sans-serif;
    padding: 0.5rem;
    color: #999;
  }
`;

const defaultPropGetter = () => ({});

export function Table<D extends object>(props: TableOptions<D>): ReactElement {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: undefined, // default filter UI
      Cell: undefined, // default editable cell
    }),
    []
  );

  // Can be overridden
  const defaultState: Partial<TableOptions<D>> = {
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
  } = useTable<D>(
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
              <tr {...row.getRowProps(rowProps(row) || {})}>
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
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <ChevronLeft size={24} />
        </Button>{" "}
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          <ChevronRight size={24} />
        </Button>{" "}
        <span style={{ paddingLeft: "5px" }}>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
      </div>
    </TableStyle>
  );
}

export default Table;
