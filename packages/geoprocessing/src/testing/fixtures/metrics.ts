import { createMetrics } from "../../metrics";
import { DataClass, DataGroup, Metric } from "../../types";

/** One dataset per class, layer ID for each class */
export const simpleClasses: DataClass[] = [
  {
    baseFilename: "feature_abyssopelagic",
    noDataValue: -3.39999995214436425e38,
    classId: "Abyssopelagic",
    display: "Abyssopelagic",
    layerId: "61771f5ae9125f452fe759f8",
    goalValue: 0.2,
  },
  {
    baseFilename: "Bathypelagic1",
    noDataValue: -3.39999995214436425e38,
    classId: "Bathypelagic",
    display: "Bathypelagic",
    layerId: "614df361c33508c1270159f2",
    goalValue: 0.2,
  },
  {
    baseFilename: "Cold water coral1",
    noDataValue: -3.39999995214436425e38,
    classId: "Cold water coral",
    display: "Cold water coral",
    layerId: "614df361c33508c1270159f4",
    goalValue: 1,
  },
  {
    baseFilename: "Escarpments1",
    noDataValue: -3.39999995214436425e38,
    classId: "Escarpments",
    display: "Escarpments",
    layerId: "614df361c33508c1270159f6",
    goalValue: 0.2,
  },
  {
    baseFilename: "Knolls1",
    noDataValue: -3.39999995214436425e38,
    classId: "Knolls",
    display: "Knolls",
    layerId: "614df361c33508c1270159f8",
    goalValue: 0.2,
  },
  {
    baseFilename: "Plains",
    noDataValue: -3.39999995214436425e38,
    classId: "Plains",
    display: "Plains",
    layerId: "614df361c33508c127015a02a",
    goalValue: 0.1,
  },
  {
    baseFilename: "seamounts_buffered",
    noDataValue: -3.39999995214436425e38,
    classId: "Seamounts",
    display: "Seamounts",
    layerId: "61771fcde9125f452fe75b01",
    goalValue: 0.4,
  },
];

export const simpleGroup: DataGroup = {
  classes: simpleClasses,
};

export const simpleClassMetrics: Metric[] = createMetrics([
  {
    classId: "Abyssopelagic",
    value: 0.13,
  },
  {
    classId: "Bathypelagic",
    value: 0.44,
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

// CATEGORICAL

/** One dataset with multiple classes, one layer ID at group level */
export const categoricalClasses: DataClass[] = [
  {
    numericClassId: 1,
    classId: "Bays and Coast",
    display: "Bays and Coast",
    goalValue: 0.2,
  },
  {
    numericClassId: 2,
    classId: "Madracis Reef",
    display: "Madracis Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 3,
    classId: "Montastraea Reef",
    display: "Montastraea Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 4,
    classId: "Diploria Porites Reef",
    display: "Diploria Porites Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 5,
    classId: "Castle Harbour Madracis",
    display: "Castle Harbour Madracis",
    goalValue: 0.2,
  },
  {
    numericClassId: 6,
    classId: "Algal Vermetid Reef",
    display: "Algal Vermetid Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 7,
    classId: "Rim Reef",
    display: "Rim Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 8,
    classId: "Main Terrace Reef",
    display: "Main Terrace Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 9,
    classId: "Fore Reef",
    display: "Fore Reef",
    goalValue: 0.2,
  },
  {
    numericClassId: 10,
    classId: "Mesophotic",
    display: "Mesophotic",
    goalValue: 0.2,
  },
  {
    numericClassId: 11,
    classId: "Rariphotic",
    display: "Rariphotic",
    goalValue: 0.2,
  },
  {
    numericClassId: 12,
    classId: "Mesopelagic",
    display: "Mesopelagic",
    goalValue: 0.2,
  },
  {
    numericClassId: 13,
    classId: "Bathypelagic",
    display: "Bathypelagic",
    goalValue: 0.2,
  },
];

export const categoricalGroup: DataGroup = {
  classes: categoricalClasses,
  layerId: "a",
};

export const categoricalClassMetrics: Metric[] = createMetrics([
  {
    classId: "Bays and Coast",
    value: 0.13,
  },
  {
    classId: "Madracis Reef",
    value: 0.44,
  },
]);
