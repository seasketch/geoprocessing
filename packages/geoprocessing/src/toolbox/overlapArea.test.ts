/**
 * @group unit
 */

import { firstMatchingMetric } from "../metrics";
import { overlapArea, overlapSubarea } from "./overlapArea";
import area from "@turf/area";
import fix from "../testing/fixtures/squareSketches";

describe("Area stats tool", () => {
  test("function is present", () => {
    expect(typeof overlapArea).toBe("function");
  });

  test("outerArea", () => {
    expect(fix.outerArea).toBeCloseTo(49558050527.3877);
  });
  test("outerOuterArea", () => {
    expect(fix.outerOuterArea).toBeCloseTo(198111444408.08057);
  });

  // sketch always assumed to be within outer boundary.  outerArea is passed as pre-calculated area avoiding need to compute it on the fly
  test("overall - single polygon fully inside", async () => {
    const metrics = await overlapArea("test", fix.sketch1, fix.outerArea);
    expect(metrics[0].value).toBeCloseTo(12391399902.071104);
    expect(metrics[1].value).toBeCloseTo(0.25); // takes up bottom left quadrant of outer
  });
  test("subarea intersect - single polygon fully inside", async () => {
    const metrics = await overlapSubarea("test", fix.sketch1, fix.outer);
    expect(metrics[0].value).toBeCloseTo(12391399902.071104);
    expect(metrics[1].value).toBeCloseTo(0.25);
  });

  test("subarea difference - single polygon fully inside", async () => {
    const metrics = await overlapSubarea("test", fix.sketch1, fix.outer, {
      operation: "difference",
      outerArea: fix.outerArea,
    });
    expect(metrics[0].value).toBeCloseTo(0);
    expect(metrics[1].value).toBeCloseTo(0);
  });

  test("subarea intersect - single polygon fully outside", async () => {
    const metrics = await overlapSubarea("test", fix.sketch3, fix.outer);
    expect(metrics[0].value).toBeCloseTo(0);
    expect(metrics[1].value).toBeCloseTo(0);
  });

  test("subarea difference - single polygon fully outside outer, inside of outerOuter", async () => {
    const metrics = await overlapSubarea("test", fix.sketch3, fix.outer, {
      operation: "difference",
      outerArea: fix.outerOuterArea,
    });
    expect(metrics[0].value).toBeCloseTo(12368758407.838667);
    expect(metrics[1].value).toBeCloseTo(0.08326); // should be 1 square of 16 in outerOuter
  });

  // sketch always assumed to be within outer boundary.  outerArea is passed as pre-calculated area avoiding need to compute it on the fly
  test("overall - network", async () => {
    const metrics = await overlapArea(
      "test",
      fix.sketchCollection,
      fix.outerOuterArea
    );
    const collPercMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "testPerc"
    );
    expect(collPercMetric.value).toBeCloseTo(0.25); // takes up 4 out of 16 squares of outerOuter
    const sketchPercMetrics = metrics.filter(
      (m) => m.sketchId !== "CCCC" && m.metricId === "testPerc"
    );
    expect(sketchPercMetrics.length).toBe(fix.sketchCollection.features.length);
  });

  test("subarea intersect - network, half inside and outside", async () => {
    const metrics = await overlapSubarea(
      "test",
      fix.sketchCollection,
      fix.outer
    );
    expect(area(fix.sketchCollection)).toBe(fix.scArea);

    const collAreaMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "test"
    );
    expect(collAreaMetric.value).toBeCloseTo(fix.scArea / 2); // Expect about half, but not exactly same as inside

    const collAreaPercMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "testPerc"
    );
    expect(collAreaPercMetric.value).toBeCloseTo(2 / 4); // 2 of 4 squares in outer

    const sketchPercMetrics = metrics.filter((m) => m.sketchId !== "CCCC");
    expect(sketchPercMetrics.length).toBe(
      fix.sketchCollection.features.length * 2
    ); // 2 metrics per sketch
  });

  test("subarea difference - network, half inside and outside", async () => {
    const metrics = await overlapSubarea(
      "test",
      fix.sketchCollection,
      fix.outer,
      {
        operation: "difference",
        outerArea: fix.outerOuterArea,
      }
    );

    const collAreaMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "test"
    );
    expect(collAreaMetric.value).toBeCloseTo(24748835838.326283); // Expect about half, but not exactly same as inside

    const collAreaPercMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "testPerc"
    );
    expect(collAreaPercMetric.value).toBeCloseTo(2 / 12); // 2 of 12 squares in outerOuter

    const sketchPercMetrics = metrics.filter((m) => m.sketchId !== "CCCC");
    expect(sketchPercMetrics.length).toBe(
      fix.sketchCollection.features.length * 2
    ); // 2 metrics per sketch
  });
});
