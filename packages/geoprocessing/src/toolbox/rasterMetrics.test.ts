/**
 * @vitest-environment node
 * @group unit
 */
import { describe, test, expect } from "vitest";
import parseGeoraster from "georaster";
import { rasterMetrics } from "./rasterMetrics.js";
import fix from "../testing/fixtures/sketches.js";
import { firstMatchingMetric } from "../metrics/index.js";
import { Feature, Polygon } from "../types/index.js";
import { feature } from "@turf/helpers";

// bbox  - [xmin, ymin, xmax, ymax]
// pixel - [left, bottom, right, top]

describe("rasterMetrics tests", () => {
  test("rasterMetrics - default sum", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster);
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(4);
    expect(metrics[0].metricId).toEqual("sum");
  });

  test("rasterMetrics - metricId override", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster, { metricId: "coral" });
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(4);
    expect(metrics[0].metricId).toEqual("coral");
  });

  test("rasterMetrics - metricId prefix", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster, { metricIdPrefix: "coral-" });
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(4);
    expect(metrics[0].metricId).toEqual("coral-sum");
  });

  test("rasterMetrics - default sum truncate", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1.298329382323, 2.349839823],
          [0, 1.2983298323],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster);
    expect(metrics.length).toBe(1);
    expect(`${metrics[0].value}`.length).toEqual(8); // #.###### is 8 characters long
  });

  test("rasterMetrics - default sum with sketch", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster, { feature: fix.topRightPoly });
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(2);
    expect(metrics[0]?.sketchId && metrics[0].sketchId.length > 0).toBe(true);
    expect(metrics[0]?.extra?.sketchName).toBeTruthy();
  });
  test("rasterMetrics - default sum with feature collection", async () => {
    const poly: Feature<Polygon> = feature({
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [0, 20],
          [20, 20],
          [20, 0],
          [0, 0],
        ],
      ],
    });
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster, {
      feature: poly,
    });
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(4);
    // feature should not have sketch properties assigned
    expect(metrics[0]?.sketchId).toBe(null);
    expect(metrics[0]?.extra?.sketchName).toBeFalsy();
  });

  test("rasterStats - calculate additional stats", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await rasterMetrics(raster, {
      feature: fix.wholePoly,
      stats: ["sum", "count", "min", "max", "mode", "invalid", "valid"],
    });

    expect(Object.keys(metrics).length).toEqual(7);
    expect(
      firstMatchingMetric(metrics, (m) => m.metricId === "valid").value
    ).toEqual(3);
    expect(
      firstMatchingMetric(metrics, (m) => m.metricId === "invalid").value
    ).toEqual(1);
    expect(
      firstMatchingMetric(metrics, (m) => m.metricId === "sum").value
    ).toEqual(4);
  });

  test("rasterStats - area", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await rasterMetrics(raster, {
      feature: fix.wholePoly,
      stats: ["area"],
    });

    expect(Object.keys(metrics).length).toEqual(1);
    expect(
      firstMatchingMetric(metrics, (m) => m.metricId === "area").value
    ).toEqual(300);
  });

  test("rasterStats - multi-band raster", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [0, 1],
        ],
        [
          [2, 4],
          [0, 2],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );

    const metrics = await rasterMetrics(raster, {
      feature: fix.wholePoly,
      stats: ["area"],
    });

    expect(Object.keys(metrics).length).toEqual(2);
    expect(
      firstMatchingMetric(metrics, (m) => m.metricId === "area").value
    ).toEqual(300);
  });

  test("rasterMetrics - sketch collection with overlap", async () => {
    const raster = await parseGeoraster(
      [
        [
          [1, 2],
          [1, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 10,
        pixelHeight: 10,
      }
    );
    const metrics = await rasterMetrics(raster, {
      feature: fix.wholeMixedSC,
      stats: ["valid", "sum", "area"],
    });
    expect(metrics.length).toBe(9);
    const sketch1Metrics = metrics.filter(
      (m) => (m.sketchId = metrics[0].sketchId)
    );
    expect(
      firstMatchingMetric(sketch1Metrics, (m) => m.metricId === "valid").value
    ).toEqual(4);
    expect(
      firstMatchingMetric(sketch1Metrics, (m) => m.metricId === "sum").value
    ).toEqual(5);
    expect(
      firstMatchingMetric(sketch1Metrics, (m) => m.metricId === "area").value
    ).toEqual(400);

    // collection values should match children because two children are duplicates and overlap perfectly
    const sketchCollMetrics = metrics.filter(
      (m) => m.extra?.isCollection === true
    );
    expect(
      firstMatchingMetric(sketchCollMetrics, (m) => m.metricId === "valid")
        .value
    ).toEqual(4);
    expect(
      firstMatchingMetric(sketchCollMetrics, (m) => m.metricId === "sum").value
    ).toEqual(5);
    expect(
      firstMatchingMetric(sketchCollMetrics, (m) => m.metricId === "area").value
    ).toEqual(400);
  });
});
