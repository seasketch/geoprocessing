import React from "react";
import { useTranslation } from "react-i18next";
import { percentWithEdge } from "../../helpers";
import { MetricGroup } from "../../types";
import { Column, Table } from "./Table";

import styled from "styled-components";
import { SmallReportTableStyled } from "./SmallReportTableStyled";

/**
 * Style component for SketchClassTable
 */
export const SketchClassTableStyled = styled(SmallReportTableStyled)`
  & {
    width: 100%;
    overflow-x: scroll;
  }

  & th:first-child,
  & td:first-child {
    position: sticky;
    left: 0;
    background: #efefef;
  }

  & th,
  & td {
  }

  .styled {
    font-size: 12px;
`;

export interface SketchClassTableProps {
  /** Table rows, expected to have sketchName property and one property for each classId in classes */
  rows: Record<string, string | number>[];
  /** Data class definitions */
  metricGroup: MetricGroup;
  /** Whether to format values as percentages, defaults to false */
  formatPerc?: boolean;
}

/**
 * Table displaying sketch class metrics, one table row per sketch
 * @param param0
 * @returns
 */
export const SketchClassTable: React.FunctionComponent<SketchClassTableProps> =
  ({ rows, metricGroup: dataGroup, formatPerc: usePerc = false }) => {
    const { t } = useTranslation("gp");

    const mpaLabel = t("MPA");

    const classColumns: Column<Record<string, string | number>>[] =
      dataGroup.classes.map((curClass) => ({
        Header: curClass.display,
        accessor: (row) => {
          return usePerc
            ? percentWithEdge(row[curClass.classId] as number)
            : row[curClass.classId];
        },
      }));

    const columns: Column<Record<string, string | number>>[] = [
      {
        Header: mpaLabel,
        accessor: (row) => {
          return <div style={{ width: 120 }}>{row.sketchName}</div>;
        },
      },
      ...classColumns,
    ];

    return (
      <SketchClassTableStyled>
        <Table
          className="styled"
          columns={columns}
          data={rows.sort((a, b) =>
            (a.sketchName as string).localeCompare(b.sketchName as string)
          )}
        />
      </SketchClassTableStyled>
    );
  };

export default SketchClassTable;
