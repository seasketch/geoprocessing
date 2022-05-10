import React from "react";
import { nestMetrics } from "../../metrics/helpers";
import { percentWithEdge, PercentEdgeOptions, keyBy } from "../../helpers";
import { DataGroup, Metric } from "../../types";
import { Table, Column } from "../table/Table";
import { SmallReportTableStyled } from "../table/SmallReportTableStyled";
import { LayerToggle } from "../LayerToggle";
import { CheckCircleFill } from "@styled-icons/bootstrap";
import {
  HorizontalStackedBar,
  HorizontalStackedBarProps,
} from "../chart/HorizontalStackedBar";
import { ValueFormatter, valueFormatter } from "../../helpers/valueFormatter";

/**
 * Function that given target value for current table row, the table row index, and total number of
 * table rows, returns a function that given target value returns a
 * formatted string or Element.  In other words a function that handles the formatting based on where
 * the row is in the table and returns a function handling the remaining formatting.
 */
export type TargetFormatter = (
  value: number,
  row: number,
  numRows: number
) => (value: number) => string | JSX.Element;

export interface ClassTableColumnConfig {
  /** column display type */
  type: "class" | "metricValue" | "metricChart" | "metricGoal" | "layerToggle";
  /** metricId to use for column - metricGoal will access its values via the dataGroup  */
  metricId?: string;
  /** column header label */
  columnLabel?: string;
  /** unit string to display after value, or a format function that is passed the row value */
  valueLabel?: string | ((value: number | string) => string);
  /** column percent width out of 100 */
  width?: number;
  /** additional style properties for column */
  colStyle?: React.CSSProperties;
  /** formatting to apply to values in column row, defaults to as-is 'value' formatting. */
  valueFormatter?: ValueFormatter;
  /** formatting of target value based on the location of the row in the table */
  targetValueFormatter?: TargetFormatter;
  /** config options for percent value formatting.  see percentWithEdge function for more details */
  percentFormatterOptions?: PercentEdgeOptions;
  /** override options for metricChart column type */
  chartOptions?: Partial<HorizontalStackedBarProps>;
}

export interface ClassTableProps {
  /** Table row objects, each expected to have a classId and value. */
  rows: Metric[];
  /** Data class definitions. if group has layerId at top-level, will display one toggle for whole group */
  dataGroup: DataGroup;
  /** configuration of one or more columns to display */
  columnConfig: ClassTableColumnConfig[];
}

/**
 * Table displaying class metrics, one class per table row.  Having more than one metric per class may yield unexpected results
 */
export const ClassTable: React.FunctionComponent<ClassTableProps> = ({
  rows,
  columnConfig,
  dataGroup,
}) => {
  const classesByName = keyBy(
    dataGroup.classes,
    (curClass) => curClass.classId
  );

  // group metrics by class ID, then metric ID, for easy lookup
  const metricsByClassByMetric = nestMetrics(rows, ["classId", "metricId"]);

  // Use sketch ID for each table row, use index to lookup into nested metrics
  const tableRows = Object.keys(metricsByClassByMetric).map((classId) => ({
    classId,
  }));

  type ClassTableColumn = Column<{ classId: string }>;

  const genColumns = (
    colConfigs: ClassTableColumnConfig[]
  ): ClassTableColumn[] => {
    const defaultWidth = 100 / colConfigs.length;

    // Transform column configs into Columns
    const colz: ClassTableColumn[] = colConfigs.map((colConfig) => {
      const style = {
        width: `${colConfig.width || defaultWidth}%`,
        ...(colConfig.colStyle ? colConfig.colStyle : {}),
      };
      if (colConfig.type === "class") {
        return {
          Header: colConfig.columnLabel || "Class",
          accessor: (row) =>
            classesByName[row.classId || "missing"]?.display || "missing",
          style,
        };
      } else if (colConfig.type === "metricValue") {
        return {
          Header: colConfig.columnLabel || "Value",
          accessor: (row) => {
            if (!colConfig.metricId)
              throw new Error("Missing metricId in column config");
            const value =
              metricsByClassByMetric[row.classId][colConfig.metricId][0].value;
            return `${
              colConfig.valueFormatter
                ? valueFormatter(value, colConfig.valueFormatter)
                : value
            } ${colConfig.valueLabel ? ` ${colConfig.valueLabel}` : ""}`;
          },
          style,
        };
      } else if (colConfig.type === "metricChart") {
        return {
          Header: colConfig.columnLabel || " ",
          style: { textAlign: "center", ...style },
          accessor: (row, rowIndex) => {
            if (!colConfig.metricId)
              throw new Error("Missing metricId in column config");
            const value =
              metricsByClassByMetric[row.classId][colConfig.metricId][0].value;

            const goalValue =
              classesByName[row.classId] && classesByName[row.classId].goalValue
                ? classesByName[row.classId].goalValue! * 100
                : 0;
            let target = 0;
            // @ts-ignore: need to add objective to type
            if (dataGroup.objective) {
              if (colConfig.valueFormatter === "percent") {
                // @ts-ignore: need to add objective to type
                target = dataGroup.objective.target * 100;
              } else {
                // @ts-ignore: need to add objective to type
                target = dataGroup.objective.target;
              }
            } else if (goalValue > 0) {
              target = goalValue;
            }

            const chartProps = {
              ...(colConfig.chartOptions ? colConfig.chartOptions : {}),
              rows: [
                [
                  [
                    colConfig.valueFormatter === "percent"
                      ? value * 100
                      : value,
                  ],
                ],
              ],
              rowConfigs: [
                {
                  title: (value: number) => (
                    <>
                      {target && value >= target ? (
                        <CheckCircleFill
                          size={14}
                          style={{ color: "#78c679", paddingRight: 5 }}
                        />
                      ) : (
                        <></>
                      )}
                      {percentWithEdge(value / 100)}
                    </>
                  ),
                },
              ],
              max: 100,
            };

            let targetValueFormatter:
              | ((value: number) => string | JSX.Element)
              | undefined;
            if (typeof colConfig.targetValueFormatter === "function") {
              targetValueFormatter = colConfig.targetValueFormatter(
                target,
                rowIndex,
                tableRows.length
              );
            } else {
              targetValueFormatter = (targetValue) =>
                rowIndex === tableRows.length - 1
                  ? `Target - ${valueFormatter(
                      targetValue / 100,
                      "percent0dig"
                    )}`
                  : "";
            }

            return (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <HorizontalStackedBar
                    blockGroupNames={["foo"]}
                    blockGroupStyles={[{ backgroundColor: "#ACD0DE" }]}
                    showTitle={true}
                    showLegend={false}
                    showTargetLabel={true}
                    targetLabelPosition="bottom"
                    showTotalLabel={false}
                    barHeight={12}
                    target={target || undefined}
                    targetValueFormatter={targetValueFormatter}
                    {...chartProps}
                  />
                </div>
              </div>
            );
          },
        };
      } else if (colConfig.type === "metricGoal") {
        return {
          Header: colConfig.columnLabel || "Goal",
          style,
          accessor: (row) => {
            const value = dataGroup.classes.find(
              (curClass) => curClass.classId === row.classId
            )?.goalValue;
            if (!value)
              throw new Error(`Goal value not found for ${row.classId}`);
            return colConfig.valueFormatter
              ? valueFormatter(value, colConfig.valueFormatter)
              : `${value}${
                  colConfig.valueLabel ? ` ${colConfig.valueLabel}` : ""
                }`;
          },
        };
      } else if (colConfig.type === "layerToggle") {
        return {
          Header: colConfig.columnLabel || "Show Map",
          accessor: (row, index) => {
            const isSimpleGroup = dataGroup.layerId ? false : true;
            const layerId =
              dataGroup.layerId || classesByName[row.classId!].layerId;
            if (isSimpleGroup && layerId) {
              return (
                <LayerToggle
                  simple
                  layerId={layerId}
                  style={{ marginTop: 0, marginLeft: 15 }}
                />
              );
            } else if (!isSimpleGroup && layerId && index === 0) {
              return (
                <LayerToggle
                  simple
                  layerId={layerId}
                  style={{ marginTop: 0, marginLeft: 15 }}
                />
              );
            } else {
              return <></>;
            }
          },
          style,
        };
      } else {
        throw new Error(
          `Unexpected ClassTableColumnConfig type ${colConfig.type}`
        );
      }
    });
    return colz;
  };

  const columns = genColumns(columnConfig);

  return (
    <SmallReportTableStyled>
      <Table className="styled" columns={columns} data={tableRows} />
    </SmallReportTableStyled>
  );
};
