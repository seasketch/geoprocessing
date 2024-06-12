import { describe, test, expect } from "vitest";
import { rasterStats } from "./rasterStats.js";
//@ts-ignore
import geoblaze from "geoblaze";
import testData from "./test/testData.js";
import parseGeoraster from "georaster";
import { defaultStatValues } from "./geoblaze.js";

describe("rasterStats", () => {
  test("rasterStats - default sum", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await geoblaze.parse(url);

    const statsByBand = await rasterStats(raster);
    expect(statsByBand.length).toEqual(1);
    expect(Object.keys(statsByBand[0]).length).toEqual(1);
    expect(statsByBand[0].sum).toEqual(4);
  });

  test("rasterStats - default sum with feature", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await geoblaze.parse(url);

    const statsByBand = await rasterStats(raster, {
      feature: testData.quad2Poly,
    });
    expect(statsByBand.length).toEqual(1);
    expect(Object.keys(statsByBand[0]).length).toEqual(1);
    expect(statsByBand[0].sum).toEqual(1);
  });

  test("rasterStats - calculate additional stats", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await geoblaze.parse(url);

    const statsByBand = await rasterStats(raster, {
      feature: testData.quad2Poly,
      stats: ["sum", "count", "min", "max", "mode", "invalid", "valid"],
    });

    const stats = statsByBand[0];
    expect(Object.keys(stats).length).toEqual(7);
    expect(stats.sum).toEqual(1);
    expect(stats.count).toEqual(4);
    expect(stats.min).toEqual(1);
    expect(stats.max).toEqual(1);
    expect(stats.valid).toEqual(1);
    expect(stats.mode).toEqual(1);
  });

  test("rasterStats - area", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await geoblaze.parse(url);

    const statsByBand = await rasterStats(raster, {
      feature: testData.quad2Poly,
      stats: ["area"],
    });
    expect(statsByBand.length).toEqual(1);
    expect(Object.keys(statsByBand[0]).length).toEqual(1);
    expect(statsByBand[0].area).toEqual(100); // 10 W x 10 H x 1 valid
  });

  test("rasterStats - multi-band", async () => {
    const multiBandRaster = await parseGeoraster(
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

    const statsByBand = await rasterStats(multiBandRaster);
    expect(statsByBand.length).toEqual(2);
    expect(Object.keys(statsByBand[0]).length).toEqual(1);
    expect(statsByBand[0].sum).toEqual(4);
    expect(Object.keys(statsByBand[1]).length).toEqual(1);
    expect(statsByBand[1].sum).toEqual(8);
  });

  test("rasterStats - non-overlapping feature", async () => {
    const multiBandRaster = await parseGeoraster(
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

    const statsByBand = await rasterStats(multiBandRaster, {
      feature: testData.outsideQuadPoly,
      stats: ["sum", "count", "min", "max", "mode", "invalid", "valid", "area"],
    });

    const stats = statsByBand[0];
    const statNames = Object.keys(stats);
    expect(statNames.length).toEqual(8);
    statNames.forEach((statName) => {
      if (statName === "area") expect(stats[statName]).toEqual(0);
      else expect(stats[statName]).toEqual(defaultStatValues[statName]);
    });
    // should return zero values for each stat if no feature overlap
  });
});
