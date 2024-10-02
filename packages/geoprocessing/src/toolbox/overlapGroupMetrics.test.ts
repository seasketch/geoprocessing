import { describe, test, expect } from "vitest";
import {
  overlapAreaGroupMetrics,
  overlapFeaturesGroupMetrics,
  overlapRasterGroupMetrics,
} from "./overlapGroupMetrics.js";
import {
  SketchCollection,
  Polygon,
  Metric,
  Sketch,
  Feature,
} from "../types/index.js";
import parseGeoraster from "georaster";
import { toFeaturePolygonArray } from "../helpers/index.js";

const sketch: SketchCollection<Polygon> = {
  type: "FeatureCollection",
  bbox: [0, 1, 2, 3, 4, 5],
  properties: {
    id: "62055ac79557604f3e5f6d44",
    name: "Vitoria",
    updatedAt: "2022-02-10T18:34:55.228Z",
    createdAt: "2022-02-10T18:34:47.071Z",
    sketchClassId: "5f46dd57017aa0388f5f87cd",
    isCollection: true,
    userAttributes: [],
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-27.107_909_111_327_78, 38.800_381_987_950_416],
            [-27.081_596_640_891_68, 38.828_804_888_015_95],
            [-27.028_258_232_421_5, 38.803_592_671_882_186],
            [-26.971_953_300_780_854, 38.787_537_805_603_35],
            [-26.999_419_121_093_36, 38.755_417_224_646_195],
            [-27.046_111_015_624_632, 38.763_984_127_067_45],
            [-27.107_909_111_327_78, 38.800_381_987_950_416],
          ],
        ],
        bbox: [
          -27.107_909_111_327_78, 38.755_417_224_646_195,
          -26.971_953_300_780_854, 38.828_804_888_015_95,
        ],
      },
      properties: {
        id: "62055aac9557604f3e5f6d3e",
        name: "VitoriaNorth",
        updatedAt: "2022-02-10T18:34:52.380Z",
        createdAt: "2022-02-10T18:34:20.755Z",
        sketchClassId: "5f46dd53017aa0388f5f87c5",
        isCollection: false,
        userAttributes: [],
      },
      id: "1",
      bbox: [
        -27.107_909_111_327_78, 38.755_417_224_646_195, -26.971_953_300_780_854,
        38.828_804_888_015_95,
      ],
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-26.980_193_046_874_607, 38.728_639_026_682_224],
            [-26.989_806_083_983_986, 38.710_424_116_716_4],
            [-27.037_871_269_530_88, 38.710_424_116_716_4],
            [-27.043_364_433_593_382, 38.721_139_331_876_81],
            [-27.058_470_634_765_26, 38.720_067_882_647_086],
            [-27.054_350_761_718_386, 38.725_424_968_153_256],
            [-27.015_898_613_280_87, 38.728_639_026_682_224],
            [-26.980_193_046_874_607, 38.728_639_026_682_224],
          ],
        ],
        bbox: [
          -27.058_470_634_765_26, 38.710_424_116_716_4, -26.980_193_046_874_607,
          38.728_639_026_682_224,
        ],
      },
      properties: {
        id: "62055ac19557604f3e5f6d43",
        name: "VitoriaSouth",
        updatedAt: "2022-02-10T18:34:55.230Z",
        createdAt: "2022-02-10T18:34:41.007Z",
        sketchClassId: "5f46dd53017aa0388f5f87c5",
        isCollection: false,
        userAttributes: [],
      },
      id: "2",
      bbox: [
        -27.058_470_634_765_26, 38.710_424_116_716_4, -26.980_193_046_874_607,
        38.728_639_026_682_224,
      ],
    },
  ],
};

const sketchIdToGroupId = {
  "62055aac9557604f3e5f6d3e": "Highly Protected Area",
  "62055ac19557604f3e5f6d43": "Moderately Protected Area",
};

const protectionLevels = [
  "Fully Protected Area",
  "Highly Protected Area",
  "Moderately Protected Area",
  "Poorly Protected Area",
  "Unprotected Area",
];

const areaMetrics: Metric[] = [
  {
    metricId: "areaOverlap",
    value: 46_019_945.501_337_26,
    classId: "eez",
    groupId: null,
    geographyId: null,
    sketchId: "62055aac9557604f3e5f6d3e",
    extra: { sketchName: "VitoriaNorth" },
  },
  {
    metricId: "areaOverlap",
    value: 10_335_531.293_751_433,
    classId: "eez",
    groupId: null,
    geographyId: null,
    sketchId: "62055ac19557604f3e5f6d43",
    extra: { sketchName: "VitoriaSouth" },
  },
  {
    metricId: "areaOverlap",
    value: 56_355_476.795_085_385,
    classId: "eez",
    groupId: null,
    geographyId: null,
    sketchId: "62055ac79557604f3e5f6d44",
    extra: { sketchName: "Vitoria", isCollection: true },
  },
];
const STUDY_REGION_AREA_SQ_METERS = 1_000_000_000_000;

const metricToLevel = (sketchMetric: Metric) => {
  return sketchIdToGroupId[sketchMetric.sketchId!];
};

describe("overlapAreaGroupMetrics", () => {
  test("function is present", () => {
    expect(typeof overlapAreaGroupMetrics).toBe("function");
  });

  test("overlapAreaGroupMetrics - protection level", async () => {
    const metrics = await overlapAreaGroupMetrics({
      metricId: "areaOverlap",
      groupIds: protectionLevels,
      sketch,
      metricToGroup: metricToLevel,
      metrics: areaMetrics,
      classId: "eez",
      outerArea: STUDY_REGION_AREA_SQ_METERS,
    });

    expect(metrics.length).toEqual(7);

    // Expect one group metric for each sketch feature
    expect(
      metrics.filter(
        (m) =>
          m.sketchId === "62055ac19557604f3e5f6d43" &&
          m.groupId === "Moderately Protected Area",
      ).length,
    ).toBe(1);
    expect(
      metrics.filter(
        (m) =>
          m.sketchId === "62055aac9557604f3e5f6d3e" &&
          m.groupId === "Highly Protected Area",
      ).length,
    ).toBe(1);

    // Test collection level metrics.  Expect one metric per protection level
    const collGroupMetrics = metrics.filter(
      (m) => m.sketchId === sketch.properties.id,
    );
    expect(collGroupMetrics.length).toBe(5);

    // Only protection levels with a sketch in it, will have a collection level metric value > 0
    for (const level of protectionLevels) {
      const curLevelMetrics = collGroupMetrics.filter(
        (m) => m.groupId === level,
      );
      expect(curLevelMetrics.length).toBe(1);
      const curLevelMetric = curLevelMetrics[0];
      if (
        curLevelMetric.groupId === "Highly Protected Area" ||
        curLevelMetric.groupId === "Moderately Protected Area"
      ) {
        expect(curLevelMetric.value).toBeGreaterThan(0);
      } else {
        expect(curLevelMetric.value).toBe(0);
      }
    }
  });

  test("function is present", () => {
    expect(typeof overlapFeaturesGroupMetrics).toBe("function");
  });

  test("overlapFeaturesGroupMetrics", async () => {
    const featMetrics: Metric[] = [
      {
        metricId: "test",
        value: 46_020_431.777_366,
        classId: "world",
        groupId: null,
        geographyId: null,
        sketchId: "62055aac9557604f3e5f6d3e",
        extra: { sketchName: "VitoriaNorth" },
      },
      {
        metricId: "test",
        value: 10_335_615.297_27,
        classId: "world",
        groupId: null,
        geographyId: null,
        sketchId: "62055ac19557604f3e5f6d43",
        extra: { sketchName: "VitoriaSouth" },
      },
      {
        metricId: "test",
        value: 56_356_047.074_636,
        classId: "world",
        groupId: null,
        geographyId: null,
        sketchId: "62055ac79557604f3e5f6d44",
        extra: { sketchName: "Vitoria", isCollection: true },
      },
    ];
    const features = toFeaturePolygonArray(sketch);
    const featuresByClass: Record<string, Feature<Polygon>[]> = {
      world: features as Feature<Polygon>[],
    };

    const metrics = await overlapFeaturesGroupMetrics({
      metricId: "featuresOverlap",
      groupIds: protectionLevels,
      sketch,
      metricToGroup: metricToLevel,
      metrics: featMetrics,
      featuresByClass: featuresByClass,
    });

    expect(metrics.length).toEqual(protectionLevels.length);
  });

  test("function is present", () => {
    expect(typeof overlapRasterGroupMetrics).toBe("function");
  });

  test("overlapRasterGroupMetrics", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 1],
          [1, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      },
    );

    const wholePoly: Sketch<Polygon> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2, 2],
            [2, 20],
            [20, 20],
            [20, 2],
            [2, 2],
          ],
        ],
      },
      properties: {
        id: "62055aac9557604f3e5f6d3e",
        name: "VitoriaNorth",
        updatedAt: "2022-02-10T18:34:52.380Z",
        createdAt: "2022-02-10T18:34:20.755Z",
        sketchClassId: "5f46dd53017aa0388f5f87c5",
        isCollection: false,
        userAttributes: [],
      },
    };

    const rasterMetrics = [
      {
        metricId: "rasterOverlap",
        value: 4,
        classId: "eez",
        groupId: null,
        geographyId: null,
        sketchId: "62055aac9557604f3e5f6d3e",
        extra: { sketchName: "VitoriaNorth" },
      },
    ];

    const metrics = await overlapRasterGroupMetrics({
      metricId: "rasterOverlap",
      groupIds: protectionLevels,
      sketch: wholePoly,
      metricToGroup: metricToLevel,
      metrics: rasterMetrics,
      featuresByClass: { eez: raster },
    });

    // Test collection level metrics.  Expect one metric per protection level
    expect(metrics.length).toEqual(protectionLevels.length);

    // Only "High Protection" should have a value > 0
    for (const level of protectionLevels) {
      const curLevelMetrics = metrics.filter((m) => m.groupId === level);
      expect(curLevelMetrics.length).toBe(1);
      const curLevelMetric = curLevelMetrics[0];
      if (curLevelMetric.groupId === "Highly Protected Area") {
        expect(curLevelMetric.value).toBeGreaterThan(0);
      } else {
        expect(curLevelMetric.value).toBe(0);
      }
    }
  });
});
