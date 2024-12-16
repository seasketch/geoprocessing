import { describe, test, expect } from "vitest";
import { overlapPolygonArea } from "./overlapPolygonArea.js";
import { area } from "@turf/turf";
import squareFix from "../testing/fixtures/squareSketches.js";
import skFix from "../testing/fixtures/sketches.js";
import { firstMatchingMetric } from "../metrics/index.js";
import { testWithinPerc } from "../testing/index.js";

describe("overlapPolygonArea", () => {
  test("function is present", () => {
    expect(typeof overlapPolygonArea).toBe("function");
  });

  test("overlapPolygonArea - sketch polygon fully inside", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [squareFix.twoByPoly],
      squareFix.insideTwoByPolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(squareFix.insideTwoByPolySketch));
  });

  test("overlapPolygonArea - two overlapping features should not affect result", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [squareFix.twoByPoly, squareFix.twoByPoly],
      squareFix.insideTwoByPolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(area(squareFix.insideTwoByPolySketch));
  });

  test("overlapPolygonArea - sketch collection with overlapping sketches should not count overlapping area", async () => {
    const metrics = await overlapPolygonArea(
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

  test("overlapPolygonArea - sketch collection with overlapping sketches will double count if allowed", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [squareFix.twoByPoly],
      squareFix.overlapCollection,
      { includeChildMetrics: false, solveOverlap: false },
    );
    const expectedArea =
      area(squareFix.insideTwoByPolySketch) +
      area(squareFix.halfInsideTwoBySketchPoly);
    expect(metrics[0].value).toBeCloseTo(expectedArea);
  });

  test("overlapPolygonArea - sketch polygon fully inside - truncation", async () => {
    const metricsNoTruncation = await overlapPolygonArea(
      "test",
      [squareFix.tiny],
      squareFix.insideTwoByPolySketch,
      {
        truncate: false,
      },
    );
    expect(metricsNoTruncation[0].value).toBe(0.012_364_345_868_141_814);

    const metricsTruncation = await overlapPolygonArea(
      "test",
      [squareFix.tiny],
      squareFix.insideTwoByPolySketch,
      {
        truncate: true,
      },
    );
    expect(metricsTruncation[0].value).toBe(0.012_364);

    const metricsTruncationDefault = await overlapPolygonArea(
      "test",
      [squareFix.tiny],
      squareFix.insideTwoByPolySketch,
    );
    expect(metricsTruncationDefault[0].value).toBe(0.012_364);
  });

  test("overlapPolygonArea - sketch multipolygon fully inside", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [squareFix.twoByPoly],
      squareFix.insideTwoByMultipolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(
      area(squareFix.insideTwoByMultipolySketch),
    );
  });

  test("overlapPolygonArea - multipolygon both arguments", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [squareFix.insideTwoByMultipolySketch],
      squareFix.insideTwoByMultipolySketch,
    );
    expect(metrics[0].value).toBeCloseTo(
      area(squareFix.insideTwoByMultipolySketch),
    );
  });

  test.skip("overlapPolygonArea - sketch polygon half inside", async () => {
    const metrics = await overlapPolygonArea(
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

  test("overlapPolygonArea - should not count holes", async () => {
    // console.log(JSON.stringify(sk.holeBlPoly));
    const metrics = await overlapPolygonArea(
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

  test("overlapPolygonArea - sketch polygon fully outside should have zero area", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [squareFix.twoByPoly],
      squareFix.outsideTwoByPolyTopRightSketch,
    );
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapPolygonArea - mixed poly sketch collection fully inside", async () => {
    const metrics = await overlapPolygonArea(
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
    const percs = [0.5, 1, 1]; // the poly and multipoly overlap 100% so overlapPolygonArea area should be half
    for (const [index, curSketchId] of ids.entries()) {
      // console.log("index", index);
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index],
      );
    }
  });

  test("overlapPolygonArea - sketch collection half inside", async () => {
    const metrics = await overlapPolygonArea(
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

  /**
   * Zero polygon geometry sketch is generated by functions like clipToGeography in place of creating a null geometry
   * sketch, because turf and other libraries types don't handle null geometry well. With
   * a null geometry, toolbox functions will see that it has no overlap with any sketches (unless planning is occuring on null island)
   */
  test("overlapPolygonArea - test that zero geometry sketch returns zero value metric", async () => {
    const metrics = await overlapPolygonArea(
      "test",
      [skFix.topRightPoly],
      skFix.zero,
    );
    expect(metrics.length).toBe(1);
    for (const metric of metrics) {
      expect(metric.value).toBe(0);
    }
  });
});
