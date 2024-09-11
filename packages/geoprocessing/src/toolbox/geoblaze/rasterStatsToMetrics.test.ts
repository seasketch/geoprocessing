import { describe, test, expect } from "vitest";
import { rasterStatsToMetrics } from "./rasterStatsToMetrics.js";
import { StatsObject } from "../../types/index.js";
import deepEqual from "fast-deep-equal";

describe("rasterStatsToMetrics", () => {
  test("rasterStatsToMetrics - default sum", async () => {
    const stats: StatsObject[] = [{ sum: 1 }];
    const metrics = rasterStatsToMetrics(stats);
    expect(metrics.length).toEqual(1);
    expect(metrics[0]).toEqual({
      metricId: "sum",
      value: 1,
      classId: null,
      groupId: "band-0",
      geographyId: null,
      sketchId: null,
    });
  });

  test("rasterStatsToMetrics - default sum truncate", async () => {
    const stats: StatsObject[] = [{ sum: 1.920482389239823 }];
    const metrics = rasterStatsToMetrics(stats);
    expect(metrics.length).toEqual(1);
    expect(metrics[0]).toEqual({
      metricId: "sum",
      value: 1.920482,
      classId: null,
      groupId: "band-0",
      geographyId: null,
      sketchId: null,
    });
  });

  test("rasterStatsToMetrics - default sum with extra", async () => {
    const stats: StatsObject[] = [{ sum: 5 }];
    const metrics = rasterStatsToMetrics(stats, {
      metricPartial: {
        sketchId: "foo",
        extra: {
          a: "b",
        },
      },
    });
    expect(metrics.length).toEqual(1);
    expect(
      deepEqual(metrics[0], {
        metricId: "sum",
        value: 5,
        classId: null,
        groupId: "band-0",
        geographyId: null,
        sketchId: "foo",
        extra: {
          a: "b",
        },
      }),
    ).toBe(true);
  });

  test("rasterStatsToMetrics - multiple stats", async () => {
    const stats: StatsObject[] = [
      { count: 4, valid: 1, invalid: 3, min: 1, max: 1, sum: 1, mode: 1 },
    ];
    const metrics = rasterStatsToMetrics(stats);
    expect(metrics.length).toEqual(7);
    metrics.forEach((m) => {
      expect(m.value).toEqual(stats[0][m.metricId]);
    });
  });

  test("rasterStatsToMetrics - multiple bands default", async () => {
    const stats: StatsObject[] = [{ sum: 1 }, { sum: 2 }];
    const metrics = rasterStatsToMetrics(stats);
    expect(metrics.length).toEqual(2);
    metrics.forEach((m, i) => {
      expect(m.value).toEqual(stats[i][m.metricId]);
      expect(m.groupId).toEqual(`band-${i}`);
    });
  });

  test("rasterStatsToMetrics - multiple bands override", async () => {
    const stats: StatsObject[] = [{ sum: 1 }, { sum: 2 }];
    const bandGroups = ["mangroves", "coral"];
    const metrics = rasterStatsToMetrics(stats, {
      bandMetricProperty: "groupId",
      bandMetricValues: bandGroups,
    });
    expect(metrics.length).toEqual(2);
    metrics.forEach((m, i) => {
      expect(m.value).toEqual(stats[i][m.metricId]);
      expect(m.groupId).toEqual(bandGroups[i]);
    });
  });

  test("rasterStatsToMetrics - metricId override", async () => {
    const stats: StatsObject[] = [{ sum: 1 }];
    const metrics = rasterStatsToMetrics(stats, { metricId: "coral" });
    expect(metrics.length).toEqual(1);
    expect(metrics[0]).toEqual({
      metricId: "coral",
      value: 1,
      classId: null,
      groupId: "band-0",
      geographyId: null,
      sketchId: null,
    });
  });

  test("rasterStatsToMetrics - metricIdPrefix", async () => {
    const stats: StatsObject[] = [{ sum: 1 }];
    const metrics = rasterStatsToMetrics(stats, { metricIdPrefix: "coral-" });
    expect(metrics.length).toEqual(1);
    expect(metrics[0]).toEqual({
      metricId: "coral-sum",
      value: 1,
      classId: null,
      groupId: "band-0",
      geographyId: null,
      sketchId: null,
    });
  });
});
