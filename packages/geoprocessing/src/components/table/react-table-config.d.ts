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

  export interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
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
