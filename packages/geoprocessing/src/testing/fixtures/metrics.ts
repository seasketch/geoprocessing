import { createMetrics } from "../../metrics";
import { DataClass, Metric } from "../../types";

export const dataClasses: DataClass[] = [
  {
    numericClassId: 1,
    classId: "class1",
    display: "Bays and Coast",
    goalValue: 0.2,
    layerId: "1",
  },
  {
    numericClassId: 2,
    classId: "class2",
    display: "Madracis Reef",
    goalValue: 0.2,
    layerId: "2",
  },
];

export const classPercMetrics: Metric[] = createMetrics([
  {
    classId: "class1",
    value: 0.13,
  },
  {
    classId: "class2",
    value: 0.44,
  },
]);
