import React from "react";
import {
  ReportResult,
  percentWithEdge,
  keyBy,
  toNullSketchArray,
  nestMetrics,
  valueFormatter,
  toPercentMetric,
  sortMetricsDisplayOrder,
  isSketchCollection,
} from "@seasketch/geoprocessing/client-core";
import {
  ClassTable,
  Collapse,
  Column,
  ReportTableStyled,
  ResultsCard,
  Table,
  useSketchProperties,
  ToolbarCard,
  DataDownload,
} from "@seasketch/geoprocessing/client-ui";
import styled from "styled-components";
import project from "../../project";
import { Metric, squareMeterToKilometer } from "@seasketch/geoprocessing";
import Translator from "../components/TranslatorAsync";
import { Trans, useTranslation } from "react-i18next";
import { TFunction } from "i18next";
const boundaryMetricGroup = project.getMetricGroup("boundaryAreaOverlap");

// Hard code total area of eez
const boundaryTotalMetrics: Metric[] = [
  {
    classId: "eez",
    metricId: "boundaryAreaOverlap",
    sketchId: null,
    groupId: null,
    geographyId: null,
    value: 3032525677797.563,
  },
];

const METRIC_ID = boundaryMetricGroup.metricId;
const PERC_METRIC_ID = `${boundaryMetricGroup.metricId}Perc`;

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const TableStyled = styled(ReportTableStyled)`
  font-size: 12px;
  td {
    text-align: right;
  }

  tr:nth-child(1) > th:nth-child(n + 1) {
    text-align: center;
  }

  tr:nth-child(2) > th:nth-child(n + 1) {
    text-align: center;
  }

  tr > td:nth-child(1),
  tr > th:nth-child(1) {
    border-right: 1px solid #777;
  }

  tr:nth-child(1) > th:nth-child(2) {
    border-right: 1px solid #777;
  }

  tr > td:nth-child(3),
  tr > th:nth-child(3) {
    border-right: 1px solid #777;
  }
  tr > td:nth-child(5),
  tr > th:nth-child(5) {
    border-right: 1px solid #777;
  }
`;

export const SizeCard = () => {
  const [{ isCollection }] = useSketchProperties();
  const { t } = useTranslation();

  /* i18next-extract-disable-next-line */
  const planningUnitName = t(project.basic.planningAreaName);
  return (
    <ResultsCard
      title={t("Size")}
      functionName="boundaryAreaOverlap"
      useChildCard
    >
      {(data: ReportResult) => {
        if (Object.keys(data).length === 0)
          throw new Error("Protection results not found");

        return (
          <>
            <ToolbarCard
              title={t("Size")}
              items={
                <>
                  <DataDownload
                    filename="size"
                    data={data.metrics}
                    formats={["csv", "json"]}
                    placement="left-end"
                  />
                </>
              }
            >
              <p>
                {planningUnitName}{" "}
                <Trans i18nKey="SizeCard - introduction">
                  national waters extend from the shoreline out to 200 nautical
                  miles, known as the Exclusive Economic Zone (EEZ). This report
                  summarizes offshore plan overlap with the EEZ and other
                  boundaries within it, measuring progress towards achieving %
                  targets for each boundary.
                </Trans>
              </p>
              {genSingleSizeTable(data, t)}
              {isCollection && (
                <Collapse title={t("Show by MPA")}>
                  {genNetworkSizeTable(data, t)}
                </Collapse>
              )}
              <Collapse title={t("Learn more")}>
                <p>
                  <img
                    src={require("../assets/img/territorial_waters.png")}
                    style={{ maxWidth: "100%" }}
                  />
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Territorial_waters"
                  >
                    <Trans i18nKey="SizeCard - learn more source">
                      Source: Wikipedia - Territorial Waters
                    </Trans>
                  </a>
                </p>
                <Trans i18nKey="SizeCard - learn more">
                  <p>
                    {" "}
                    This report summarizes the size and proportion of this plan
                    within these boundaries.
                  </p>
                  <p>
                    If MPA boundaries overlap with each other, the overlap is
                    only counted once.
                  </p>
                </Trans>
              </Collapse>
            </ToolbarCard>
          </>
        );
      }}
    </ResultsCard>
  );
};

const genSingleSizeTable = (data: ReportResult, t: TFunction) => {
  const boundaryLabel = t("Boundary");
  const foundWithinLabel = t("Found Within Plan");
  const areaWithinLabel = t("Area Within Plan");
  const mapLabel = t("Map");
  const sqKmLabel = t("km²");

  const classesById = keyBy(boundaryMetricGroup.classes, (c) => c.classId);
  let singleMetrics = data.metrics.filter(
    (m) => m.sketchId === data.sketch.properties.id
  );

  const finalMetrics = sortMetricsDisplayOrder(
    [
      ...singleMetrics,
      ...toPercentMetric(singleMetrics, boundaryTotalMetrics, PERC_METRIC_ID),
    ],
    "classId",
    ["eez", "offshore", "contiguous"]
  );

  const aggMetrics = nestMetrics(finalMetrics, ["classId", "metricId"]);

  // Use sketch ID for each table row, index into aggMetrics
  const rows = Object.keys(aggMetrics).map((classId) => ({ classId }));

  const areaColumns: Column<{ classId: string }>[] = [
    {
      Header: " ",
      accessor: (row) => <b>{classesById[row.classId || "missing"].display}</b>,
    },
    {
      Header: areaWithinLabel,
      accessor: (row) => {
        const value = aggMetrics[row.classId][METRIC_ID][0].value;
        return (
          Number.format(Math.round(squareMeterToKilometer(value))) +
          " " +
          t("km²")
        );
      },
    },
    {
      Header: "% Within Plan",
      accessor: (row) => {
        const value = aggMetrics[row.classId][PERC_METRIC_ID][0].value;
        return percentWithEdge(value);
      },
    },
  ];

  return (
    <>
      <ClassTable
        rows={finalMetrics}
        metricGroup={boundaryMetricGroup}
        objective={project.getMetricGroupObjectives(boundaryMetricGroup)}
        columnConfig={[
          {
            columnLabel: boundaryLabel,
            type: "class",
            width: 25,
          },
          {
            columnLabel: foundWithinLabel,
            type: "metricValue",
            metricId: METRIC_ID,
            valueFormatter: (val: string | number) =>
              Number.format(
                Math.round(
                  squareMeterToKilometer(
                    typeof val === "string" ? parseInt(val) : val
                  )
                )
              ),
            valueLabel: sqKmLabel,
            width: 20,
          },
          {
            columnLabel: " ",
            type: "metricChart",
            metricId: PERC_METRIC_ID,
            valueFormatter: "percent",
            chartOptions: {
              showTitle: true,
              showTargetLabel: true,
              targetLabelPosition: "bottom",
              targetLabelStyle: "tight",
              barHeight: 11,
            },
            width: 40,
            targetValueFormatter: (
              value: number,
              row: number,
              numRows: number
            ) => {
              if (row === 0) {
                return (value: number) =>
                  `${valueFormatter(value / 100, "percent0dig")} ${t(
                    "Target"
                  )}`;
              } else {
                return (value: number) =>
                  `${valueFormatter(value / 100, "percent0dig")}`;
              }
            },
          },
          {
            type: "layerToggle",
            width: 15,
            columnLabel: mapLabel,
          },
        ]}
      />
    </>
  );
};

const genNetworkSizeTable = (data: ReportResult, t: TFunction) => {
  const sketches = toNullSketchArray(data.sketch);
  const sketchesById = keyBy(sketches, (sk) => sk.properties.id);
  const sketchIds = sketches.map((sk) => sk.properties.id);
  const sketchMetrics = data.metrics.filter(
    (m) => m.sketchId && sketchIds.includes(m.sketchId)
  );
  const finalMetrics = [
    ...sketchMetrics,
    ...toPercentMetric(sketchMetrics, boundaryTotalMetrics, PERC_METRIC_ID),
  ];

  const aggMetrics = nestMetrics(finalMetrics, [
    "sketchId",
    "classId",
    "metricId",
  ]);
  // Use sketch ID for each table row, index into aggMetrics
  const rows = Object.keys(aggMetrics).map((sketchId) => ({
    sketchId,
  }));

  const classColumns: Column<{ sketchId: string }>[] =
    boundaryMetricGroup.classes.map((curClass, index) => ({
      Header: curClass.display,
      style: { color: "#777" },
      columns: [
        {
          Header: t("Area") + " ".repeat(index),
          accessor: (row) => {
            const value =
              aggMetrics[row.sketchId][curClass.classId as string][METRIC_ID][0]
                .value;
            return (
              Number.format(Math.round(squareMeterToKilometer(value))) +
              " " +
              t("km²")
            );
          },
        },
        {
          Header: t("% Area") + " ".repeat(index),
          accessor: (row) => {
            const value =
              aggMetrics[row.sketchId][curClass.classId as string][
                PERC_METRIC_ID
              ][0].value;
            return percentWithEdge(value);
          },
        },
      ],
    }));

  const columns: Column<any>[] = [
    {
      Header: " ",
      accessor: (row) => <b>{sketchesById[row.sketchId].properties.name}</b>,
    },
    ...classColumns,
  ];

  return (
    <TableStyled>
      <Table columns={columns} data={rows} />
    </TableStyled>
  );
};

/**
 * SizeCard as a top-level report client
 */
export const SizeCardReportClient = () => {
  return (
    <Translator>
      <SizeCard />
    </Translator>
  );
};
