import React, { ReactElement } from "react";
import Table, { TableOptions, Column, Row } from "./Table";
import CheckboxGroup from "../checkbox/CheckboxGroup";
import useCheckboxes from "../../hooks/useCheckboxes";

/** Custom table data filter */
export interface FilterSelectOption<D extends object = {}> {
  /** The label displayed for the select filter */
  name: string;
  /** Whether to select by default */
  defaultValue: boolean;
  /** The function used to filter the set. */
  filterFn: (row: D) => boolean;
}

/** Custom table data filters that are only active when selected by the user */
export interface FilterSelect<D extends object = {}> {
  /** Filter a row if every filter function returns true (logical AND), or at least some (logical OR) */
  type: "every" | "some";
  /** filter functions called for every data row */
  filters: FilterSelectOption<D>[];
}

export interface FilterSelectTableOptions<D extends object = {}>
  extends TableOptions {
  filterSelect: FilterSelect<D>;
  data: D[];
}

export default function FilterSelectTable<D extends object>(
  props: FilterSelectTableOptions<D>
): ReactElement {
  const { filterSelect, data, ...otherProps } = props;
  const options = filterSelect.filters.map((f) => ({
    name: f.name,
    checked: f.defaultValue,
  }));
  const checkboxState = useCheckboxes(options);

  const filteredData = React.useMemo(() => {
    const activeFilters = filterSelect.filters.filter(
      (f, i) => checkboxState.checkboxes[i].checked
    );
    return data.filter((row) => {
      if (activeFilters.length === 0) return true;
      return activeFilters[filterSelect.type]((f, i) => f.filterFn(row));
    });
  }, [data, checkboxState.checkboxes]);

  return (
    <>
      <div className="filterSelect">
        <CheckboxGroup {...checkboxState} />
      </div>
      <Table data={filteredData} {...otherProps} />
    </>
  );
}
