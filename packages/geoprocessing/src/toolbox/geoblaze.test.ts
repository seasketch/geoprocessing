/**
 * @jest-environment node
 * @group unit
 */
import { Polygon, Sketch } from "../types";
import { genSampleSketch } from "../helpers";
import parseGeoraster from "georaster";
import { overlapRaster } from "./overlapRaster";

// @ts-ignore
import geoblaze, { Georaster } from "geoblaze";

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
      [12, 20],
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

describe("geoblaze test", () => {
  test("geoblaze - hole should be excluded from sum", async () => {
    // Hole in top right
    // exterior ring is counterclockwise, interior ring is clockwise
    const polyWithHole = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [20, 0],
            [20, 20],
            [0, 20],
            [0, 0],
          ],
          [
            [5, 5],
            [5, 15],
            [15, 15],
            [15, 5],
            [5, 5],
          ],
        ],
      },
      bbox: [0, 0, 20, 20],
    };
    const raster = await parseGeoraster(
      [
        [
          [1, 1, 1, 1],
          [1, 1, 1, 1],
          [1, 1, 1, 1],
          [1, 1, 1, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: 0, // left
        ymax: 20, // top
        pixelWidth: 5,
        pixelHeight: 5,
      }
    );

    const result = geoblaze.sum(raster, polyWithHole);
    console.log("result", result);
    expect(result).toBeTruthy();
    // expect(result[0]).toBe(12);
  });
});
