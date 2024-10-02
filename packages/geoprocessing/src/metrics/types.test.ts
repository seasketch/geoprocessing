import { createMetric } from "./helpers.js";
import { Metric } from "../types/index.js";

// Collection-level metrics, by class
const areaMetrics: Metric[] = [
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area",
    value: 129_760_135.882_144_82,
    classId: "eez",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area_perc",
    value: 0.000_278_612_369_190_081_5,
    classId: "eez",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area",
    value: 129_760_135.882_144_82,
    classId: "nearshore",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f190",
    metricId: "area_perc",
    value: 0.050_598_639_699_453_905,
    classId: "nearshore",
  }),
  // Collection sketch-level metrics, by class
  createMetric({
    sketchId: "616f1ae906f1b7772b51f18f",
    metricId: "area",
    value: 98_813_282.515_869_14,
    classId: "eez",
  }),
  createMetric({
    sketchId: "616f1ae906f1b7772b51f18f",
    metricId: "area_perc",
    value: 0.000_212_165_335_386_207_85,
    classId: "eez",
  }),
];

describe("metricTypes", () => {
  test("simple", async () => {
    expect(areaMetrics.length).toBe(6);
  });
});
