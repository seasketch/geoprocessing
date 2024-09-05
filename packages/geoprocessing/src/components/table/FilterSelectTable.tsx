import React, { ReactElement } from "react";
import Table, { TableOptions, Column, Row } from "./Table.js";
import CheckboxGroup from "../checkbox/CheckboxGroup.js";
import useCheckboxes from "../../hooks/useCheckboxes.js";
import { styled } from "styled-components";

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
  /** Filter a row if `every` selected filter function returns true (logical AND), or at least `some` (logical OR) */
  type?: "every" | "some";
  /** filter functions called for every data row */
  filters: FilterSelectOption<D>[];
  filterPosition?: "top" | "bottom";
}

export const FilterSelectTableStyled = styled.div`
  input {
    margin: 0px 10px 0px 0px;
  }

  table {
    margin-bottom: 10px;
  }
  .checkbox-group {
    margin: 10px 0px 10px 0px;
  }
`;

export interface FilterSelectTableOptions<D extends object = {}>
  extends TableOptions<D> {
  filterSelect: FilterSelect<D>;
}

/**
 * Table with customizable filter functions as CheckboxGroup that when selected
 * filter the rows if the function return true.  By default only 'some' filter function
 * has to match for it to filter the row
 */
export function FilterSelectTable<D extends object>(
  props: FilterSelectTableOptions<D>,
): ReactElement {
  const { filterSelect, data, ...otherProps } = props;
  const { type = "some", filterPosition = "bottom", filters } = filterSelect;
  const options = filters.map((f) => ({
    name: f.name,
    checked: f.defaultValue,
  }));
  const checkboxState = useCheckboxes(options);

  const filteredData = React.useMemo(() => {
    const activeFilters = filters.filter(
      (f, i) => checkboxState.checkboxes[i].checked,
    );
    return data.filter((row) => {
      if (activeFilters.length === 0) return true;
      return activeFilters[type]((f, i) => f.filterFn(row));
    });
  }, [data, checkboxState.checkboxes]);

  const checkboxes = <CheckboxGroup {...checkboxState} />;

  return (
    <FilterSelectTableStyled className="filter-select-table">
      {filterPosition === "top" && checkboxes}
      <Table data={filteredData} {...otherProps} />
      {filterPosition === "bottom" && checkboxes}
    </FilterSelectTableStyled>
  );
}

export default FilterSelectTable;
