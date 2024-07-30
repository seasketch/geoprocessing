import { describe, test, expect } from "vitest";
import { firstMatchingMetric } from "../metrics/index.js";
import { overlapArea, overlapSubarea } from "./overlapArea.js";
import area from "@turf/area";
import fix from "../testing/fixtures/squareSketches.js";
import { testWithinPerc } from "../testing/index.js";
import { ValidationError } from "../types/index.js";

describe("overlapArea", () => {
  test("function is present", () => {
    expect(typeof overlapArea).toBe("function");
  });

  test("outerArea", () => {
    expect(fix.outerArea).toBeCloseTo(49447340364.08609);
  });
  test("outerOuterArea", () => {
    expect(fix.outerOuterArea).toBeCloseTo(197668873521.43488);
  });

  test("overlapArea - undefined sketch throws", async () => {
    expect(
      async () => await overlapArea("test", undefined!, 500)
    ).rejects.toThrow(ValidationError);
  });

  // sketch always assumed to be within outer boundary.  outerArea is passed as pre-calculated area avoiding need to compute it on the fly
  test("overlapArea overall - single polygon fully inside", async () => {
    const metrics = await overlapArea("test", fix.sketch1, fix.outerArea);
    expect(metrics[0].value).toBeCloseTo(12363718145.180046);
    expect(metrics[1].value).toBeCloseTo(0.25); // takes up bottom left quadrant of outer
  });

  test("overlapSubarea - undefined sketch throws", async () => {
    expect(
      async () => await overlapSubarea("test", undefined!, fix.outer)
    ).rejects.toThrow(ValidationError);
  });
});

describe("overlapSubarea", () => {
  test("overlapSubarea - undefined subareaFeature returns zero value metrics", async () => {
    const metrics = await overlapSubarea("test", fix.sketch1, undefined!);
    expect(metrics.length).toBe(2);
    metrics.forEach((m) => expect(m.value).toEqual(0));
  });

  test("overlapSubarea intersect - single polygon fully inside", async () => {
    const metrics = await overlapSubarea("test", fix.sketch1, fix.outer);
    expect(metrics[0].value).toBeCloseTo(12363718145.180046);
    expect(metrics[1].value).toBeCloseTo(0.25);
  });

  test("overlapSubarea difference - single polygon fully inside", async () => {
    const metrics = await overlapSubarea("test", fix.sketch1, fix.outer, {
      operation: "difference",
      outerArea: fix.outerArea,
    });
    expect(metrics[0].value).toBeCloseTo(0);
    expect(metrics[1].value).toBeCloseTo(0);
  });

  test("overlapSubarea intersect - single polygon fully outside", async () => {
    const metrics = await overlapSubarea("test", fix.sketch3, fix.outer);
    expect(metrics[0].value).toBeCloseTo(0);
    expect(metrics[1].value).toBeCloseTo(0);
  });

  test("overlapSubarea difference - single polygon fully outside outer, inside of outerOuter", async () => {
    const metrics = await overlapSubarea("test", fix.sketch3, fix.outer, {
      operation: "difference",
      outerArea: fix.outerOuterArea,
    });
    expect(metrics[0].value).toBeCloseTo(12341127230.89369);
    expect(metrics[1].value).toBeCloseTo(0.08326); // should be 1 square of 16 in outerOuter
  });

  // sketch always assumed to be within outer boundary.  outerArea is passed as pre-calculated area avoiding need to compute it on the fly
  test("overlapArea - network", async () => {
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

  test("overlapSubarea intersect - network, half inside and outside", async () => {
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
    // Expect about half, but not exactly same as inside
    testWithinPerc(collAreaMetric.value, fix.scArea / 2, {
      withinPerc: 0.5,
    });

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

  test("overlapSubarea difference - network, half inside and outside", async () => {
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
    // Expect about half, but not exactly same as inside
    testWithinPerc(collAreaMetric.value, fix.scArea / 2);

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
