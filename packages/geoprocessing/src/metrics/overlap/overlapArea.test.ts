/**
 * @group unit
 */

import { SketchCollection } from "../../types";
import { overlapArea, overlapSubarea } from "./overlapArea";
import { genSampleSketch } from "../../helpers";
import { feature, Feature, Polygon, polygon } from "@turf/helpers";
import area from "@turf/area";
import { firstMatchingMetric } from "../helpers";

const outer: Feature<Polygon> = feature({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ],
  ],
});
const outerArea = area(outer);

const outerOuter: Feature<Polygon> = feature({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [4, 0],
      [4, 4],
      [0, 4],
      [0, 0],
    ],
  ],
});
const outerOuterArea = area(outerOuter);

// full inside outer
const poly1 = polygon([
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
]);

const sketch1 = genSampleSketch(poly1.geometry);

// half inside outer
const poly2 = polygon([
  [
    [1, 1],
    [2, 1],
    [2, 3],
    [1, 3],
    [1, 1],
  ],
]);
const sketch2 = genSampleSketch(poly2.geometry);

// fully outside outer
const poly3 = polygon([
  [
    [3, 3],
    [4, 3],
    [4, 4],
    [3, 4],
    [3, 3],
  ],
]);
const sketch3 = genSampleSketch(poly3.geometry);

const collectionId = "CCCC";
const sc: SketchCollection<Polygon> = {
  type: "FeatureCollection",
  properties: {
    id: collectionId,
    name: "Collection 1",
    updatedAt: "2021-11-20T00:00:34.269Z",
    createdAt: "2021-11-19T23:34:12.889Z",
    sketchClassId: "615b65a2aac8c8285d50d9f3",
    isCollection: true,
    userAttributes: [],
  },
  bbox: [1, 1, 1, 1],
  features: [sketch1, sketch2, sketch3],
};

describe("Area stats tool", () => {
  test("function is present", () => {
    expect(typeof overlapArea).toBe("function");
  });

  test("outerArea", () => {
    expect(outerArea).toBeCloseTo(49558050527.3877);
  });
  test("outerOuterArea", () => {
    expect(outerOuterArea).toBeCloseTo(198111444408.08057);
  });

  // sketch always assumed to be within outer boundary.  outerArea is passed as pre-calculated area avoiding need to compute it on the fly
  test("overall - single polygon fully inside", async () => {
    const metrics = await overlapArea("test", sketch1, outerArea);
    expect(metrics[0].value).toBeCloseTo(12391399902.071104);
    expect(metrics[1].value).toBeCloseTo(0.25); // takes up bottom left quadrant of outer
  });
  test("subarea intersect - single polygon fully inside", async () => {
    const metrics = await overlapSubarea("test", sketch1, outer);
    expect(metrics[0].value).toBeCloseTo(12391399902.071104);
    expect(metrics[1].value).toBeCloseTo(0.25);
  });

  test("subarea difference - single polygon fully inside", async () => {
    const metrics = await overlapSubarea("test", sketch1, outer, {
      operation: "difference",
      outerArea,
    });
    expect(metrics[0].value).toBeCloseTo(0);
    expect(metrics[1].value).toBeCloseTo(0);
  });

  test("subarea intersect - single polygon fully outside", async () => {
    const metrics = await overlapSubarea("test", sketch3, outer);
    expect(metrics[0].value).toBeCloseTo(0);
    expect(metrics[1].value).toBeCloseTo(0);
  });

  test("subarea difference - single polygon fully outside outer, inside of outerOuter", async () => {
    const metrics = await overlapSubarea("test", sketch3, outer, {
      operation: "difference",
      outerArea: outerOuterArea,
    });
    expect(metrics[0].value).toBeCloseTo(12368758407.838667);
    expect(metrics[1].value).toBeCloseTo(0.08326); // should be 1 square of 16 in outerOuter
  });

  // sketch always assumed to be within outer boundary.  outerArea is passed as pre-calculated area avoiding need to compute it on the fly
  test("overall - network", async () => {
    const metrics = await overlapArea("test", sc, outerOuterArea);
    const collPercMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "testPerc"
    );
    expect(collPercMetric.value).toBeCloseTo(0.25); // takes up 4 out of 16 squares of outerOuter
    const sketchPercMetrics = metrics.filter(
      (m) => m.sketchId !== "CCCC" && m.metricId === "testPerc"
    );
    expect(sketchPercMetrics.length).toBe(sc.features.length);
  });

  test("subarea intersect - network, half inside and outside", async () => {
    const metrics = await overlapSubarea("test", sc, outer);
    expect(area(sc)).toBe(49527861102.020134);

    const collAreaMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "test"
    );
    expect(collAreaMetric.value).toBeCloseTo(24779025263.69385); // Expect about half, but not exactly same as inside

    const collAreaPercMetric = firstMatchingMetric(
      metrics,
      (m) => m.sketchId === "CCCC" && m.metricId === "testPerc"
    );
    expect(collAreaPercMetric.value).toBeCloseTo(2 / 4); // 2 of 4 squares in outer

    const sketchPercMetrics = metrics.filter((m) => m.sketchId !== "CCCC");
    expect(sketchPercMetrics.length).toBe(sc.features.length * 2); // 2 metrics per sketch
  });

  test("subarea difference - network, half inside and outside", async () => {
    const metrics = await overlapSubarea("test", sc, outer, {
      operation: "difference",
      outerArea: outerOuterArea,
    });

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
    expect(sketchPercMetrics.length).toBe(sc.features.length * 2); // 2 metrics per sketch
  });
});
