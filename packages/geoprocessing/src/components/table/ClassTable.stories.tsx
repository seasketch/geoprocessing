import React from "react";
import { ClassTable } from "./ClassTable";
import { ReportContext } from "../../context";
import { ReportDecorator, CardDecorator } from "../storybook/";
import { createMetric } from "../../metrics";
import {
  simpleClassMetrics,
  simpleGroup,
  simpleMetricGroup,
  categoricalClassMetrics,
  categoricalClassMetricsMixedTarget,
  categoricalMetricGroup,
  categoricalMetricGroupMixedTarget,
} from "../../testing/fixtures/metrics";
import { valueFormatter } from "../../helpers/valueFormatter";

export default {
  component: ClassTable,
  title: "Components/Table/ClassTable",
  decorators: [CardDecorator, ReportDecorator],
};

const simpleContext = {
  sketchProperties: {
    name: "My Sketch",
    id: "abc123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sketchClassId: "efg345",
    isCollection: false,
    userAttributes: [
      {
        exportId: "DESIGNATION",
        fieldType: "ChoiceField",
        label: "Designation",
        value: "Marine Reserve",
      },
      {
        exportId: "COMMENTS",
        fieldType: "TextArea",
        label: "Comments",
        value: "This is my MPA and it is going to be the greatest. Amazing.",
      },
    ],
  },
  geometryUri: "",
  projectUrl: "https://example.com/project",
  visibleLayers: ["a"],
};

export const simple = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const number1digit = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "number1dig",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const number2digit = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "number2dig",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const numberThousands = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics.map((m) => ({
          ...m,
          value: m.value * 10000000,
        }))}
        dataGroup={simpleGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "number1dig",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const integer = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics.map((m) => ({
          ...m,
          value: m.value * 10,
        }))}
        dataGroup={simpleGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "integer",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const percent = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={[
          createMetric({
            metricId: simpleMetricGroup.metricId,
            classId: "Plains",
            value: 0.12345,
          }),
        ]}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const percent1Digit = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={[
          createMetric({
            metricId: simpleMetricGroup.metricId,
            classId: "Plains",
            value: 0.12345,
          }),
        ]}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent1dig",
            columnLabel: "% Value",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const percent2Digit = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={[
          createMetric({
            metricId: simpleMetricGroup.metricId,
            classId: "Plains",
            value: 0.12345,
          }),
        ]}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent2dig",
            columnLabel: "% Value",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const percentThousands = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={[
          createMetric({
            metricId: simpleMetricGroup.metricId,
            classId: "Plains",
            value: 10000.12345,
          }),
        ]}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent2dig",
            columnLabel: "% Value",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const simpleLayerToggle = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "layerToggle",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const simpleGoal = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "metricGoal",
            valueFormatter: "percent",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const simpleBoth = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={simpleClassMetrics}
        dataGroup={simpleMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "metricGoal",
            valueFormatter: "percent",
          },
          {
            type: "layerToggle",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const categoricalData = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "% Value",
          },
          {
            type: "metricGoal",
            valueFormatter: "percent",
          },
          {
            type: "layerToggle",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const valueFormatAndLabel = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: (val: string | number) =>
              (typeof val === "string" ? parseFloat(val) : val) * 1000,
            valueLabel: "ideas",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chartWithSeparateSortableValueColumn = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricValue",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            width: 15,
            colStyle: { textAlign: "right" },
            columnLabel: "%",
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "Found Within plan",
            chartOptions: {
              showTitle: false,
            },
            width: 55,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chartWithIntegratedValueAndTargetPass = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={categoricalMetricGroup}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "Found Within plan",
            chartOptions: {
              showTitle: true,
            },
            width: 55,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chartWithObjective = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetrics}
        dataGroup={{
          ...categoricalMetricGroup,
          // @ts-ignore
          objective: { target: 0.3 },
        }}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "Found Within Plan",
            chartOptions: {
              showTitle: true,
              targetLabelStyle: "tight",
            },
            width: 55,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chartWithMixedTarget = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetricsMixedTarget}
        dataGroup={{
          ...categoricalMetricGroupMixedTarget,
        }}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "Found Within Plan",
            chartOptions: {
              showTitle: true,
              targetLabelPosition: "bottom",
              targetLabelStyle: "tight",
            },
            width: 55,
            targetValueFormatter: (
              value: number,
              row: number,
              numRows: number
            ) => {
              if (row === 0) {
                return (value: number) =>
                  `${valueFormatter(value / 100, "percent0dig")} Target`;
              } else {
                return (value: number) =>
                  `${valueFormatter(value / 100, "percent0dig")}`;
              }
            },
          },
          {
            type: "layerToggle",
            width: 15,
          },
        ]}
      />
    </ReportContext.Provider>
  );
};

export const chartWithSeparateTargetColumn = () => {
  return (
    <ReportContext.Provider value={simpleContext}>
      <ClassTable
        rows={categoricalClassMetricsMixedTarget}
        dataGroup={{
          ...categoricalMetricGroupMixedTarget,
        }}
        columnConfig={[
          {
            type: "class",
            width: 30,
          },
          {
            type: "metricChart",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            columnLabel: "Found Within Plan",
            chartOptions: {
              showTitle: true,
              targetLabelPosition: "bottom",
              targetLabelStyle: "tight",
              showTargetLabel: false,
            },
            width: 55,
          },
          {
            type: "metricGoal",
            metricId: simpleMetricGroup.metricId,
            valueFormatter: "percent",
            width: 15,
            colStyle: { textAlign: "right" },
            columnLabel: "Target",
          },
        ]}
      />
    </ReportContext.Provider>
  );
};
