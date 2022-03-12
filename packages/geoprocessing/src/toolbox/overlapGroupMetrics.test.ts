/**
 * @group unit
 */

import { overlapAreaGroupMetrics } from "./overlapGroupMetrics";
import { SketchCollection, Polygon, Metric } from "..";

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
            [-27.10790911132778, 38.800381987950416],
            [-27.08159664089168, 38.82880488801595],
            [-27.0282582324215, 38.803592671882186],
            [-26.971953300780854, 38.78753780560335],
            [-26.99941912109336, 38.755417224646195],
            [-27.046111015624632, 38.76398412706745],
            [-27.10790911132778, 38.800381987950416],
          ],
        ],
        bbox: [
          -27.10790911132778, 38.755417224646195, -26.971953300780854,
          38.82880488801595,
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
        -27.10790911132778, 38.755417224646195, -26.971953300780854,
        38.82880488801595,
      ],
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-26.980193046874607, 38.728639026682224],
            [-26.989806083983986, 38.7104241167164],
            [-27.03787126953088, 38.7104241167164],
            [-27.043364433593382, 38.72113933187681],
            [-27.05847063476526, 38.720067882647086],
            [-27.054350761718386, 38.725424968153256],
            [-27.01589861328087, 38.728639026682224],
            [-26.980193046874607, 38.728639026682224],
          ],
        ],
        bbox: [
          -27.05847063476526, 38.7104241167164, -26.980193046874607,
          38.728639026682224,
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
        -27.05847063476526, 38.7104241167164, -26.980193046874607,
        38.728639026682224,
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
    value: 46019945.50133726,
    classId: "eez",
    groupId: null,
    geographyId: null,
    sketchId: "62055aac9557604f3e5f6d3e",
    extra: { sketchName: "VitoriaNorth" },
  },
  {
    metricId: "areaOverlap",
    value: 10335531.293751433,
    classId: "eez",
    groupId: null,
    geographyId: null,
    sketchId: "62055ac19557604f3e5f6d43",
    extra: { sketchName: "VitoriaSouth" },
  },
  {
    metricId: "areaOverlap",
    value: 56355476.795085385,
    classId: "eez",
    groupId: null,
    geographyId: null,
    sketchId: "62055ac79557604f3e5f6d44",
    extra: { sketchName: "Vitoria", isCollection: true },
  },
];
const STUDY_REGION_AREA_SQ_METERS = 1_000_000_000_000;

describe("overlapAreaGroupMetrics", () => {
  test("function is present", () => {
    expect(typeof overlapAreaGroupMetrics).toBe("function");
  });

  test("overlapAreaGroupMetrics - protection level", async () => {
    const metricToLevel = (sketchMetric: Metric) => {
      return sketchIdToGroupId[sketchMetric.sketchId!];
    };

    const metrics = await overlapAreaGroupMetrics({
      metricId: "areaOverlap",
      groupIds: protectionLevels,
      sketch,
      metricToGroup: metricToLevel,
      metrics: areaMetrics,
      classId: "eez",
      outerArea: STUDY_REGION_AREA_SQ_METERS,
    });

    console.log(metrics);
    expect(metrics.length).toEqual(7);

    // Expect one group metric for each sketch feature
    expect(
      metrics.filter(
        (m) =>
          m.sketchId === "62055ac19557604f3e5f6d43" &&
          m.groupId === "Moderately Protected Area"
      ).length
    ).toBe(1);
    expect(
      metrics.filter(
        (m) =>
          m.sketchId === "62055aac9557604f3e5f6d3e" &&
          m.groupId === "Highly Protected Area"
      ).length
    ).toBe(1);

    // Test collection level metrics.  Expect one metric per protection level
    const collGroupMetrics = metrics.filter(
      (m) => m.sketchId === sketch.properties.id
    );
    expect(collGroupMetrics.length).toBe(5);

    // Only protection levels with a sketch in it, will have a collection level metric value > 0
    protectionLevels.forEach((level) => {
      const curLevelMetrics = collGroupMetrics.filter(
        (m) => m.groupId === level
      );
      expect(curLevelMetrics.length).toBe(1);
      const curLevelMetric = curLevelMetrics[0];
      if (
        curLevelMetric.groupId === "Highly Protected Area" ||
        curLevelMetric.groupId === "Moderately Protected Area"
      ) {
        expect(curLevelMetric.value).toBeGreaterThan(0);
      } else {
        console.log(curLevelMetric);
        expect(curLevelMetric.value).toBe(0);
      }
    });
  });
});
