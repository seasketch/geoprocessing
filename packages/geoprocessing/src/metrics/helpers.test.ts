/**
 * @group unit
 */

import {
  flattenByGroupAllClass,
  flattenByGroupSketchAllClass,
  flattenBySketchAllClass,
  nestMetrics,
  createMetric,
} from "./helpers";
import { NullSketch, NullSketchCollection, Metric } from "../types";

const CLASSES = [
  {
    classId: "class1",
    display: "class1",
  },
  {
    classId: "class2",
    display: "class2",
  },
];

const PRECALC_TOTALS: Metric[] = [
  createMetric({
    metricId: "metric1",
    value: 100,
  }),
  createMetric({
    classId: "class1",
    metricId: "metric1",
    value: 100,
  }),
  createMetric({
    classId: "class2",
    metricId: "metric1",
    value: 100,
  }),
];

const collectionId = "CCCC";
const sketchAId = "AAAA";
const sketchBId = "BBBB";
const sketchDId = "DDDD";

const sketches: NullSketch[] = [
  {
    type: "Feature",
    properties: {
      id: sketchAId,
      name: "SketchA",
      updatedAt: "2021-11-20T00:00:34.365Z",
      createdAt: "2021-10-28T13:49:22.785Z",
      sketchClassId: "AAAA",
      isCollection: false,
      userAttributes: [],
    },
    id: "1",
    geometry: null,
  },
  {
    type: "Feature",
    properties: {
      id: sketchBId,
      name: "SketchB",
      updatedAt: "2021-11-19T23:59:16.315Z",
      createdAt: "2021-11-19T23:34:00.777Z",
      sketchClassId: "BBBB",
      isCollection: false,
      userAttributes: [],
    },
    id: "2",
    geometry: null,
  },
  {
    type: "Feature",
    properties: {
      id: sketchDId,
      name: "SketchD",
      updatedAt: "2021-11-19T23:59:16.315Z",
      createdAt: "2021-11-19T23:34:00.777Z",
      sketchClassId: "DDDD",
      isCollection: false,
      userAttributes: [],
    },
    id: "4",
    geometry: null,
  },
];

const collection: NullSketchCollection = {
  type: "FeatureCollection",
  properties: {
    id: collectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  features: sketches,
};

const metrics: Metric[] = [
  createMetric({
    metricId: "metric1",
    sketchId: sketchAId,
    value: 10,
    classId: "class1",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: sketchBId,
    value: 20,
    classId: "class1",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: sketchDId,
    value: 40,
    classId: "class1",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: collectionId,
    value: 30,
    classId: "class1",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: sketchAId,
    value: 40,
    classId: "class2",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: sketchBId,
    value: 50,
    classId: "class2",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: sketchDId,
    value: 60,
    classId: "class2",
  }),
  createMetric({
    metricId: "metric1",
    sketchId: collectionId,
    value: 90,
    classId: "class2",
  }),
];

const groupMetrics: Metric[] = [
  // collection
  createMetric({
    groupId: "group1",
    classId: "class1",
    metricId: "metric1",
    sketchId: collectionId,
    value: 25,
  }),
  createMetric({
    groupId: "group2",
    classId: "class1",
    metricId: "metric1",
    sketchId: collectionId,
    value: 30,
  }),
  createMetric({
    groupId: "group3",
    classId: "class1",
    metricId: "metric1",
    sketchId: collectionId,
    value: 35,
  }),
  createMetric({
    groupId: "group1",
    classId: "class2",
    metricId: "metric1",
    sketchId: collectionId,
    value: 25,
  }),
  createMetric({
    groupId: "group2",
    classId: "class2",
    metricId: "metric1",
    sketchId: collectionId,
    value: 30,
  }),
  createMetric({
    groupId: "group3",
    classId: "class2",
    metricId: "metric1",
    sketchId: collectionId,
    value: 35,
  }),
  // sketch class 1
  createMetric({
    groupId: "group1",
    classId: "class1",
    metricId: "metric1",
    sketchId: sketchAId,
    value: 15,
  }),
  createMetric({
    groupId: "group1",
    classId: "class1",
    metricId: "metric1",
    sketchId: sketchBId,
    value: 20,
  }),
  createMetric({
    groupId: "group2",
    classId: "class1",
    metricId: "metric1",
    sketchId: sketchDId,
    value: 30,
  }),
  // sketch class 2
  createMetric({
    groupId: "group1",
    classId: "class2",
    metricId: "metric1",
    sketchId: sketchAId,
    value: 15,
  }),
  createMetric({
    groupId: "group1",
    classId: "class2",
    metricId: "metric1",
    sketchId: sketchBId,
    value: 20,
  }),
  createMetric({
    groupId: "group2",
    classId: "class2",
    metricId: "metric1",
    sketchId: sketchDId,
    value: 30,
  }),
  // sketch class 3
  createMetric({
    groupId: "group3",
    classId: "class2",
    metricId: "metric1",
    sketchId: sketchAId,
    value: 20,
  }),
  createMetric({
    groupId: "group3",
    classId: "class2",
    metricId: "metric1",
    sketchId: sketchDId,
    value: 15,
  }),
];

describe("flattenSketchAllClass", () => {
  test("flattenSketchAllClass - basic", async () => {
    const answer = [
      {
        class1: 10,
        class2: 40,
        sketchId: sketchAId,
        sketchName: "SketchA",
      },
      {
        class1: 20,
        class2: 50,
        sketchId: sketchBId,
        sketchName: "SketchB",
      },
      {
        class1: 40,
        class2: 60,
        sketchId: "DDDD",
        sketchName: "SketchD",
      },
    ];

    const rows = flattenBySketchAllClass(metrics, CLASSES, sketches);
    expect(rows).toEqual(answer);
  });

  test("flattenByGroup - single class", async () => {
    const rows = flattenByGroupAllClass(
      collection,
      groupMetrics,
      PRECALC_TOTALS
    );

    const answer = [
      {
        groupId: "group1",
        percValue: 0.5,
        value: 50,
        class1: 0.25,
        numSketches: 2,
        class2: 0.25,
      },
      {
        groupId: "group2",
        percValue: 0.6,
        value: 60,
        class1: 0.3,
        numSketches: 1,
        class2: 0.3,
      },
      {
        groupId: "group3",
        percValue: 0.7,
        value: 70,
        class1: 0.35,
        numSketches: 2,
        class2: 0.35,
      },
    ];

    expect(rows).toEqual(answer);
  });
});

test("flattenByGroupSketch", async () => {
  const rows = flattenByGroupSketchAllClass(
    sketches,
    groupMetrics,
    PRECALC_TOTALS
  );

  const answer = [
    {
      groupId: "group1",
      sketchId: "AAAA",
      value: 30,
      percValue: 0.3,
      class1: 0.15,
      class2: 0.15,
    },
    {
      groupId: "group1",
      sketchId: "BBBB",
      value: 40,
      percValue: 0.4,
      class1: 0.2,
      class2: 0.2,
    },
    {
      groupId: "group2",
      sketchId: "DDDD",
      value: 60,
      percValue: 0.6,
      class1: 0.3,
      class2: 0.3,
    },
    {
      groupId: "group3",
      sketchId: "AAAA",
      value: 20,
      percValue: 0.2,
      class2: 0.2,
    },
    {
      groupId: "group3",
      sketchId: "DDDD",
      value: 15,
      percValue: 0.15,
      class2: 0.15,
    },
  ];

  expect(rows).toEqual(answer);
});

test("nestMetrics", async () => {
  const result = nestMetrics(
    groupMetrics.filter((m) => m.sketchId === "AAAA"),
    ["sketchId", "classId", "groupId"]
  );

  const answer = {
    AAAA: {
      class1: {
        group1: [
          {
            groupId: "group1",
            classId: "class1",
            metricId: "metric1",
            sketchId: "AAAA",
            geographyId: null,
            value: 15,
          },
        ],
      },
      class2: {
        group1: [
          {
            groupId: "group1",
            classId: "class2",
            metricId: "metric1",
            sketchId: "AAAA",
            geographyId: null,
            value: 15,
          },
        ],
        group3: [
          {
            groupId: "group3",
            classId: "class2",
            metricId: "metric1",
            sketchId: "AAAA",
            geographyId: null,
            value: 20,
          },
        ],
      },
    },
  };

  expect(result).toEqual(answer);
});
