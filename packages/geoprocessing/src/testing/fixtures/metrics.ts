import { createMetrics } from "../../metrics";
import { DataClass, Metric, MetricGroup, Objective } from "../../types";

export const simpleObjectives: Objective[] = [
  {
    objectiveId: "abyss",
    shortDesc: "Protect 20% of Abyssopelagic",
    target: 0.2,
    countsToward: { full: "yes" },
  },
  {
    objectiveId: "bathy",
    shortDesc: "Protect 10% of Bathypelagic",
    target: 0.1,
    countsToward: { full: "yes" },
  },
  {
    objectiveId: "cold",
    shortDesc: "Protect 100% of Cold water corals",
    target: 1.0,
    countsToward: { full: "yes" },
  },
  {
    objectiveId: "escarp",
    shortDesc: "Protect 30% of Escarpments",
    target: 0.3,
    countsToward: { full: "yes" },
  },
];

/** One datasource per class, layer ID for each class */
export const simpleClasses: DataClass[] = [
  {
    datasourceId: "feature_abyssopelagic",
    classId: "Abyssopelagic",
    display: "Abyssopelagic",
    layerId: "61771f5ae9125f452fe759f8",
    objectiveId: "abyss",
  },
  {
    datasourceId: "Bathypelagic1",
    classId: "Bathypelagic",
    display: "Bathypelagic",
    layerId: "614df361c33508c1270159f2",
    objectiveId: "bathy",
  },
  {
    datasourceId: "Cold water coral1",
    classId: "Cold water coral",
    display: "Cold water coral",
    layerId: "614df361c33508c1270159f4",
    objectiveId: "cold",
  },
  {
    datasourceId: "Escarpments1",
    classId: "Escarpments",
    display: "Escarpments",
    layerId: "614df361c33508c1270159f6",
    objectiveId: "escarp",
  },
];

export const simpleMetricGroup: MetricGroup = {
  type: "areaOverlap",
  metricId: "metric",
  classes: simpleClasses,
};

export const simpleClassMetrics: Metric[] = createMetrics([
  {
    classId: "Abyssopelagic",
    value: 0.13,
    metricId: simpleMetricGroup.metricId,
  },
  {
    classId: "Bathypelagic",
    value: 0.44,
    metricId: simpleMetricGroup.metricId,
  },
]);

export const simpleSketchClassAggMetrics: Record<string, string | number>[] = [
  {
    sketchId: "sketch1",
    sketchName: "sketch1",
    Abyssopelagic: 237,
    Bathypelagic: 143,
    "Cold water coral": 8,
    Escarpments: 4982,
    Knolls: 837,
    Plains: 30,
    Seamounts: 287,
  },
  {
    sketchId: "sketch2",
    sketchName: "sketch2",
    Abyssopelagic: 283,
    Bathypelagic: 13,
    "Cold water coral": 238,
    Escarpments: 482,
    Knolls: 7,
    Plains: 150,
    Seamounts: 147,
  },
];

export const simpleSketchClassAggMetricsPerc: Record<
  string,
  string | number
>[] = [
  {
    sketchId: "sketch1",
    sketchName: "sketch1",
    Abyssopelagic: 0.32,
    Bathypelagic: 0.2,
    "Cold water coral": 0,
    Escarpments: 0.02,
    Knolls: 0.83,
    Plains: 0,
    Seamounts: 0.52,
  },
  {
    sketchId: "sketch2",
    sketchName: "sketch2",
    Abyssopelagic: 0.52,
    Bathypelagic: 0.08,
    "Cold water coral": 0.84,
    Escarpments: 0,
    Knolls: 0.65,
    Plains: 1,
    Seamounts: 0.68,
  },
];

// CATEGORICAL CLASSES - SAME TARGET

export const categoricalSingleObjective: Objective = {
  objectiveId: "obj1",
  shortDesc: "Protect 20% of each reef class",
  target: 0.2,
  countsToward: { full: "yes" },
};

/** One dataset with multiple classes, one layer ID at group level */
export const categoricalClasses: DataClass[] = [
  {
    numericClassId: 1,
    classId: "Bays and Coast",
    display: "Bays and Coast",
    objectiveId: "obj1",
  },
  {
    numericClassId: 2,
    classId: "Madracis Reef",
    display: "Madracis Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 3,
    classId: "Montastraea Reef",
    display: "Montastraea Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 4,
    classId: "Diploria Porites Reef",
    display: "Diploria Porites Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 5,
    classId: "Castle Harbour Madracis",
    display: "Castle Harbour Madracis",
    objectiveId: "obj1",
  },
  {
    numericClassId: 6,
    classId: "Algal Vermetid Reef",
    display: "Algal Vermetid Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 7,
    classId: "Rim Reef",
    display: "Rim Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 8,
    classId: "Main Terrace Reef",
    display: "Main Terrace Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 9,
    classId: "Fore Reef",
    display: "Fore Reef",
    objectiveId: "obj1",
  },
  {
    numericClassId: 10,
    classId: "Mesophotic",
    display: "Mesophotic",
    objectiveId: "obj1",
  },
  {
    numericClassId: 11,
    classId: "Rariphotic",
    display: "Rariphotic",
    objectiveId: "obj1",
  },
  {
    numericClassId: 12,
    classId: "Mesopelagic",
    display: "Mesopelagic",
    objectiveId: "obj1",
  },
  {
    numericClassId: 13,
    classId: "Bathypelagic",
    display: "Bathypelagic",
    objectiveId: "obj1",
  },
];

export const categoricalMetricGroup: MetricGroup = {
  type: "areaOverlap",
  classes: categoricalClasses,
  metricId: "metric",
};

export const categoricalClassMetrics: Metric[] = createMetrics([
  {
    classId: "Bays and Coast",
    value: 0.13,
    metricId: categoricalMetricGroup.metricId,
  },
  {
    classId: "Madracis Reef",
    value: 0.44,
    metricId: categoricalMetricGroup.metricId,
  },
]);

export const longClassMetrics: Metric[] = createMetrics([
  {
    classId: "Bays and Coast",
    value: 0.133456532,
    metricId: categoricalMetricGroup.metricId,
  },
  {
    classId: "Madracis Reef",
    value: 0.45532444,
    metricId: categoricalMetricGroup.metricId,
  },
]);

// CATEGORICAL - MIXED TARGET

export const categoricalMultiObjective: Objective[] = [
  {
    objectiveId: "bayscoast",
    shortDesc: "Protect 30% of bays and coast",
    target: 0.3,
    countsToward: { full: "yes" },
  },
  {
    objectiveId: "madracis",
    shortDesc: "Protect 20% of madracis reef",
    target: 0.2,
    countsToward: { full: "yes" },
  },
  {
    objectiveId: "monta",
    shortDesc: "Protect 45% of montastraea reef",
    target: 0.45,
    countsToward: { full: "yes" },
  },
  {
    objectiveId: "diploria",
    shortDesc: "Protect 50% of diploria porites",
    target: 0.5,
    countsToward: { full: "yes" },
  },
];

/** One dataset with multiple classes, one layer ID at group level */
export const categoricalClassesMixedTarget: DataClass[] = [
  {
    numericClassId: 1,
    classId: "Bays and Coast",
    display: "Bays and Coast",
    objectiveId: "bayscoast",
  },
  {
    numericClassId: 2,
    classId: "Madracis Reef",
    display: "Madracis Reef",
    objectiveId: "madracis",
  },
  {
    numericClassId: 3,
    classId: "Montastraea Reef",
    display: "Montastraea Reef",
    objectiveId: "monta",
  },
  {
    numericClassId: 4,
    classId: "Diploria Porites Reef",
    display: "Diploria Porites Reef",
    objectiveId: "diploria",
  },
];

export const categoricalMetricGroupMixedTarget: MetricGroup = {
  type: "areaOverlap",
  classes: categoricalClassesMixedTarget,
  metricId: "metric",
  layerId: "a",
};

export const categoricalClassMetricsMixedTarget: Metric[] = createMetrics([
  {
    classId: "Bays and Coast",
    value: 0.13,
    metricId: categoricalMetricGroupMixedTarget.metricId,
  },
  {
    classId: "Madracis Reef",
    value: 0.65,
    metricId: categoricalMetricGroupMixedTarget.metricId,
  },
  {
    classId: "Montastraea Reef",
    value: 0.896,
    metricId: categoricalMetricGroupMixedTarget.metricId,
  },
  {
    classId: "Diploria Porites Reef",
    value: 0.02,
    metricId: categoricalMetricGroupMixedTarget.metricId,
  },
]);
