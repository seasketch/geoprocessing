import { describe, test, expect } from "vitest";
import { loadCog } from "./cog.js";
import { Polygon, Sketch } from "../types/index.js";
import { genSampleSketch } from "../helpers/index.js";
import geoblaze from "geoblaze";
import parseGeoraster from "georaster";

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
      },
    );
    const sum = geoblaze.sum(raster, q2Poly)[0];
    expect(sum).toBe(1);
  });

  test("quad 10 - q1 full", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await loadCog(url);

    const sum = await geoblaze.sum(raster, q1Poly);
    expect(raster).toBeTruthy();
    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - q2 full", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await loadCog(url);

    const sum = await geoblaze.sum(raster, q2Poly);
    expect(raster).toBeTruthy();
    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - q3 full", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await loadCog(url);

    const sum = await geoblaze.sum(raster, q3Poly);
    expect(raster).toBeTruthy();
    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - q4 full", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await loadCog(url);

    const sum = await geoblaze.sum(raster, q4Poly);
    expect(raster).toBeTruthy();
    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(sum[0]).toBe(1);
  });

  test("window box smaller than and within pixel should work properly", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";
    const raster = await loadCog(url);
    expect(raster).toBeTruthy();
  });

  test("window box 2 smaller than and within pixel should work properly", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";
    const raster = await loadCog(url);
    expect(raster).toBeTruthy();
  });
});
