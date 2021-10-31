/**
 * @jest-environment node
 * @group e2e
 */
import { loadCogWindow } from "./cog";
import { Feature, Polygon, Sketch } from "../types";
import { genSampleSketch } from "../helpers";
// @ts-ignore
import geoblaze from "geoblaze";
import parseGeoraster from "georaster";
import bbox from "@turf/bbox";

// bbox  - [xmin, ymin, xmax, ymax]
// pixel - [left, bottom, right, top]

const q1Poly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [-2, 2],
      [-2, 18],
      [-18, 18],
      [-18, 2],
      [-2, 2],
    ],
  ],
});

const q2Poly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 18],
      [18, 18],
      [18, 2],
      [2, 2],
    ],
  ],
});

const q3Poly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [-2, -2],
      [-2, -18],
      [-18, -18],
      [-18, -2],
      [-2, -2],
    ],
  ],
});

const q4Poly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, -2],
      [2, -18],
      [18, -18],
      [18, -2],
      [2, -2],
    ],
  ],
});

describe("COG test", () => {
  test("simple raster sum test, no cog but same metadata", async () => {
    const raster = await parseGeoraster(
      [
        [
          [0, 1],
          [0, 0],
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
    const sum = geoblaze.sum(raster, q2Poly)[0];
    expect(sum).toBe(1);
  });

  test("quad 10 - q1 full", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: bbox(q1Poly),
    });

    const sum = geoblaze.sum(raster, q1Poly);
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);

    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(raster.values[0][0].length).toBe(2);
    expect(raster.values[0][1].length).toBe(2);
    expect(raster.values[0][0][0]).toBe(1);
    expect(raster.values[0][0][1]).toBe(0);
    expect(raster.values[0][1][0]).toBe(0);
    expect(raster.values[0][1][1]).toBe(0);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - q2 full", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: bbox(q2Poly),
    });

    const sum = geoblaze.sum(raster, q2Poly);
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);

    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(raster.values[0][0].length).toBe(2);
    expect(raster.values[0][1].length).toBe(2);
    expect(raster.values[0][0][0]).toBe(0);
    expect(raster.values[0][0][1]).toBe(1);
    expect(raster.values[0][1][0]).toBe(0);
    expect(raster.values[0][1][1]).toBe(0);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - q3 full", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: bbox(q3Poly),
    });

    const sum = geoblaze.sum(raster, q3Poly);
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);

    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(raster.values[0][0].length).toBe(2);
    expect(raster.values[0][1].length).toBe(2);
    expect(raster.values[0][0][0]).toBe(0);
    expect(raster.values[0][0][1]).toBe(0);
    expect(raster.values[0][1][0]).toBe(1);
    expect(raster.values[0][1][1]).toBe(0);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - q4 full", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: bbox(q4Poly),
    });

    const sum = geoblaze.sum(raster, q4Poly);
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);

    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(raster.values[0][0].length).toBe(2);
    expect(raster.values[0][1].length).toBe(2);
    expect(raster.values[0][0][0]).toBe(0);
    expect(raster.values[0][0][1]).toBe(0);
    expect(raster.values[0][1][0]).toBe(0);
    expect(raster.values[0][1][1]).toBe(1);
    expect(sum[0]).toBe(1);
  });

  test("window box smaller than and within pixel should work properly", async () => {
    const url = "http://127.0.0.1:8080/feature_abyssopelagic_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: [
        -64.98190014112853, 32.28094566811551, -64.93314831007392,
        32.328245479189846,
      ],
    });
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);
  });

  test("window box 2 smaller than and within pixel should work properly", async () => {
    const url = "http://127.0.0.1:8080/feature_abyssopelagic_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: [
        -64.86625596136682, 32.20595207620439, -64.76875229925741,
        32.250097107343166,
      ],
    });
    expect(raster).toBeTruthy();
    expect(raster.values.length).toBeGreaterThan(0);
  });

  test("window box 3 smaller than and within pixel should work properly", async () => {
    const feature: Feature<Polygon> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.98190014112853, 32.28094566811551],
            [-64.97915355909728, 32.328245479189846],
            [-64.93314831007392, 32.32186289702012],
            [-64.94207470167548, 32.281816439778545],
            [-64.98190014112853, 32.28094566811551],
          ],
        ],
        bbox: [
          -64.98190014112853, 32.28094566811551, -64.93314831007392,
          32.328245479189846,
        ],
      },
      properties: {},
      id: "1",
      bbox: [
        -64.98190014112853, 32.28094566811551, -64.93314831007392,
        32.328245479189846,
      ],
    };

    const url = "http://127.0.0.1:8080/Bathypelagic1_cog.tif";
    const raster = await loadCogWindow(url, {
      windowBox: feature.bbox,
      noDataValue: -3.39999995214436425e38,
    });

    const sum = geoblaze.sum(raster, feature);

    expect(raster.pixelHeight).toBe(0.07777950326934817);
    expect(raster.pixelWidth).toBe(0.07777950326934817);
    expect(sum[0]).toBe(0); // feature should only overlap nodata cells, the 1 value should not get picked up
  });
});
