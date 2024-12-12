import { describe, test, expect } from "vitest";
import { overlapFeatures } from "./overlapFeatures.js";
import { area } from "@turf/turf";
import fix from "../testing/fixtures/squareSketches.js";
import sk from "../testing/fixtures/sketches.js";
import { firstMatchingMetric } from "../metrics/index.js";
import { testWithinPerc } from "../testing/index.js";

describe("overlapFeatures", () => {
  test("function is present", () => {
    expect(typeof overlapFeatures).toBe("function");
  });

  test("outerArea", () => {
    expect(fix.twoByPolyArea).toBeCloseTo(49_447_340_364.086_09);
  });
  test("outerOuterArea", () => {
    expect(fix.fourByPolyArea).toBeCloseTo(197_668_873_521.434_88);
  });

  test("overlapFeatures - sketch polygon fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.twoByPoly],
      fix.insideTwoByPolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(fix.insideTwoByPolySketch));
  });

  test("overlapFeatures - sketch polygon fully inside - truncation", async () => {
    const metricsNoTruncation = await overlapFeatures(
      "test",
      [fix.tiny],
      fix.insideTwoByPolySketch,
      {
        truncate: false,
      },
    );
    expect(metricsNoTruncation[0].value).toBe(0.012_364_345_868_141_814);

    const metricsTruncation = await overlapFeatures(
      "test",
      [fix.tiny],
      fix.insideTwoByPolySketch,
      {
        truncate: true,
      },
    );
    expect(metricsTruncation[0].value).toBe(0.012_364);

    const metricsTruncationDefault = await overlapFeatures(
      "test",
      [fix.tiny],
      fix.insideTwoByPolySketch,
    );
    expect(metricsTruncationDefault[0].value).toBe(0.012_364);
  });

  test("overlapFeatures - sketch multipolygon fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.twoByPoly],
      fix.insideTwoByMultipolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(fix.insideTwoByMultipolySketch));
  });

  test("overlapFeatures - multipolygon both arguments", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.insideTwoByMultipolySketch],
      fix.insideTwoByMultipolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(fix.insideTwoByMultipolySketch));
  });

  test.skip("overlapFeatures - sketch polygon half inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.twoByPoly],
      fix.halfInsideTwoBySketchPoly,
    );
    expect(metrics.length).toEqual(1);
    // overlap should be ~50% of original sketch area
    const areaOf2 = area(fix.halfInsideTwoBySketchPoly);
    const percDiff = (metrics[0].value / (areaOf2 * 0.5)) % 1;
    expect(percDiff).toBeCloseTo(0);
  });

  test("overlapFeatures - should not count holes", async () => {
    // console.log(JSON.stringify(sk.holeBlPoly));
    const metrics = await overlapFeatures(
      "test",
      [sk.wholePoly],
      sk.holeBlPoly,
    );

    // 3487699295400.2056 qgis area result
    // 3473074014471.342  turf is close

    expect(metrics.length).toEqual(1);
    // const wholeArea = area(sk.wholePoly);
    // console.log("wholeArea", wholeArea);
    const holeArea = area(sk.holeBlPoly);
    // console.log("holeArea", holeArea);
    const overlapArea = metrics[0].value;
    // console.log("overlapArea", overlapArea);
    const percDiff = Math.abs(overlapArea - holeArea) / holeArea;
    // console.log("percDiff", percDiff);
    expect(percDiff).toBeGreaterThan(0);
    expect(percDiff).toBeLessThan(1);
  });

  test("overlapFeatures - sketch polygon fully outside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.twoByPoly],
      fix.outsideTwoByPolyTopRightSketch,
    );
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapFeatures - mixed poly sketch collection fully inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.twoByPoly],
      fix.mixedPolySketchCollection,
    );
    expect(metrics.length).toBe(3);
    const ids = [
      fix.mixedCollectionId,
      ...fix.mixedPolySketchCollection.features.map((sk) => sk.properties.id),
    ];
    const areas = [
      area(fix.mixedPolySketchCollection),
      ...fix.mixedPolySketchCollection.features.map((sk) => area(sk)),
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
      [sk.outer],
      sk.twoPolyInsideSC,
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
      [fix.twoByPoly],
      fix.sketchCollection,
    );
    expect(metrics.length).toBe(4);
    const ids = [
      fix.collectionId,
      ...fix.sketchCollection.features.map((sk) => sk.properties.id),
    ];
    const areas = [
      area(fix.sketchCollection),
      ...fix.sketchCollection.features.map((sk) => area(sk)),
    ];
    const percs = [0.5, 1, 0.5, 0]; // expected percentage of sketch to overlap
    for (const [index, curSketchId] of ids.entries()) {
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index],
      );
    }
  });

  /**
   * Zero polygon geometry sketch is generated by functions like clipToGeography in place of creating a null geometry
   * sketh, because turf and other libraries types don't handle null geometry well. With
   * a null geometry, toolbox functions will see that it has no overlap with any sketches (unless planning is occuring on null island)
   */
  test("overlapFeatures - test that zero geometry sketch returns zero value metric", async () => {
    const metrics = await overlapFeatures("test", [sk.topRightPoly], sk.zero, {
      operation: "area",
    });
    expect(metrics.length).toBe(1);
    for (const metric of metrics) {
      expect(metric.value).toBe(0);
    }
  });
});
