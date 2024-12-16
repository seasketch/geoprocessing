import { describe, test, expect } from "vitest";
import { overlapPolygonSum } from "./overlapPolygonSum.js";
import squareFix from "../testing/fixtures/squareSketches.js";
import skFix from "../testing/fixtures/sketches.js";
import { firstMatchingMetric } from "../metrics/helpers.js";

describe("overlapPolygonSum", () => {
  test("function is present", () => {
    expect(typeof overlapPolygonSum).toBe("function");
  });

  test("overlapPolygonSum - sketch polygon fully outside should have zero sum", async () => {
    const metrics = await overlapPolygonSum(
      "test",
      [squareFix.twoByPoly],
      squareFix.outsideTwoByPolyTopRightSketch,
    );
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapPolygonSum - sketch collection three polygons inside, one is duplicate and should still count", async () => {
    const metrics = await overlapPolygonSum(
      "test",
      [squareFix.twoByPoly],
      squareFix.overlapCollection, // two sketches, one fully inside, one half inside twoByPoly
    );
    expect(metrics.length).toEqual(4);
    for (const metric of metrics) {
      expect(metric.value).toBe(1);
    }
  });

  test("overlapPolygonSum - sketch collection, inside should count, outside should not", async () => {
    const metrics = await overlapPolygonSum(
      "test",
      [squareFix.twoByPoly],
      squareFix.insideOutsideCollection, // two sketches, one fully inside, one half inside twoByPoly
    );
    expect(metrics.length).toEqual(3);
    expect(
      firstMatchingMetric(
        metrics,
        (m) => m.sketchId === squareFix.insideTwoByPolySketch.properties.id,
      ).value,
    ).toBe(1);
    expect(
      firstMatchingMetric(
        metrics,
        (m) =>
          m.sketchId ===
          squareFix.outsideTwoByPolyBottomRightSketch.properties.id,
      ).value,
    ).toBe(0);
    expect(
      firstMatchingMetric(metrics, (m) => m.sketchId === "inside-out-coll")
        .value,
    ).toBe(1);
  });

  test("overlapPolygonSum - sketch collection two inside should both count", async () => {
    const metrics = await overlapPolygonSum(
      "test",
      [skFix.outer],
      skFix.twoPolyInsideSC,
    );
    expect(metrics.length).toBe(3);
    for (const metric of metrics) {
      expect(metric.value).toBe(1);
    }
  });

  test("overlapPolygonSum - sketch collection, sum property inside should count, outside should not", async () => {
    const metrics = await overlapPolygonSum(
      "test",
      [squareFix.twoByPoly],
      squareFix.insideOutsideCollection, // two sketches, one fully inside, one half inside twoByPoly
      { sumProperty: "width" },
    );
    console.log("metrics", JSON.stringify(metrics, null, 2));
    expect(metrics.length).toEqual(3);
    expect(
      firstMatchingMetric(
        metrics,
        (m) => m.sketchId === squareFix.insideTwoByPolySketch.properties.id,
      ).value,
    ).toBe(2);
    expect(
      firstMatchingMetric(
        metrics,
        (m) =>
          m.sketchId ===
          squareFix.outsideTwoByPolyBottomRightSketch.properties.id,
      ).value,
    ).toBe(0);
    expect(
      firstMatchingMetric(metrics, (m) => m.sketchId === "inside-out-coll")
        .value,
    ).toBe(2);
  });
});
