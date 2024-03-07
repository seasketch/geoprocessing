import { createMetric } from "./helpers.js";
import { Metric } from "../types/index.js";

// Collection-level metrics, by class
const areaMetrics: Metric[] = [
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area",
    value: 129760135.88214482,
    classId: "eez",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area_perc",
    value: 0.0002786123691900815,
    classId: "eez",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area",
    value: 129760135.88214482,
    classId: "nearshore",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area_perc",
    value: 0.050598639699453905,
    classId: "nearshore",
  }),
  // Collection sketch-level metrics, by class
  createMetric({
    sketchId: "616f1ae906f1b7772b51f18f",
    metricId: "area",
    value: 98813282.51586914,
    classId: "eez",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f18f",
    metricId: "area_perc",
    value: 0.00021216533538620785,
    classId: "eez",
  }),
];

describe("metricTypes", () => {
  test("simple", async () => {
    expect(areaMetrics.length).toBe(6);
  });
});
