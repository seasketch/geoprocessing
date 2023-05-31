/**
 * @jest-environment node
 * @group unit
 */
import { Polygon, Sketch, Feature } from "../types";
import { genSampleSketch } from "../helpers";
import parseGeoraster from "georaster";
import dufour_peyton_intersection from "dufour-peyton-intersection";

// @ts-ignore
import geoblaze from "geoblaze";

// bbox  - [xmin, ymin, xmax, ymax]
// pixel - [left, bottom, right, top]

const quad1Poly: Sketch<Polygon> = genSampleSketch({
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

const quad2Poly: Sketch<Polygon> = genSampleSketch({
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

const allQuadPoly: Sketch<Polygon> = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [-18, -18],
      [-18, 18],
      [18, 18],
      [18, -18],
      [-18, -18],
    ],
  ],
});

describe("geoblaze basics", () => {
  test("simple in-memory raster sum test", async () => {
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
    const sum = geoblaze.sum(raster, quad2Poly)[0];
    expect(sum).toBe(1);
  });
});

describe("geoblaze cog test", () => {
  test("quad 10 - should pick up quad 1 using geoblaze.parse", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const raster = await geoblaze.parse(url);

    const sum = await geoblaze.sum(raster, quad1Poly);
    expect(raster).toBeTruthy();
    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - should pick up q2 value with direct load of url", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const sum = await geoblaze.sum(url, quad2Poly);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - should pick up all quad values with direct load of url", async () => {
    const url = "http://127.0.0.1:8080/quad_10_cog.tif";
    const sum = await geoblaze.sum(url, allQuadPoly);
    expect(sum[0]).toBe(4);
  });

  test("feature smaller than a pixel should throw", async () => {
    const url = "http://127.0.0.1:8080/feature_abyssopelagic_cog.tif";

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
    try {
      await geoblaze.sum(url, feature);
    } catch (err) {
      return;
    }
    fail("should not reach here");
  });

  test("larger feature covering only nodata should throw", async () => {
    const url = "http://127.0.0.1:8080/feature_abyssopelagic_cog.tif";

    const raster = await geoblaze.parse(url);
    // Create polygon smaller than one pixel
    expect(raster).toBeTruthy();
    const feature: Feature<Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.76254857409576, 32.44619730139427],
            [-64.74417169535832, 32.2945880518104],
            [-64.59026533593227, 32.28080539275732],
            [-64.57418556703702, 32.40484932423503],
            [-64.76254857409576, 32.44619730139427],
          ],
        ],
      },
    };
    try {
      await geoblaze.sum(url, feature);
    } catch (err) {
      return;
    }
    fail("should not reach here");
  });
});

describe("geoblaze hole test", () => {
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
            [4, 4],
            [3.9, 15.9],
            [15.8, 15.8],
            [15.9, 3.9],
            [4, 4],
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

    // const result = geoblaze.sum(raster, polyWithHole);
    // expect(result).toBeTruthy();
    // expect(result[0]).toBe(12);

    const result = dufour_peyton_intersection.calculate({
      raster_bbox: [0, 0, 20, 20],
      raster_height: 4,
      raster_width: 4,
      pixel_height: 5,
      pixel_width: 5,
      geometry: polyWithHole,
    });
    const expected = `{"rows":[[[0,3]],[[0,0],[3,3]],[[0,0],[3,3]],[[0,3]]]}`;
    expect(JSON.stringify(result)).toEqual(expected);
  });
});
