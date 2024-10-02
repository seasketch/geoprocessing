import geoblaze from "geoblaze";
import parseGeoraster from "georaster";

describe("geoblaze multipolygon tests", () => {
  test("simple in-memory raster unit test", async () => {
    //  Raster   whole   2polygon & multipolygon
    //           _____            _____
    //  [1,1]   |     |          |  |  |
    //  [1,1]   |_____|          |__|__|
    //

    const raster = await parseGeoraster(
      [
        [
          [1, 1],
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
      },
    );

    const whole = {
      type: "Polygon",
      coordinates: [
        [
          [1, 1],
          [1, 19],
          [19, 19],
          [19, 1],
          [1, 1],
        ],
      ],
    };

    const collection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [1, 19],
                [11, 19],
                [11, 1],
                [1, 1],
                [1, 19],
              ],
            ],
            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [11, 19],
                [19, 19],
                [19, 1],
                [11, 1],
                [11, 19],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [1, 19],
              [11, 19],
              [11, 1],
              [1, 1],
              [1, 19],
            ],
          ],
          [
            [
              [11, 19],
              [19, 19],
              [19, 1],
              [11, 1],
              [11, 19],
            ],
          ],
        ],
      },
    };

    const wholeSum = geoblaze.sum(raster, whole);
    const singlepart = geoblaze.sum(raster, collection);
    const multipart = geoblaze.sum(raster, multipolygon);

    expect(
      wholeSum[0] === 4 && singlepart[0] === 4 && multipart[0] === 4,
    ).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (joined edge)", async () => {
    // Theoretically, multipolygons shouldn't share edges, but if they're made manually it might be possible
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const whole = {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [-67.865_482_131_744_78, 33.770_041_401_853_305],
            [-66.595_569_496_915_53, 31.222_453_169_005_036],
            [-65.980_332_319_793_33, 33.210_904_649_209],
            [-65.396_645_767_139_09, 35.803_912_706_921_17],
            [-67.865_482_131_744_78, 33.770_041_401_853_305],
          ],
        ],
        type: "Polygon",
      },
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-67.865_482_131_744_78, 33.770_041_401_853_305],
                [-65.980_332_319_793_33, 33.210_904_649_209],
                [-65.396_645_767_139_09, 35.803_912_706_921_17],
                [-67.865_482_131_744_78, 33.770_041_401_853_305],
              ],
            ],
            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-67.865_482_131_744_78, 33.770_041_401_853_305],
                [-66.595_569_496_915_53, 31.222_453_169_005_036],
                [-65.980_332_319_793_33, 33.210_904_649_209],
                [-67.865_482_131_744_78, 33.770_041_401_853_305],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-67.865_482_131_744_78, 33.770_041_401_853_305],
              [-65.980_332_319_793_33, 33.210_904_649_209],
              [-66.595_569_496_915_53, 31.222_453_169_005_036],
              [-67.865_482_131_744_78, 33.770_041_401_853_305],
            ],
          ],
          [
            [
              [-67.865_482_131_744_78, 33.770_041_401_853_305],
              [-65.396_645_767_139_09, 35.803_912_706_921_17],
              [-65.980_332_319_793_33, 33.210_904_649_209],
              [-67.865_482_131_744_78, 33.770_041_401_853_305],
            ],
          ],
        ],
      },
    };

    const wholeSum = await geoblaze.sum(raster, whole);
    const singlepart = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);

    // Expect the whole feature's sum to be equal to the sum of the 2 polygons
    // and the sume of the multipolygon
    expect(
      wholeSum[0] === multipart[0] && multipart[0] === singlepart[0],
    ).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (no joined edge)", async () => {
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-63.901_769_694_020_23, 34.921_364_825_529_85],
                [-63.447_775_851_182_215, 34.391_324_267_381_975],
                [-64.060_314_988_439_57, 33.994_880_021_846_1],
                [-64.357_039_414_193_84, 34.563_987_282_338_94],
                [-63.901_769_694_020_23, 34.921_364_825_529_85],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.211_555_208_406_62, 34.885_689_837_624_21],
                [-67.661_719_776_317_97, 34.081_883_182_550_97],
                [-66.646_558_162_766_13, 33.029_451_874_561_474],
                [-65.313_608_883_704_16, 34.101_465_324_972_24],
                [-66.211_555_208_406_62, 34.885_689_837_624_21],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-63.901_769_694_020_23, 34.921_364_825_529_85],
              [-63.447_775_851_182_215, 34.391_324_267_381_975],
              [-64.060_314_988_439_57, 33.994_880_021_846_1],
              [-64.357_039_414_193_84, 34.563_987_282_338_94],
              [-63.901_769_694_020_23, 34.921_364_825_529_85],
            ],
          ],
          [
            [
              [-66.211_555_208_406_62, 34.885_689_837_624_21],
              [-67.661_719_776_317_97, 34.081_883_182_550_97],
              [-66.646_558_162_766_13, 33.029_451_874_561_474],
              [-65.313_608_883_704_16, 34.101_465_324_972_24],
              [-66.211_555_208_406_62, 34.885_689_837_624_21],
            ],
          ],
        ],
      },
    };

    const singlepart = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);

    // Expect the sum of the 2 polygons to be the same as the sum of the multipolygon
    expect(singlepart[0] === multipart[0]).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (full overlap)", async () => {
    // Theoretically, multipolygons shouldn't overlap, but if they're made manually it might be possible
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const whole = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.407_064_911_368_44, 34.283_527_126_524_476],
            [-66.407_064_911_368_44, 33.573_959_204_981_506],
            [-64.005_962_223_281_86, 33.583_093_576_128_72],
            [-64.038_854_040_927, 34.346_916_668_320_26],
            [-66.407_064_911_368_44, 34.283_527_126_524_476],
          ],
        ],
      },
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
                [-66.407_064_911_368_44, 33.573_959_204_981_506],
                [-64.005_962_223_281_86, 33.583_093_576_128_72],
                [-64.038_854_040_927, 34.346_916_668_320_26],
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
                [-66.407_064_911_368_44, 33.573_959_204_981_506],
                [-64.005_962_223_281_86, 33.583_093_576_128_72],
                [-64.038_854_040_927, 34.346_916_668_320_26],
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-66.407_064_911_368_44, 34.283_527_126_524_476],
              [-66.407_064_911_368_44, 33.573_959_204_981_506],
              [-64.005_962_223_281_86, 33.583_093_576_128_72],
              [-64.038_854_040_927, 34.346_916_668_320_26],
              [-66.407_064_911_368_44, 34.283_527_126_524_476],
            ],
          ],
          [
            [
              [-66.407_064_911_368_44, 34.283_527_126_524_476],
              [-66.407_064_911_368_44, 33.573_959_204_981_506],
              [-64.005_962_223_281_86, 33.583_093_576_128_72],
              [-64.038_854_040_927, 34.346_916_668_320_26],
              [-66.407_064_911_368_44, 34.283_527_126_524_476],
            ],
          ],
        ],
      },
    };

    const mixedColl = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
                [-66.407_064_911_368_44, 33.573_959_204_981_506],
                [-64.005_962_223_281_86, 33.583_093_576_128_72],
                [-64.038_854_040_927, 34.346_916_668_320_26],
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [
                  [-66.407_064_911_368_44, 34.283_527_126_524_476],
                  [-66.407_064_911_368_44, 33.573_959_204_981_506],
                  [-64.005_962_223_281_86, 33.583_093_576_128_72],
                  [-64.038_854_040_927, 34.346_916_668_320_26],
                  [-66.407_064_911_368_44, 34.283_527_126_524_476],
                ],
              ],
            ],

            type: "MultiPolygon",
          },
        },
      ],
    };

    const wholeSum = await geoblaze.sum(raster, whole);
    const singleColl = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);
    const mixedCollSum = await geoblaze.sum(raster, mixedColl);

    // Expect the sum of the whole feature to be the same as the sum of
    // two fully overlapping polygons (the overlap should not be counted twice)
    // and the sum of a multipolygon with two parts which fully overlap
    // (the overlap should not be counted twice)
    expect(
      wholeSum[0] === singleColl[0] &&
        singleColl[0] === multipart[0] &&
        multipart[0] === mixedCollSum[0],
    ).toBeTruthy();
  });

  test("geoblaze - compares multipolygon sum with polygon collection sum (partial overlap)", async () => {
    // Theoretically, multipolygons shouldn't overlap, but if they're made manually it might be possible
    const url = "http://127.0.0.1:8080/data/in/feature_abyssopelagic_cog.tif";
    const raster = await geoblaze.parse(url);

    const whole = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.407_064_911_368_44, 34.283_527_126_524_476],
            [-66.407_064_911_368_44, 33.573_959_204_981_506],
            [-64.005_962_223_281_86, 33.583_093_576_128_72],
            [-64.038_854_040_927, 34.346_916_668_320_26],
            [-66.407_064_911_368_44, 34.283_527_126_524_476],
          ],
        ],
      },
    };

    const featureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-65.815_012_193_758_08, 34.299_374_511_973_426],
                [-65.206_513_567_325_15, 33.578_526_390_555_11],
                [-64.005_962_223_281_86, 33.583_093_576_128_72],
                [-64.038_854_040_927, 34.346_916_668_320_26],
                [-65.222_959_476_147_72, 34.315_221_897_422_37],
                [-65.815_012_193_758_08, 34.299_374_511_973_426],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
                [-66.407_064_911_368_44, 33.573_959_204_981_506],
                [-65.206_513_567_325_15, 33.578_526_390_555_11],
                [-64.606_237_895_303_51, 33.580_809_983_341_915],
                [-65.222_959_476_147_72, 34.315_221_897_422_37],
                [-65.815_012_193_758_08, 34.299_374_511_973_426],
                [-66.407_064_911_368_44, 34.283_527_126_524_476],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-65.815_012_193_758_08, 34.299_374_511_973_426],
              [-65.206_513_567_325_15, 33.578_526_390_555_11],
              [-64.005_962_223_281_86, 33.583_093_576_128_72],
              [-64.038_854_040_927, 34.346_916_668_320_26],
              [-65.222_959_476_147_72, 34.315_221_897_422_37],
              [-65.815_012_193_758_08, 34.299_374_511_973_426],
            ],
          ],
          [
            [
              [-66.407_064_911_368_44, 34.283_527_126_524_476],
              [-66.407_064_911_368_44, 33.573_959_204_981_506],
              [-65.206_513_567_325_15, 33.578_526_390_555_11],
              [-64.606_237_895_303_51, 33.580_809_983_341_915],
              [-65.222_959_476_147_72, 34.315_221_897_422_37],
              [-65.815_012_193_758_08, 34.299_374_511_973_426],
              [-66.407_064_911_368_44, 34.283_527_126_524_476],
            ],
          ],
        ],
      },
    };

    const wholeSum = await geoblaze.sum(raster, whole);
    const singlepart = await geoblaze.sum(raster, featureCollection);
    const multipart = await geoblaze.sum(raster, multipolygon);

    // Expect the sum of the whole feature to be the same as the sum of
    // two partially overlapping polygons (the overlap should not be counted twice)
    // and the sum of a multipolygon with two parts which partially overlap
    // (the overlap should not be counted twice)
    expect(
      wholeSum[0] === singlepart[0] && singlepart[0] === multipart[0],
    ).toBeTruthy();
  });

  test("unit test across dateline and equator", async () => {
    //  Raster   whole   2polygon & multipolygon
    //           _____            _____
    //  [1,1]   |     |          |_____|
    //  [1,1]   |_____|          |_____|
    //

    const raster = await parseGeoraster(
      [
        [
          [1, 1],
          [1, 1],
        ],
      ],
      {
        noDataValue: 0,
        projection: 4326,
        xmin: -10, // left
        ymax: 10, // top
        pixelWidth: 10,
        pixelHeight: 10,
      },
    );

    const whole = {
      type: "Polygon",
      coordinates: [
        [
          [-9, 9],
          [9, 9],
          [9, -9],
          [-9, -9],
          [-9, 9],
        ],
      ],
    };

    const collection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-9, 9],
                [9, 9],
                [9, -1],
                [-9, -1],
                [-9, 9],
              ],
            ],
            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [-9, 1],
                [9, 1],
                [9, -9],
                [-9, -9],
                [-9, 1],
              ],
            ],
            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-9, 9],
              [9, 9],
              [9, -1],
              [-9, -1],
              [-9, 9],
            ],
          ],
          [
            [
              [-9, 1],
              [9, 1],
              [9, -9],
              [-9, -9],
              [-9, 1],
            ],
          ],
        ],
      },
    };

    const wholeSum = geoblaze.sum(raster, whole);
    const singlepart = geoblaze.sum(raster, collection);
    const multipart = geoblaze.sum(raster, multipolygon);

    expect(
      wholeSum[0] === 4 && singlepart[0] === 4 && multipart[0] === 4,
    ).toBeTruthy();
  });

  test("simple in-memory raster unit overlap test", async () => {
    //  Raster   whole   2polygon & multipolygon
    //           _____            ____
    //  [1,1]   |     |          |    | (two overlapping)
    //  [1,1]   |_____|          |____|
    //

    const raster = await parseGeoraster(
      [
        [
          [1, 1],
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
      },
    );

    const whole = {
      type: "Polygon",
      coordinates: [
        [
          [1, 1],
          [1, 19],
          [19, 19],
          [19, 1],
          [1, 1],
        ],
      ],
    };

    const collection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [1, 1],
                [1, 19],
                [19, 19],
                [19, 1],
                [1, 1],
              ],
            ],

            type: "Polygon",
          },
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [
              [
                [1, 1],
                [1, 19],
                [19, 19],
                [19, 1],
                [1, 1],
              ],
            ],

            type: "Polygon",
          },
        },
      ],
    };

    const multipolygon = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [1, 1],
              [1, 19],
              [19, 19],
              [19, 1],
              [1, 1],
            ],
          ],
          [
            [
              [1, 1],
              [1, 19],
              [19, 19],
              [19, 1],
              [1, 1],
            ],
          ],
        ],
      },
    };

    const wholeSum = geoblaze.sum(raster, whole);
    const singlepart = geoblaze.sum(raster, collection);
    const multipart = geoblaze.sum(raster, multipolygon);

    expect(
      wholeSum[0] === 4 && singlepart[0] === 4 && multipart[0] === 4,
    ).toBeTruthy();
  });
});
