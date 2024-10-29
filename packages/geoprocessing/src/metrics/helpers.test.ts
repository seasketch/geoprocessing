import {
  flattenByGroupAllClass,
  flattenByGroupSketchAllClass,
  flattenBySketchAllClass,
  nestMetrics,
  createMetric,
  packMetrics,
  unpackMetrics,
  isMetric,
  isMetricArray,
  rekeyMetrics,
  MetricProperties,
} from "./helpers.js";
import { NullSketch, NullSketchCollection, Metric } from "../types/index.js";
import {
  hasOwnProperty,
  toPercentMetric,
  toSketchPropertiesArray,
} from "../../client-core.js";
import deepEqual from "fast-deep-equal";

const metricName = "metric1";

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
    metricId: metricName,
    value: 100,
  }),
  createMetric({
    classId: "class1",
    metricId: metricName,
    value: 100,
  }),
  createMetric({
    classId: "class2",
    metricId: metricName,
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
    metricId: metricName,
    sketchId: sketchAId,
    value: 10,
    classId: "class1",
  }),
  createMetric({
    metricId: metricName,
    sketchId: sketchBId,
    value: 20,
    classId: "class1",
  }),
  createMetric({
    metricId: metricName,
    sketchId: sketchDId,
    value: 40,
    classId: "class1",
  }),
  createMetric({
    metricId: metricName,
    sketchId: collectionId,
    value: 30,
    classId: "class1",
  }),
  createMetric({
    metricId: metricName,
    sketchId: sketchAId,
    value: 40,
    classId: "class2",
  }),
  createMetric({
    metricId: metricName,
    sketchId: sketchBId,
    value: 50,
    classId: "class2",
  }),
  createMetric({
    metricId: metricName,
    sketchId: sketchDId,
    value: 60,
    classId: "class2",
  }),
  createMetric({
    metricId: metricName,
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
    metricId: metricName,
    sketchId: collectionId,
    value: 25,
  }),
  createMetric({
    groupId: "group2",
    classId: "class1",
    metricId: metricName,
    sketchId: collectionId,
    value: 30,
  }),
  createMetric({
    groupId: "group3",
    classId: "class1",
    metricId: metricName,
    sketchId: collectionId,
    value: 35,
  }),
  createMetric({
    groupId: "group1",
    classId: "class2",
    metricId: metricName,
    sketchId: collectionId,
    value: 25,
  }),
  createMetric({
    groupId: "group2",
    classId: "class2",
    metricId: metricName,
    sketchId: collectionId,
    value: 30,
  }),
  createMetric({
    groupId: "group3",
    classId: "class2",
    metricId: metricName,
    sketchId: collectionId,
    value: 35,
  }),
  // sketch class 1
  createMetric({
    groupId: "group1",
    classId: "class1",
    metricId: metricName,
    sketchId: sketchAId,
    value: 15,
  }),
  createMetric({
    groupId: "group1",
    classId: "class1",
    metricId: metricName,
    sketchId: sketchBId,
    value: 20,
  }),
  createMetric({
    groupId: "group2",
    classId: "class1",
    metricId: metricName,
    sketchId: sketchDId,
    value: 30,
  }),
  // sketch class 2
  createMetric({
    groupId: "group1",
    classId: "class2",
    metricId: metricName,
    sketchId: sketchAId,
    value: 15,
  }),
  createMetric({
    groupId: "group1",
    classId: "class2",
    metricId: metricName,
    sketchId: sketchBId,
    value: 20,
  }),
  createMetric({
    groupId: "group2",
    classId: "class2",
    metricId: metricName,
    sketchId: sketchDId,
    value: 30,
  }),
  // sketch class 3
  createMetric({
    groupId: "group3",
    classId: "class2",
    metricId: metricName,
    sketchId: sketchAId,
    value: 20,
  }),
  createMetric({
    groupId: "group3",
    classId: "class2",
    metricId: metricName,
    sketchId: sketchDId,
    value: 15,
  }),
];

describe("Metric checks", () => {
  test("isMetric", async () => {
    const trueMetric = metrics[0];
    trueMetric.extra = { big: "fish" };
    expect(isMetric(trueMetric)).toBe(true);
  });

  test("isMetric false", async () => {
    const falseMetric = { value: 15 };
    expect(isMetric(falseMetric)).toBe(false);
    const falseMetric2 = createMetric({ value: 15 });
    //@ts-expect-error not allowed to assign undefined but we will force it
    falseMetric2.groupId = undefined;
    expect(isMetric(falseMetric2)).toBe(false);
  });

  test("isMetricArray", async () => {
    expect(isMetricArray(metrics)).toBe(true);
  });
});

test("rekeyMetrics", async () => {
  const metrics = [createMetric({ value: 10 })];
  const rekeyed = rekeyMetrics(metrics);
  expect(rekeyed.length).toBe(1);
  const keys = Object.keys(rekeyed[0]);
  expect(keys.length).toBeLessThanOrEqual(MetricProperties.length);

  // Add test of correct key order
});

describe("MetricPack", () => {
  test("Can pack and unpack metrics", async () => {
    const metrics: Metric[] = [
      createMetric({
        metricId: metricName,
        sketchId: sketchAId,
        value: 10,
        classId: "class1",
      }),
      createMetric({
        metricId: metricName,
        sketchId: sketchBId,
        value: 20,
        classId: "class1",
      }),
    ];

    const packed = packMetrics(metrics);
    expect(hasOwnProperty(packed, "dimensions")).toBe(true);
    expect(hasOwnProperty(packed, "data")).toBe(true);
    expect(packed.dimensions).toHaveLength(6);
    expect(packed.data).toHaveLength(2);
    expect(packed.data[0]).toHaveLength(6);

    const unpacked = unpackMetrics(packed);
    expect(unpacked).toHaveLength(metrics.length);
  });

  test("Can pack and unpack metrics with extra", async () => {
    const metrics = [
      createMetric({
        value: 15,
        extra: { big: "fish" },
      }),
    ];
    const packed = packMetrics(metrics);
    expect(hasOwnProperty(packed, "dimensions")).toBe(true);
    expect(hasOwnProperty(packed, "data")).toBe(true);
    expect(packed.dimensions).toHaveLength(7);
    expect(packed.data).toHaveLength(1);
    expect(packed.data[0]).toHaveLength(7);

    const unpacked = unpackMetrics(packed);
    expect(unpacked).toHaveLength(metrics.length);
    expect(unpacked[0].value).toEqual(15);
    expect(unpacked[0]?.extra?.big).toEqual("fish");
  });
});

test("MetricPack", async () => {
  const metrics: Metric[] = [
    {
      metricId: "ousPeopleCount",
      sketchId: "16624",
      classId: "saomiguel",
      groupId: null,
      geographyId: null,
      value: 102,
    },
  ];
  const packed = packMetrics(metrics);
  expect(hasOwnProperty(packed, "dimensions")).toBe(true);
  expect(hasOwnProperty(packed, "data")).toBe(true);
  expect(packed.dimensions).toHaveLength(6);
  expect(packed.data).toHaveLength(1);
  expect(packed.data[0]).toHaveLength(6);

  const unpacked = unpackMetrics(packed);
  // console.log("unpacked", JSON.stringify(unpacked, null, 2));
  expect(deepEqual(metrics, unpacked)).toBe(true);
});

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

    const rows = flattenBySketchAllClass(
      metrics,
      CLASSES,
      toSketchPropertiesArray(sketches),
    );
    expect(rows).toEqual(answer);
  });

  test("toPercentMetric - basic", async () => {
    const percMetrics = toPercentMetric(
      [
        createMetric({
          groupId: "group1",
          classId: "nearshore",
          metricId: metricName,
          sketchId: collectionId,
          value: 25,
        }),
      ],
      [
        createMetric({
          groupId: "group1",
          classId: "nearshore",
          metricId: metricName,
          sketchId: collectionId,
          value: 100,
        }),
      ],
      {
        debug: false,
      },
    );
    for (const m of percMetrics) {
      expect(m.value).toEqual(0.25);
      expect(m.classId).toEqual("nearshore");
    }
  });

  test("toPercentMetric - zero denominator value produces NaN", async () => {
    const percMetrics = toPercentMetric(
      [
        createMetric({
          groupId: "group1",
          classId: "nearshore",
          metricId: metricName,
          sketchId: collectionId,
          value: 25,
        }),
      ],
      [
        createMetric({
          groupId: "group1",
          classId: "nearshore",
          metricId: metricName,
          sketchId: collectionId,
          value: 0,
        }),
      ],
      {
        debug: false,
      },
    );
    for (const m of percMetrics) {
      expect(m.value).toEqual(Number.NaN);
      expect(m.classId).toEqual("nearshore");
    }
  });

  test("toPercentMetric - set new percent metric ID", async () => {
    const percMetricName = `${metricName}Perc`;
    const percMetrics = toPercentMetric(groupMetrics, PRECALC_TOTALS, {
      metricIdOverride: percMetricName,
    });
    for (const m of percMetrics) expect(m.metricId).toEqual(percMetricName);
  });

  test("toPercentMetric - set alternative idProperty", async () => {
    const percMetrics = toPercentMetric(
      [
        createMetric({
          groupId: "group1",
          geographyId: "nearshore",
          metricId: metricName,
          sketchId: collectionId,
          value: 25,
        }),
      ],
      [
        createMetric({
          groupId: "group1",
          geographyId: "nearshore",
          metricId: metricName,
          sketchId: collectionId,
          value: 100,
        }),
      ],
      {
        idProperty: "geographyId",
      },
    );
    for (const m of percMetrics) {
      expect(m.value).toEqual(0.25);
      expect(m.geographyId).toEqual("nearshore");
    }
  });

  test("flattenByGroup - single class", async () => {
    const rows = flattenByGroupAllClass(
      collection,
      groupMetrics,
      PRECALC_TOTALS,
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
    PRECALC_TOTALS,
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
    ["sketchId", "classId", "groupId"],
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
