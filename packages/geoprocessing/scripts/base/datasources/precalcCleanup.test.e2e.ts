import { Metric, ProjectClientBase } from "../../../src/index.js";
import { precalcCleanup } from "./precalcCleanup.js";
import configFixtures from "../../../src/testing/fixtures/projectConfig.js";

describe("precalcCleanup", () => {
  test("precalcCleanup - should not drop", () => {
    const projectClient = new ProjectClientBase(configFixtures.loaded);
    const cleanMetrics = precalcCleanup(projectClient);
    expect(cleanMetrics.length).toBe(2);
  });
  test("precalcCleanup - dropped datasource", () => {
    const projectClient = new ProjectClientBase({
      ...configFixtures.loaded,
      precalc: configFixtures.loaded.precalc.concat([
        {
          geographyId: "eez",
          metricId: "area",
          classId: "foo-total", // nonexistent
          sketchId: null,
          groupId: null,
          value: 131_259_350_503.858_64,
        },
        {
          geographyId: "eez",
          metricId: "count",
          classId: "foo-total",
          sketchId: null,
          groupId: null,
          value: 1,
        },
      ]),
    });

    const cleanMetrics = precalcCleanup(projectClient);
    expect(cleanMetrics.length).toBe(2);
  });

  test("precalcCleanup - dropped geography", () => {
    const projectClient = new ProjectClientBase({
      ...configFixtures.loaded,
      precalc: configFixtures.loaded.precalc.concat([
        {
          geographyId: "foo", // nonexistent
          metricId: "area",
          classId: "global-eez-mr-v12-total", // nonexistent
          sketchId: null,
          groupId: null,
          value: 131_259_350_503.858_64,
        },
        {
          geographyId: "foo",
          metricId: "count",
          classId: "global-eez-mr-v12-total",
          sketchId: null,
          groupId: null,
          value: 1,
        },
      ]),
    });

    const cleanMetrics = precalcCleanup(projectClient);
    expect(cleanMetrics.length).toBe(2);
    cleanMetrics.forEach((m: Metric) => {
      expect(m.geographyId).toBe("eez");
    });
  });

  test("precalcCleanup - drop malformed metrics", () => {
    const projectClient = new ProjectClientBase({
      ...configFixtures.loaded,
      precalc: configFixtures.loaded.precalc.concat([
        {
          geographyId: "eez",
          metricId: "area",
          classId: "global-eez-mr-v12", // Needs "-class"
          sketchId: null,
          groupId: null,
          value: 131_259_350_503.858_64,
        },
        {
          geographyId: "eez",
          metricId: "count",
          classId: "global-eez-mr-v12-california", // Formatted correctly
          sketchId: null,
          groupId: null,
          value: 1,
        },
      ]),
    });

    const cleanMetrics = precalcCleanup(projectClient);
    expect(cleanMetrics.length).toBe(3);
    cleanMetrics.forEach((m: Metric) => {
      expect(m.classId).not.toBe("global-eez-mr-v12");
    });
  });
});
