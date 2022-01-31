import React from "react";
import { DataClass, Metric } from "../../types";
import { percentWithEdge, keyBy } from "../../helpers";
import { Column, Table } from "./Table";
import { LayerToggle } from "../LayerToggle";
import { GreenPill } from "../Pill";
import { ReportTableStyled } from "./ReportTableStyled";

export interface CategoricalClassTableProps {
  titleText: string;
  layerId?: string;
  /** Metrics with percent value */
  rows: Metric[];
  classes: DataClass[];
  showGoal: boolean;
  options?: {
    classColWidth?: string;
    percColWidth?: string;
    showMapWidth?: string;
    goalWidth?: string;
  };
}

export const CategoricalClassTable: React.FunctionComponent<
  CategoricalClassTableProps
> = ({ titleText, layerId, rows, classes, showGoal = true, options }) => {
  // Use user-defined width, otherwise sane default depending on whether goal
  const colWidths = {
    classColWidth: options?.classColWidth
      ? options?.classColWidth
      : showGoal
      ? "30%"
      : "50%",
    percColWidth: options?.percColWidth
      ? options?.percColWidth
      : showGoal
      ? "30%"
      : "30%",
    showMapWidth: options?.showMapWidth
      ? options?.showMapWidth
      : showGoal
      ? "20%"
      : "20%",
    goalWidth: options?.goalWidth
      ? options?.goalWidth
      : showGoal
      ? "20%"
      : "50%",
  };
  const classesByName = keyBy(classes, (curClass) => curClass.classId);
  const columns: Column<Metric>[] = [
    {
      Header: titleText,
      accessor: (row) =>
        classesByName[row.classId || "missing"]?.display || "missing",
      style: { width: colWidths.classColWidth },
    },
    {
      Header: "% Within Plan",
      style: { textAlign: "right", width: colWidths.percColWidth },
      accessor: (row) => {
        const percDisplay = percentWithEdge(row.value);
        const goal =
          classes.find((curClass) => curClass.classId === row.classId)
            ?.goalValue || 0;
        if (row.value > goal) {
          return <GreenPill>{percDisplay}</GreenPill>;
        } else {
          return percDisplay;
        }
      },
    },
    {
      Header: "Show Map",
      accessor: (row, index) => {
        return index == 0 ? (
          <LayerToggle
            simple
            layerId={layerId}
            style={{ marginTop: 0, marginLeft: 15 }}
          />
        ) : (
          <></>
        );
      },
      style: { width: colWidths.showMapWidth },
    },
  ];

  // Optionally insert goal column
  if (showGoal) {
    columns.splice(columns.length - 1, 0, {
      Header: "Goal",
      style: { textAlign: "right", width: colWidths.goalWidth },
      accessor: (row) => {
        const goalPerc = classes.find(
          (curClass) => curClass.classId === row.classId
        )?.goalValue;
        return percentWithEdge(goalPerc || 0);
      },
    });
  }

  return (
    <ReportTableStyled>
      <Table className="styled" columns={columns} data={rows} />
    </ReportTableStyled>
  );
};
