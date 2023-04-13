import React from "react";
import { iucnCategoriesMap, IucnCategory } from "../../iucn";
import { Table, Column } from "../table/Table";
import { IucnLevelPill } from "./IucnLevelPill";
import { Pill } from "../Pill";
import { ReportTableStyled } from "../table/ReportTableStyled";
import { useTranslation } from "react-i18next";

export const IucnDesignationTable = () => {
  const { t } = useTranslation();

  const categoryLabel = t("Category");
  const protectionLevelLabel = t("Protection Level");

  // Translated protection categories
  const transCategories = {
    "1a": t("IUCN category 1a", "Strict Nature Reserve"),
    "1b": t("IUCN category 1b", "Wilderness Area"),
    "2": t("IUCN category 2", "National Park"),
    "3": t("IUCN category 3", "Natural Monument or Feature"),
    "2/3": t(
      "IUCN category 2 or 3",
      "National Park or Natural Monument/Feature"
    ),
    "4": t("IUCN category 4", "Habitat/Species Management Area"),
    "5": t("IUCN category 5", "Protected Landscape/Seascape"),
    "6": t("IUCN category 6", "Protected area with sustainable use"),
    "4/6": t(
      "IUCN category 4 or 6",
      "Habitat/Species Management Area or Protected area with sustainable use"
    ),
    None: t("IUCN category - none", "None"),
  };

  // Translated protection levels
  const transLevels = {
    full: t("IUCN protection level full", "Full"),
    high: t("IUCN protection level high", "High"),
    low: t("IUCN protection level low", "Low"),
  };

  const columns: Column<IucnCategory>[] = [
    {
      Header: categoryLabel,
      accessor: (row) => {
        /* i18next-extract-disable-next-line */
        const categoryName = t(transCategories[row.category]);
        return (
          <span>
            {row.category !== "None" && <Pill>{row.category}</Pill>}{" "}
            {categoryName}
          </span>
        );
      },
    },
    {
      Header: protectionLevelLabel,
      accessor: (row) => (
        <IucnLevelPill level={row.level}>
          {t(transLevels[row.level])}
        </IucnLevelPill>
      ),
    },
  ];

  const categories: IucnCategory[] = Object.values(iucnCategoriesMap).reduce<
    IucnCategory[]
  >((acc, combCat) => {
    return combCat.categories
      ? acc.concat(
          combCat.categories.map((cat) => ({
            ...cat,
            level: combCat.level,
          }))
        )
      : acc.concat({
          category: combCat.category,
          name: combCat.name,
          level: combCat.level,
        });
  }, []);
  console.log(categories);
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
