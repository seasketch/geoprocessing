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
          value: 131259350503.85864,
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
          value: 131259350503.85864,
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
});
