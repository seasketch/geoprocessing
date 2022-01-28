/**
 * @group unit
 */

import { overlapFeatures } from "./overlapFeatures";
import area from "@turf/area";
import fix from "../testing/fixtures/squareSketches";
import { firstMatchingMetric } from "..";
import { testWithinPerc } from "../testing";

describe("overlapFeatures", () => {
  test("function is present", () => {
    expect(typeof overlapFeatures).toBe("function");
  });

  test("outerArea", () => {
    expect(fix.outerArea).toBeCloseTo(49558050527.3877);
  });
  test("outerOuterArea", () => {
    expect(fix.outerOuterArea).toBeCloseTo(198111444408.08057);
  });

  test("overlapFeatures - sketch polygon fully inside", async () => {
    const metrics = await overlapFeatures("test", [fix.outer], fix.sketch1);
    expect(metrics[0].value).toBeCloseTo(area(fix.sketch1));
  });

  test("overlapFeatures - sketch polygon half inside", async () => {
    const metrics = await overlapFeatures("test", [fix.outer], fix.sketch2);
    expect(metrics.length).toEqual(1);
    // overlap should be ~50% of original sketch area
    const areaOf2 = area(fix.sketch2);
    const percDiff = (metrics[0].value / (areaOf2 * 0.5)) % 1;
    expect(percDiff).toBeCloseTo(0);
  });

  test("overlapFeatures - sketch polygon fully outside", async () => {
    const metrics = await overlapFeatures("test", [fix.outer], fix.sketch3);
    expect(metrics.length).toEqual(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapFeatures - sketch collection half inside", async () => {
    const metrics = await overlapFeatures(
      "test",
      [fix.outer],
      fix.sketchCollection
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
    ids.forEach((curSketchId, index) => {
      testWithinPerc(
        firstMatchingMetric(metrics, (m) => m.sketchId === curSketchId).value,
        areas[index] * percs[index],
        { debug: true }
      );
    });
  });
});
