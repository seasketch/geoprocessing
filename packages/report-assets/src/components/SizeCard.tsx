import React from "react";
import {
  ReportResult,
  percentWithEdge,
  keyBy,
  nestMetrics,
  valueFormatter,
  toPercentMetric,
  sortMetricsDisplayOrder,
  MetricGroup,
  GeogProp,
  SketchProperties,
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
import {
  Metric,
  squareMeterToKilometer,
} from "@seasketch/geoprocessing/client-core";
import { styled } from "styled-components";
import project from "../../project/projectClient.js";
import Translator from "../components/TranslatorAsync.js";
import { Trans, useTranslation } from "react-i18next";
import { TFunction } from "i18next";

import watersImgUrl from "../assets/img/territorial_waters.png";

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

export const SizeCard: React.FunctionComponent<GeogProp> = (props) => {
  const [{ isCollection, id: sketchId, childProperties }] =
    useSketchProperties();
  const { t } = useTranslation();

  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const metricGroup = project.getMetricGroup("boundaryAreaOverlap", t);
  const precalcMetrics = project.getPrecalcMetrics(
    metricGroup,
    "area",
    curGeography.geographyId,
  );

  const notFoundString = t("Results not found");

  /* i18next-extract-disable-next-line */
  const planningUnitName = t(project.basic.planningAreaName);
  return (
    <ResultsCard
      title={t("Size")}
      functionName="boundaryAreaOverlap"
      useChildCard
    >
      {(data: ReportResult) => {
        if (Object.keys(data).length === 0) throw new Error(notFoundString);

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
              {genSingleSizeTable(
                sketchId,
                data,
                precalcMetrics,
                metricGroup,
                t,
              )}
              {isCollection && childProperties && (
                <Collapse title={t("Show by MPA")}>
                  {genNetworkSizeTable(
                    data,
                    precalcMetrics,
                    metricGroup,
                    childProperties,
                    t,
                  )}
                </Collapse>
              )}
              <Collapse title={t("Learn more")}>
                <p>
                  {<img src={watersImgUrl} style={{ maxWidth: "100%" }} />}
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Territorial_waters"
                    rel="noreferrer"
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
                    If sketch boundaries within a plan overlap with each other,
                    the overlap is only counted once.
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

const genSingleSizeTable = (
  sketchId: string,
  data: ReportResult,
  precalcMetrics: Metric[],
  mg: MetricGroup,
  t: TFunction,
) => {
  const boundaryLabel = t("Boundary");
  const foundWithinLabel = t("Found Within Plan");
  const mapLabel = t("Map");
  const sqKmLabel = t("km²");

  const singleMetrics = data.metrics.filter((m) => m.sketchId === sketchId);

  const finalMetrics = sortMetricsDisplayOrder(
    [
      ...singleMetrics,
      ...toPercentMetric(singleMetrics, precalcMetrics, {
        metricIdOverride: project.getMetricGroupPercId(mg),
      }),
    ],
    "classId",
    ["eez", "offshore", "contiguous"],
  );

  return (
    <>
      <ClassTable
        rows={finalMetrics}
        metricGroup={mg}
        objective={project.getMetricGroupObjectives(mg, t)}
        columnConfig={[
          {
            columnLabel: boundaryLabel,
            type: "class",
            width: 25,
          },
          {
            columnLabel: foundWithinLabel,
            type: "metricValue",
            metricId: mg.metricId,
            valueFormatter: (val: string | number) =>
              Number.format(
                Math.round(
                  squareMeterToKilometer(
                    // eslint-disable-next-line unicorn/prefer-number-properties
                    typeof val === "string" ? parseInt(val) : val,
                  ),
                ),
              ),
            valueLabel: sqKmLabel,
            width: 20,
          },
          {
            columnLabel: " ",
            type: "metricChart",
            metricId: project.getMetricGroupPercId(mg),
            valueFormatter: "percent",
            chartOptions: {
              showTitle: true,
              showTargetLabel: true,
              targetLabelPosition: "bottom",
              targetLabelStyle: "tight",
              barHeight: 11,
            },
            width: 40,
            targetValueFormatter: (_value: number, row: number) => {
              if (row === 0) {
                return (value: number) =>
                  `${valueFormatter(value / 100, "percent0dig")} ${t(
                    "Target",
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

const genNetworkSizeTable = (
  data: ReportResult,
  precalcMetrics: Metric[],
  mg: MetricGroup,
  childProperties: SketchProperties[],
  t: TFunction,
) => {
  const sketchIds = new Set(
    childProperties ? childProperties.map((skp) => skp.id) : [],
  );
  const sketchPropertiesById = keyBy(childProperties, (skp) => skp.id);
  const sketchMetrics = data.metrics.filter(
    (m) => m.sketchId && sketchIds.has(m.sketchId),
  );
  const finalMetrics = [
    ...sketchMetrics,
    ...toPercentMetric(sketchMetrics, precalcMetrics, {
      metricIdOverride: project.getMetricGroupPercId(mg),
    }),
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

  const classColumns: Column<{ sketchId: string }>[] = mg.classes.map(
    (curClass, index) => {
      /* i18next-extract-disable-next-line */
      const transString = t(curClass.display);
      return {
        Header: transString,
        style: { color: "#777" },
        columns: [
          {
            Header: t("Area") + " ".repeat(index),
            accessor: (row) => {
              const value =
                aggMetrics[row.sketchId][curClass.classId as string][
                  mg.metricId
                ][0].value;
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
                  project.getMetricGroupPercId(mg)
                ][0].value;
              return percentWithEdge(value);
            },
          },
        ],
      };
    },
  );

  const columns: Column<any>[] = [
    {
      Header: " ",
      accessor: (row) => <b>{sketchPropertiesById[row.sketchId].name}</b>,
    },
    ...(classColumns as Column<any>[]),
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
