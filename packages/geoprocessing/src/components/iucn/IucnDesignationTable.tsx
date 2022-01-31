import React from "react";
import { iucnCategories, IucnCategory } from "../../iucn";
import { capitalize } from "../../helpers";
import { Table, Column } from "../table/Table";
import { IucnLevelPill } from "./IucnLevelPill";
import { Pill } from "../Pill";
import { ReportTableStyled } from "../table/ReportTableStyled";

const columns: Column<IucnCategory>[] = [
  {
    Header: "Category",
    accessor: (row) => (
      <span>
        {row.category !== "None" && <Pill>{row.category}</Pill>}
        {` ${row.name}`}
      </span>
    ),
  },
  {
    Header: "Protection Level",
    accessor: (row) => (
      <IucnLevelPill level={row.level}>{capitalize(row.level)}</IucnLevelPill>
    ),
  },
];

export const IucnDesignationTable = () => {
  const categories: IucnCategory[] = Object.values(iucnCategories).reduce<
    IucnCategory[]
  >((acc, combCat) => {
    return combCat.categories
      ? acc.concat(
          combCat.categories.map((cat) => ({ ...cat, level: combCat.level }))
        )
      : acc.concat({
          category: combCat.category,
          name: combCat.name,
          level: combCat.level,
        });
  }, []);
  return (
    <ReportTableStyled>
      <Table
        className="table"
        columns={columns}
        data={categories.sort((a, b) => a.category.localeCompare(b.category))}
      />
    </ReportTableStyled>
  );
};
