import { describe, test, expect } from "vitest";
import { firstMatchingMetric } from "../metrics/index.js";
import { area } from "./area.js";
import fix from "../testing/fixtures/squareSketches.js";

describe("area", () => {
  test("function is present", () => {
    expect(typeof area).toBe("function");
  });

  test("area - sketch polygon", async () => {
    const metrics = await area(fix.insideTwoByPolySketch);
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBeCloseTo(12_363_718_145.180_046);
  });

  test("area - sketch polygon set metric id", async () => {
    const metrics = await area(fix.insideTwoByPolySketch, {
      metricId: "specialArea",
    });
    expect(metrics.length).toBe(1);
    expect(metrics[0].metricId).toBe("specialArea");
  });

  test("area - collection, should have metric for area, but not areaPerc", async () => {
    const metrics = await area(fix.overlapCollection);
    const collMetrics = metrics.filter((m) => m.sketchId === "CCCC");
    expect(collMetrics.length).toBe(1);
    expect(collMetrics[0].metricId).toBe("area");
  });

  test("area - collection, should have child metrics, area and percArea", async () => {
    const metrics = await area(fix.overlapCollection, {
      includePercMetric: true,
    });

    const childMetrics = metrics.filter(
      (m) => m.sketchId !== "CCCC" && m.metricId === "area",
    );
    expect(childMetrics.length).toBe(fix.sketchCollection.features.length);

    const childPercMetrics = metrics.filter(
      (m) => m.sketchId !== "CCCC" && m.metricId === "areaPerc",
    );
    expect(childPercMetrics.length).toBe(fix.sketchCollection.features.length);
    expect(childPercMetrics[1].value).toEqual(childPercMetrics[2].value);
  });

  test("area - collection area should be less than sum of children due to second sketch cancelling third", async () => {
    const metrics = await area(fix.overlapCollection, {
      includePercMetric: true,
    });

    const childMetrics = metrics.filter(
      (m) => m.sketchId !== "CCCC" && m.metricId === "area",
    );
    const collMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC",
    );
    const childAreaSum = childMetrics.reduce(
      (sumSoFar, m) => m.value + sumSoFar,
      0,
    );

    expect(collMetric.value).toBeLessThan(childAreaSum);
    expect(collMetric.value).toEqual(
      childMetrics[0].value + childMetrics[1].value,
    );
  });
});
