/**
 * @vitest-environment node
 * @group e2e
 */
import { describe, test, expect } from "vitest";
import { loadCog, loadCogWindow } from "./cog.js";
import { Feature, Polygon, Sketch } from "../types/index.js";
import { genSampleSketch } from "../helpers/index.js";
// @ts-ignore
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
      }
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

  test("two load methods should produce same result", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";

    const rasterParse = await loadCog(url);
    const rasterLoad = await loadCogWindow(url, {});

    const parseSumAll = await geoblaze.sum(rasterParse);
    const loadSumAll = await geoblaze.sum(rasterLoad);

    expect(JSON.stringify(parseSumAll)).toEqual(JSON.stringify(loadSumAll));
  });

  test("two load methods should produce same result with polygon", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";

    const rasterParse = await loadCog(url);
    const rasterLoad = await loadCogWindow(url, {});

    // Polygon covering most of the eez raster value but not all of it, including some nodata values
    const bigFeatureWithin: Feature<Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-65.90969082848031, 30.182428167053605],
            [-67.85475060186064, 33.21332227994239],
            [-65.08823354554784, 34.66739609111022],
            [-62.00068720624991, 31.71203828010028],
            [-63.40755082874345, 30.201312242523315],
            [-63.40755082874345, 30.201312242523315],
            [-65.90969082848031, 30.182428167053605],
          ],
        ],
      },
    };

    const parseSumWithin = await geoblaze.sum(rasterParse, bigFeatureWithin);
    const loadSumWithin = await geoblaze.sum(rasterLoad, bigFeatureWithin);
    expect(JSON.stringify(parseSumWithin)).toEqual(
      JSON.stringify(loadSumWithin)
    );

    // Larger than the raster but still not covering all value
    const bigFeatureOutside: Feature<Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.74059014914764, 34.506881449617666],
            [-69.10109958286165, 30.14466001611418],
            [-65.08823354554784, 27.0476716390814],
            [-60.442750979998664, 29.33264477091656],
            [-59.88567075364215, 34.40301903453425],
            [-65.93801694168488, 37.80215261908243],
            [-66.74059014914764, 34.506881449617666],
          ],
        ],
      },
    };

    const parseSumOutside = await geoblaze.sum(rasterParse, bigFeatureOutside);
    const loadSumOutside = await geoblaze.sum(rasterLoad, bigFeatureOutside);
    expect(JSON.stringify(parseSumOutside)).toEqual(
      JSON.stringify(loadSumOutside)
    );
  });
});
