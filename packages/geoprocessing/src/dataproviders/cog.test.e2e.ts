import { describe, test, expect } from "vitest";
import { loadCog, loadCogWindow } from "./cog.js";
import { Feature, Polygon, Sketch } from "../types/index.js";
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
            [-65.909_690_828_480_31, 30.182_428_167_053_605],
            [-67.854_750_601_860_64, 33.213_322_279_942_39],
            [-65.088_233_545_547_84, 34.667_396_091_110_22],
            [-62.000_687_206_249_91, 31.712_038_280_100_28],
            [-63.407_550_828_743_45, 30.201_312_242_523_315],
            [-63.407_550_828_743_45, 30.201_312_242_523_315],
            [-65.909_690_828_480_31, 30.182_428_167_053_605],
          ],
        ],
      },
    };

    const parseSumWithin = await geoblaze.sum(rasterParse, bigFeatureWithin);
    const loadSumWithin = await geoblaze.sum(rasterLoad, bigFeatureWithin);
    expect(JSON.stringify(parseSumWithin)).toEqual(
      JSON.stringify(loadSumWithin),
    );

    // Larger than the raster but still not covering all value
    const bigFeatureOutside: Feature<Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.740_590_149_147_64, 34.506_881_449_617_666],
            [-69.101_099_582_861_65, 30.144_660_016_114_18],
            [-65.088_233_545_547_84, 27.047_671_639_081_4],
            [-60.442_750_979_998_664, 29.332_644_770_916_56],
            [-59.885_670_753_642_15, 34.403_019_034_534_25],
            [-65.938_016_941_684_88, 37.802_152_619_082_43],
            [-66.740_590_149_147_64, 34.506_881_449_617_666],
          ],
        ],
      },
    };

    const parseSumOutside = await geoblaze.sum(rasterParse, bigFeatureOutside);
    const loadSumOutside = await geoblaze.sum(rasterLoad, bigFeatureOutside);
    expect(JSON.stringify(parseSumOutside)).toEqual(
      JSON.stringify(loadSumOutside),
    );
  });
});
