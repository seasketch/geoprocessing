/**
 * @jest-environment node
 * @group unit
 */
import { rasterStatsToMetrics } from "./rasterStatsToMetrics";
import { StatsObject } from "../../types";
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
      groupId: null,
      geographyId: null,
      sketchId: null,
    });
  });

  test("rasterStatsToMetrics - default sum with extra", async () => {
    const stats: StatsObject[] = [{ sum: 5 }];
    const metrics = rasterStatsToMetrics(stats, {
      metricExtra: {
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
        groupId: null,
        geographyId: null,
        sketchId: "foo",
        extra: {
          a: "b",
        },
      })
    ).toBe(true);
  });

  test("rasterStatsToMetrics - multiple stats", async () => {
    const stats: StatsObject[] = [
      { count: 4, valid: 1, invalid: 3, min: 1, max: 1, sum: 1, mode: 1 },
    ];
    const metrics = rasterStatsToMetrics(stats);
    expect(metrics.length).toEqual(7);
    metrics.forEach((m, i) => {
      expect(m.value).toEqual(stats[0][m.metricId]);
    });
  });

  test("rasterStatsToMetrics - multiple bands", async () => {
    const stats: StatsObject[] = [{ sum: 1 }, { sum: 2 }];
    const metrics = rasterStatsToMetrics(stats);
    expect(metrics.length).toEqual(2);
    metrics.forEach((m, i) => {
      expect(m.value).toEqual(stats[i][m.metricId]);
    });
  });
});
