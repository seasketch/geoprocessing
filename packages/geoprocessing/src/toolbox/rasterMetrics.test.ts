/**
 * @jest-environment node
 * @group unit
 */
import parseGeoraster from "georaster";
import { rasterMetrics } from "./rasterMetrics";
import fix from "../testing/fixtures/sketches";
import { firstMatchingMetric } from "../metrics";

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
  });

  test("rasterMetrics - default sum with feature", async () => {
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
});
