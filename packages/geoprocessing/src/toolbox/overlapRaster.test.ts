/**
 * @jest-environment node
 * @group unit
 */
import { Feature, Polygon, Sketch } from "../types";
import { genSampleSketch } from "../helpers";
// @ts-ignore
import geoblaze from "geoblaze";
import parseGeoraster from "georaster";
import bbox from "@turf/bbox";
import { overlapRaster } from "./overlapRaster";

// bbox  - [xmin, ymin, xmax, ymax]
// pixel - [left, bottom, right, top]

const bottomLeftPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 8],
      [8, 8],
      [8, 2],
      [2, 2],
    ],
  ],
});

const topRightPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [12, 12],
      [12, 18],
      [18, 18],
      [18, 12],
      [12, 12],
    ],
  ],
});

const wholePoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [2, 2],
      [2, 20],
      [20, 20],
      [20, 2],
      [2, 2],
    ],
  ],
});

describe("overlapRaster test", () => {
  test("overlapRaster - bottom left raster cell sum should be 0", async () => {
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
    const metrics = await overlapRaster("test", raster, bottomLeftPoly);
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(0);
  });

  test("overlapRaster - top right raster cell sum should be 2", async () => {
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
    const metrics = await overlapRaster("test", raster, topRightPoly);
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(2);
  });

  test("overlapRaster - whole raster sum should be 5", async () => {
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
    const metrics = await overlapRaster("test", raster, wholePoly);
    expect(metrics.length).toBe(1);
    expect(metrics[0].value).toBe(5);
  });
});
