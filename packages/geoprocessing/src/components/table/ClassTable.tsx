import React from "react";
import { percentWithEdge, keyBy } from "../../helpers";
import { DataClass, Metric } from "../../types";
import { Column, Table } from "./Table";
import { LayerToggle } from "../LayerToggle";
import { GreenPill } from "../Pill";
import { ReportTableStyled } from "./ReportTableStyled";

export interface ClassTableProps {
  /** Table row objects, each expected to have a classId and value. Defaults to "Class" */
  rows: Metric[];
  /** Data class definitions */
  classes: DataClass[];
  /** Whether to format metric value and goal value as a percent.  Defaults to false */
  formatPerc?: boolean;
  /** Text to display for class name column.  Defaults to "Class" */
  titleText?: string;
  /** Whether to show map layer toggle column.  Data classes must have layerId defined */
  showLayerToggle?: boolean;
  /** Text to display for layer toggle column.  Defaults to "Show Map" */
  layerColText?: string;
  /** Whether to show goal column.  Data classes must have a goalValue defined. Defaults to false */
  showGoal?: boolean;
  /** Text to display for value column.  Defaults to "Within Plan" */
  valueColText?: string;
  /** Text to display for goal column.  Defaults to "Goal" */
  goalColText?: string;
  /** Override column widths */
  options?: {
    classColWidth?: string;
    percColWidth?: string;
    showMapWidth?: string;
    goalWidth?: string;
  };
}

/**
 * Table displaying class metrics, one class per table row
 */
export const ClassTable: React.FunctionComponent<ClassTableProps> = ({
  titleText = "Class",
  rows,
  classes,
  formatPerc = false,
  valueColText = "Within Plan",
  showLayerToggle = false,
  layerColText = "Show Map",
  showGoal = false,
  goalColText = "Goal",
  options,
}) => {
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
      Header: valueColText,
      style: { textAlign: "right", width: colWidths.percColWidth },
      accessor: (row) => {
        const valueDisplay = formatPerc
          ? percentWithEdge(row.value)
          : row.value;
        const goal =
          classes.find((curClass) => curClass.classId === row.classId)
            ?.goalValue || 0;
        if (showGoal && row.value > goal) {
          return <GreenPill>{valueDisplay}</GreenPill>;
        } else {
          return valueDisplay;
        }
      },
    },
  ];

  // Optionally insert layer toggle column
  if (showLayerToggle) {
    columns.push({
      Header: layerColText,
      accessor: (row) => {
        const layerId = classesByName[row.classId!].layerId;
        return layerId ? (
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
    });
  }

  // Optionally insert goal column
  if (showGoal) {
    columns.splice(columns.length - (showLayerToggle ? 1 : 0), 0, {
      Header: goalColText,
      style: { textAlign: "right", width: colWidths.goalWidth },
      accessor: (row) => {
        const goalValue = classes.find(
          (curClass) => curClass.classId === row.classId
        )?.goalValue;
        if (!goalValue)
          throw new Error(`Goal value not found for ${row.classId}`);
        return formatPerc ? percentWithEdge(goalValue) : goalValue;
      },
    });
  }

  return (
    <ReportTableStyled>
      <Table className="styled" columns={columns} data={rows} />
    </ReportTableStyled>
  );
};
