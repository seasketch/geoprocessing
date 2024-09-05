import React, { ReactElement, useMemo, ReactNode } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { styled } from "styled-components";
import { ChevronLeft } from "@styled-icons/bootstrap/ChevronLeft/ChevronLeft.esm.js";
import { ChevronRight } from "@styled-icons/bootstrap/ChevronRight/ChevronRight.esm.js";
import DataDownload, { DataDownloadProps } from "../DataDownload.js";
import Toolbar from "../Toolbar.js";

import { TableOptions } from "react-table";

/**
 * Adapted from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-table/react-table-tests.tsx
 * For more inspiration see https://codesandbox.io/s/github/ggascoigne/react-table-example?file=/src/Table/Table.tsx:0-62
 * See react-table-config.d.ts for full merged types
 * @types/react-table README has more info on this approach
 */

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

  export interface TableOptions<D extends object = {}>
    extends UseExpandedOptions<D>,
      // UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      // UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      // UseResizeColumnsOptions<D>,
      // UseRowSelectOptions<D>,
      // UseRowStateOptions<D>,
      UseSortByOptions<D> {
    // Uncomment this if you want to allow any prop to passed to the Table component, but specific is good
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
    /** Toolbar title */
    title?: string | ReactNode;
    /** Enable toolbar with download option */
    downloadEnabled?: boolean;
    downloadFilename?: DataDownloadProps["filename"];
    downloadFormats?: DataDownloadProps["formats"];
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

export { Column, Row, TableOptions } from "react-table"; // Re-export for user convenience

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

export const TableStyled = styled.div`
  margin: 10px 0px 20px 0px;

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

  .gp-table-toolbar {
    margin-top: -10px;
  }

  .gp-table-toolbar h2 {
    flex-grow: 1;
  }
`;

const defaultPropGetter = () => ({});

/**
 * Table component suited to geoprocessing client reports.
 * Builds on the `react-table` useTable hook and re-exports its interface,
 * so reference those API docs to suit your needs.
 * @param props
 * @returns
 */
export function Table<D extends object>(props: TableOptions<D>): ReactElement {
  const defaultColumn = useMemo(
    () => ({
      Filter: undefined, // default filter UI
      Cell: undefined, // default editable cell
    }),
    [],
  );

  const {
    headerProps = defaultPropGetter,
    columnProps = defaultPropGetter,
    rowProps = defaultPropGetter,
    cellProps = defaultPropGetter,
    title,
    downloadEnabled,
    downloadFilename,
    downloadFormats,
    data,
    ...otherProps
  } = props;

  // Default table options and state, caller can override and extend this via props
  const defaultState: Partial<TableOptions<D>> = {
    disableMultiSort: true,
    defaultColumn,
    initialState: {
      pageSize: 20, // No paging when lower than that
    },
  };

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
      data,
    },
    useSortBy,
    usePagination,
  );

  return (
    <TableStyled>
      {(title || downloadEnabled) && (
        <Toolbar
          variant="dense"
          useGutters={false}
          toolbarCls="gp-table-toolbar"
        >
          {typeof title === "string" ? <h2>{title}</h2> : title}
          {downloadEnabled && (
            <div>
              <DataDownload
                filename={downloadFilename}
                formats={downloadFormats}
                data={data}
              />
            </div>
          )}
        </Toolbar>
      )}
      <table className={props.className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupPropKey, ...otherHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupPropKey} {...otherHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: headerPropKey, ...otherHeaderProps } =
                    column.getHeaderProps([
                      {
                        className: column.className,
                        style: column.style,
                      },
                      columnProps(column), // user passed
                      headerProps(column), // user passed
                    ]);
                  return (
                    <th
                      // Return an array of prop objects and react-table will merge them appropriately
                      {...otherHeaderProps}
                      key={headerPropKey}
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
                      {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const { key: otherRowPropKey, ...otherRowProps } = row.getRowProps(
              rowProps(row) || {},
            );
            return (
              <tr key={otherRowPropKey} {...otherRowProps}>
                {row.cells.map((cell) => {
                  const cellVal = cell.value;
                  const { key: otherCellPropKey, ...otherCellProps } =
                    cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      columnProps(cell.column),
                      cellProps(cell),
                    ]);
                  return (
                    <td
                      key={otherCellPropKey}
                      // Return an array of prop objects and react-table will merge them appropriately
                      {...otherCellProps}
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
    </TableStyled>
  );
}

export default Table;
