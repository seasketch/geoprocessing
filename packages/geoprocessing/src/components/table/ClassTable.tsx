import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { nestMetrics } from "../../metrics/helpers";
import {
  percentWithEdge,
  PercentEdgeOptions,
  keyBy,
  getObjectiveById,
} from "../../helpers";
import { MetricGroup, Metric, Objective } from "../../types";
import { Table, Column } from "../table/Table";
import { LayerToggle } from "../LayerToggle";
import { CheckCircleFill, InfoCircleFill } from "@styled-icons/bootstrap";
import {
  HorizontalStackedBar,
  HorizontalStackedBarProps,
} from "../chart/HorizontalStackedBar";
import { ValueFormatter, valueFormatter } from "../../helpers/valueFormatter";

import { ReportTableStyled } from "../table/ReportTableStyled";
import styled from "styled-components";
import { getMetricGroupObjectiveId } from "../../helpers/metricGroup";
import { Tooltip } from "../Tooltip";

export const ClassTableStyled = styled(ReportTableStyled)`
  .styled {
    font-size: 13px;
    td {
      padding: 6px 5px;
    }
  }
`;

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
  /** metricId to use for column - metricGoal will access its values via the metricGroup  */
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
  /** Source for metric class definitions. if group has layerId at top-level, will display one toggle for whole group */
  metricGroup: MetricGroup;
  /** Optional objective for metric */
  objective?: Objective | Objective[];
  /** configuration of one or more columns to display */
  columnConfig: ClassTableColumnConfig[];
}

/**
 * Table displaying class metrics, one class per table row.  Having more than one metric per class may yield unexpected results
 * Returns 0 value in table when faced with a 'missing' metric instead of erroring
 * Handles "class has no value" NaN situation (common when sketch doesn't overlap with a geography) by overwriting with 0 and adding information circle
 */
export const ClassTable: React.FunctionComponent<ClassTableProps> = ({
  rows,
  columnConfig,
  metricGroup,
  objective,
}) => {
  const { t } = useTranslation();
  const classesByName = keyBy(
    metricGroup.classes,
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

    const defaultClassLabel = t("Class");
    const defaultMapLabel = t("Map");
    const defaultTargetLabel = t("Target");
    const defaultGoalLabel = t("Goal");
    const defaultValueLabel = t("Value");

    // Transform column configs into Columns
    const colz: ClassTableColumn[] = colConfigs.map((colConfig) => {
      const style = {
        width: `${colConfig.width || defaultWidth}%`,
        ...(colConfig.colStyle ? colConfig.colStyle : {}),
      };
      if (colConfig.type === "class") {
        return {
          Header: colConfig.columnLabel || defaultClassLabel,
          accessor: (row) => {
            /* i18next-extract-disable-next-line */
            const transString = t(
              classesByName[row.classId || "missing"]?.display
            );
            return transString || "missing";
          },
          style,
        };
      } else if (colConfig.type === "metricValue") {
        return {
          Header: colConfig.columnLabel || defaultValueLabel,
          accessor: (row) => {
            if (!colConfig.metricId)
              throw new Error("Missing metricId in column config");
            // Return 0 when faced with a 'missing' metric
            const value = (() => {
              if (
                metricsByClassByMetric[row.classId] &&
                metricsByClassByMetric[row.classId][colConfig.metricId]
              ) {
                return metricsByClassByMetric[row.classId][
                  colConfig.metricId
                ][0].value;
              } else {
                return 0;
              }
            })();
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
            // Return 0 when faced with a 'missing' metric
            const value = (() => {
              if (
                metricsByClassByMetric[row.classId] &&
                metricsByClassByMetric[row.classId][colConfig.metricId]
              ) {
                return metricsByClassByMetric[row.classId][
                  colConfig.metricId
                ][0].value;
              } else {
                return 0;
              }
            })();
            const target = (() => {
              if (!objective) return 0;
              if (Array.isArray(objective)) {
                // Multi-objective - need to find by class ID
                const objectiveId = getMetricGroupObjectiveId(
                  metricGroup,
                  row.classId
                );
                const theObj = Array.isArray(objective)
                  ? getObjectiveById(objectiveId, objective)
                  : objective;

                if (colConfig.valueFormatter === "percent") {
                  return theObj.target * 100;
                } else {
                  return theObj.target;
                }
              } else {
                // single objective, just grab the target
                if (colConfig.valueFormatter === "percent") {
                  return objective.target * 100;
                } else {
                  return objective.target;
                }
              }
            })();

            const tooltipText =
              (classesByName[row.classId || "missing"]?.display ||
                "This feature class") +
              " not found in the selected planning area";

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
                      {isNaN(value) ? (
                        <Tooltip
                          text={tooltipText}
                          placement="bottom"
                          offset={{ horizontal: 0, vertical: 5 }}
                        >
                          <InfoCircleFill
                            size={14}
                            style={{
                              color: "#83C6E6",
                            }}
                          />
                        </Tooltip>
                      ) : target && value >= target ? (
                        <CheckCircleFill
                          size={14}
                          style={{ color: "#78c679", paddingRight: 5 }}
                        />
                      ) : (
                        <></>
                      )}
                      {percentWithEdge(isNaN(value) ? 0 : value / 100)}
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
                  ? `${defaultTargetLabel} - ${valueFormatter(
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
          Header: colConfig.columnLabel || defaultGoalLabel,
          style,
          accessor: (row) => {
            const objectiveId = getMetricGroupObjectiveId(
              metricGroup,
              row.classId
            );
            const theObj = Array.isArray(objective)
              ? getObjectiveById(objectiveId, objective)
              : objective;
            if (!theObj)
              throw new Error(
                `Missing objective for objectiveId ${objectiveId}`
              );

            return colConfig.valueFormatter
              ? valueFormatter(theObj.target, colConfig.valueFormatter)
              : `${theObj.target}${
                  colConfig.valueLabel ? ` ${colConfig.valueLabel}` : ""
                }`;
          },
        };
      } else if (colConfig.type === "layerToggle") {
        return {
          Header: colConfig.columnLabel || defaultMapLabel,
          style: { textAlign: "center", ...style },
          accessor: (row, index) => {
            const isSimpleGroup = metricGroup.layerId ? false : true;
            const layerId =
              metricGroup.layerId || classesByName[row.classId!].layerId;
            if (isSimpleGroup && layerId) {
              return (
                <LayerToggle
                  simple
                  size="small"
                  layerId={layerId}
                  style={{
                    marginTop: 0,
                    justifyContent: "center",
                  }}
                />
              );
            } else if (!isSimpleGroup && layerId && index === 0) {
              return (
                <LayerToggle
                  simple
                  size="small"
                  layerId={layerId}
                  style={{ marginTop: 0, justifyContent: "center" }}
                />
              );
            } else {
              return <></>;
            }
          },
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
    <ClassTableStyled>
      <Table className="styled" columns={columns} data={tableRows} />
    </ClassTableStyled>
  );
};
