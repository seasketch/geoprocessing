import { describe, test, expect } from "vitest";
import { overlapFeatures } from "./overlapFeatures.js";
import { area } from "@turf/turf";
import squareFix from "../testing/fixtures/squareSketches.js";
import skFix from "../testing/fixtures/sketches.js";
import { firstMatchingMetric } from "../metrics/index.js";
import { testWithinPerc } from "../testing/index.js";

describe("overlapFeatures", () => {
  test("function is present", () => {
    expect(typeof overlapFeatures).toBe("function");
  });

  test("outerArea", () => {
    expect(squareFix.twoByPolyArea).toBeCloseTo(49_447_340_364.086_09);
  });
  test("outerOuterArea", () => {
    expect(squareFix.fourByPolyArea).toBeCloseTo(197_668_873_521.434_88);
  });

  test("overlapFeatures - sketch polygon fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.insideTwoByPolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(squareFix.insideTwoByPolySketch));
  });

  test("overlapFeatures - two overlapping features should not affect result", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly, squareFix.twoByPoly],
      squareFix.insideTwoByPolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(squareFix.insideTwoByPolySketch));
  });

  test("overlapFeatures - sketch collection with overlapping sketches should not count overlapping area", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.overlapCollection,
      { includeChildMetrics: false },
    );
    const expectedArea =
      area(squareFix.insideTwoByPolySketch) +
      area(squareFix.halfInsideTwoBySketchPoly) / 2;
    expect(metrics[0].value).toBeCloseTo(expectedArea);
  });

  test("overlapFeatures - sketch polygon fully inside - truncation", async () => {
    const metricsNoTruncation = await overlapFeatures(
      "test",
      [squareFix.tiny],
      squareFix.insideTwoByPolySketch,
      {
        truncate: false,
      },
    );
    expect(metricsNoTruncation[0].value).toBe(0.012_364_345_868_141_814);

    const metricsTruncation = await overlapFeatures(
      "test",
      [squareFix.tiny],
      squareFix.insideTwoByPolySketch,
      {
        truncate: true,
      },
    );
    expect(metricsTruncation[0].value).toBe(0.012_364);

    const metricsTruncationDefault = await overlapFeatures(
      "test",
      [squareFix.tiny],
      squareFix.insideTwoByPolySketch,
    );
    expect(metricsTruncationDefault[0].value).toBe(0.012_364);
  });

  test("overlapFeatures - sketch multipolygon fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.insideTwoByMultipolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(
      area(squareFix.insideTwoByMultipolySketch),
    );
  });

  test("overlapFeatures - multipolygon both arguments", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.insideTwoByMultipolySketch],
      squareFix.insideTwoByMultipolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(
      area(squareFix.insideTwoByMultipolySketch),
    );
  });

  test.skip("overlapFeatures - sketch polygon half inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.halfInsideTwoBySketchPoly,
    );
    expect(metrics.length).toEqual(1);
    // overlap should be ~50% of original sketch area
    const areaOf2 = area(squareFix.halfInsideTwoBySketchPoly);
    const percDiff = (metrics[0].value / (areaOf2 * 0.5)) % 1;
    expect(percDiff).toBeCloseTo(0);
  });

  test("overlapFeatures - should not count holes", async () => {
    // console.log(JSON.stringify(sk.holeBlPoly));
    const metrics = await overlapFeatures(
      "test",
      [skFix.wholePoly],
      skFix.holeBlPoly,
    );

    // 3487699295400.2056 qgis area result
    // 3473074014471.342  turf is close

    expect(metrics.length).toEqual(1);
    // const wholeArea = area(sk.wholePoly);
    // console.log("wholeArea", wholeArea);
    const holeArea = area(skFix.holeBlPoly);
    // console.log("holeArea", holeArea);
    const overlapArea = metrics[0].value;
    // console.log("overlapArea", overlapArea);
    const percDiff = Math.abs(overlapArea - holeArea) / holeArea;
    // console.log("percDiff", percDiff);
    expect(percDiff).toBeGreaterThan(0);
    expect(percDiff).toBeLessThan(1);
  });

  test("overlapFeatures - sketch polygon fully outside should have zero area", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.outsideTwoByPolyTopRightSketch,
    );
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapFeatures - sketch polygon fully outside should have zero sum", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.outsideTwoByPolyTopRightSketch,
      { operation: "sum" },
    );
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapFeatures - mixed poly sketch collection fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.mixedPolySketchCollection,
    );
    expect(metrics.length).toBe(3);
    const ids = [
      squareFix.mixedCollectionId,
      ...squareFix.mixedPolySketchCollection.features.map(
        (sk) => sk.properties.id,
      ),
    ];
    const areas = [
      area(squareFix.mixedPolySketchCollection),
      ...squareFix.mixedPolySketchCollection.features.map((sk) => area(sk)),
    ];
    const percs = [0.5, 1, 1]; // the poly and multipoly overlap 100% so overlapFeatures area should be half
    for (const [index, curSketchId] of ids.entries()) {
      // console.log("index", index);
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index],
      );
    }
  });

  test("overlapFeatures - sketch collection two inside polys SUM", async () => {
    // Two sketches in sketch collection, both within feature.
    // Individual sketches and sketch collection metrics should all list 1 as sum
    // Tests that features aren't being double counted.

    const metrics = await overlapFeatures(
      "test",
      [skFix.outer],
      skFix.twoPolyInsideSC,
      { operation: "sum" },
    );
    expect(metrics.length).toBe(3);
    for (const metric of metrics) {
      expect(metric.value).toBe(1);
    }
  });

  test("overlapFeatures - sketch collection half inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [squareFix.twoByPoly],
      squareFix.sketchCollection,
    );
    expect(metrics.length).toBe(4);
    const ids = [
      squareFix.collectionId,
      ...squareFix.sketchCollection.features.map((sk) => sk.properties.id),
    ];
    const areas = [
      area(squareFix.sketchCollection),
      ...squareFix.sketchCollection.features.map((sk) => area(sk)),
    ];
    const percs = [0.5, 1, 0.5, 0]; // expected percentage of sketch to overlap
    for (const [index, curSketchId] of ids.entries()) {
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index],
      );
    }
  });
});
