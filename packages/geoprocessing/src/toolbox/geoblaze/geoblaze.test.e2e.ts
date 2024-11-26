import { describe, test, expect } from "vitest";
import { Polygon, Sketch, Feature } from "../../types/index.js";
import parseGeoraster from "georaster";
import testData from "./test/testData.js";
import geoblaze from "geoblaze";
import { splitSketchAntimeridian } from "../antimeridian.js";

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
      },
    );
    const sum = geoblaze.sum(raster, testData.quad2Poly)[0];
    expect(sum).toBe(1);
  });
});

describe("geoblaze cog test", () => {
  test("quad 10 - should pick up quad 1 using geoblaze.parse", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const raster = await geoblaze.parse(url);

    const sum = await geoblaze.sum(raster, testData.quad1Poly);
    expect(raster).toBeTruthy();
    expect(raster.pixelHeight).toBe(10);
    expect(raster.pixelWidth).toBe(10);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - should pick up q2 value with direct load of url", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const sum = await geoblaze.sum(url, testData.quad2Poly);
    expect(sum[0]).toBe(1);
  });

  test("quad 10 - should pick up all quad values with direct load of url", async () => {
    const url = "http://127.0.0.1:8080/data/in/quad_10_cog.tif";
    const sum = await geoblaze.sum(url, testData.allQuadPoly);
    expect(sum[0]).toBe(4);
  });

  test("feature smaller than a pixel should throw", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";

    const feature: Feature<Polygon> = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.981_900_141_128_53, 32.280_945_668_115_51],
            [-64.979_153_559_097_28, 32.328_245_479_189_846],
            [-64.933_148_310_073_92, 32.321_862_897_020_12],
            [-64.942_074_701_675_48, 32.281_816_439_778_545],
            [-64.981_900_141_128_53, 32.280_945_668_115_51],
          ],
        ],
        bbox: [
          -64.981_900_141_128_53, 32.280_945_668_115_51, -64.933_148_310_073_92,
          32.328_245_479_189_846,
        ],
      },
      properties: {},
      id: "1",
      bbox: [
        -64.981_900_141_128_53, 32.280_945_668_115_51, -64.933_148_310_073_92,
        32.328_245_479_189_846,
      ],
    };
    try {
      await geoblaze.sum(url, feature);
    } catch {
      return;
    }
    throw new Error("should not reach here, feature smaller than pixel");
  });

  test("geoblaze - larger feature covering only nodata should return 0", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";

    const raster = await geoblaze.parse(url);
    // Create polygon covering much but not all of the value in the raster with nodata inside it
    expect(raster).toBeTruthy();
    const feature: Feature<Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.762_548_574_095_76, 32.446_197_301_394_27],
            [-64.744_171_695_358_32, 32.294_588_051_810_4],
            [-64.590_265_335_932_27, 32.280_805_392_757_32],
            [-64.574_185_567_037_02, 32.404_849_324_235_03],
            [-64.762_548_574_095_76, 32.446_197_301_394_27],
          ],
        ],
      },
    };

    const result = await geoblaze.sum(url, feature);
    expect(result).toEqual([0]);
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
    const polyWithSquareHole = {
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
            [4, 16],
            [16, 16],
            [16, 4],
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
      },
    );

    const result = geoblaze.sum(raster, polyWithHole);
    const squareResult = geoblaze.sum(raster, polyWithSquareHole);
    expect(result).toBeTruthy();
    expect(result[0]).toBe(12);
    expect(squareResult[0]).toBe(12);
  });
});

describe("geoblaze antimeridian test", () => {
  test("fiji crossing - should pick X value", async () => {
    const url = "http://127.0.0.1:8080/data/in/fiji_anticross_random_test.tif";
    const raster = await geoblaze.parse(url);

    const fijiSketch: Sketch = {
      id: 22_968,
      bbox: [170.3874, -15.761_472, 186.443_15, -14.240_49],
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [170.387_412_007, -14.240_489_787],
            [186.381_385_397, -14.390_078_131],
            [186.443_138_19, -15.493_856_974],
            [170.480_041_196, -15.761_471_484],
            [170.387_412_007, -14.240_489_787],
          ],
        ],
      },
      properties: {
        "2852": "Fully Protected",
        "2853": "fiji-crossing-1",
        id: "22968",
        name: "fiji-crossing-1",
        postId: null,
        userId: "269",
        comments: null,
        userSlug: "Tim",
        createdAt: "2023-11-16T23:20:54.178483+00:00",
        updatedAt: "2023-11-16T23:20:54.178483+00:00",
        designation: "Fully Protected",
        collectionId: null,
        isCollection: false,
        sharedInForum: false,
        sketchClassId: "175",
        userAttributes: [
          {
            label: "Designation",
            value: "Fully Protected",
            exportId: "designation",
            fieldType: "ComboBox",
            valueLabel: null,
            formElementId: 2852,
            alternateLanguages: {},
          },
          {
            label: "Comments",
            value: null,
            exportId: "comments",
            fieldType: "TextArea",
            valueLabel: null,
            formElementId: 2854,
            alternateLanguages: {},
          },
        ],
      },
    };

    const sum = await geoblaze.sum(raster);
    expect(sum[0]).toBe(221);

    // When not split should only pick up the portion within -180 to 180 (left side)
    const fijiSum = await geoblaze.sum(raster, fijiSketch);
    expect(fijiSum[0]).toBe(10);

    // When split should pick up both sides, because it's all within -180 to 180
    const splitSketch = splitSketchAntimeridian(fijiSketch);
    const fijiCrossSum = await geoblaze.sum(raster, splitSketch);
    expect(fijiCrossSum[0]).toBe(14);
  });
});
