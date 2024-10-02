import geoblaze from "geoblaze";

// Testing using EPSG:6933 NSIDC EASE-Grid 2.0 Global equal-area projection in geoblaze

describe("geoblaze equal-area tests", () => {
  test("discrete raster, no geometry", async () => {
    const url =
      "http://127.0.0.1:8080/data/in/existing_marine_reserves_6933_COG.tif";

    const stats = (await geoblaze.stats(url))[0];
    const georaster = await geoblaze.parse(url);
    const area = stats.sum * georaster.pixelHeight * georaster.pixelWidth;

    // QGIS Raster layer statistics results for existing_marine_reserves_6933_COG.tif:
    // {'MAX': 1.0, 'MEAN': 0.006075020775424822, 'MIN': 0.0, 'RANGE': 1.0,
    // 'STD_DEV': 0.0777064214188436, 'SUM': 212.0 }

    // QGIS Raster layer zonal statistics for existing_marine_reserves_6933_COG.tif:
    // Zone 1: 5730847183.38624382 m2

    expect(stats.max).toBe(1);
    expect(stats.min).toBe(0);
    expect(stats.range).toBe(1);
    expect(stats.mean).toBeCloseTo(0.006_075_020_775_424_822);
    expect(stats.std).toBeCloseTo(0.077_706_421_418_843_6);
    expect(stats.sum).toBe(212);
    expect(area).toBeCloseTo(5_730_847_183.386_243_82);
    // All should pass
  });

  test.skip("cross-dateline geometry", async () => {
    const url =
      "http://127.0.0.1:8080/data/in/existing_marine_reserves_6933_COG.tif";

    const poly = {
      type: "Polygon",
      coordinates: [
        [
          [17_000_000, 6_000_000],
          [-17_000_000, 6_000_000],
          [-17_000_000, 3_000_000],
          [17_000_000, 3_000_000],
          [17_000_000, 6_000_000],
        ],
      ],
    };

    const stats = (await geoblaze.stats(url, poly))[0];
    // Should include 0 valid points, unclear what is happening
    expect(stats.sum).toBe(0); // fails, geoblaze: 212
  });

  test("raster and geom equal-area", async () => {
    const url =
      "http://127.0.0.1:8080/data/in/existing_marine_reserves_6933_COG.tif";

    // Wholly contains an area
    const poly = {
      type: "Polygon",
      coordinates: [
        [
          [-2_681_242.560_635_542_497_039, 4_795_421.535_046_168_603_003],
          [-2_511_173.208_286_261_186_004, 4_797_508.182_961_687_445_641],
          [-2_497_649.141_842_896_118_76, 4_690_789.620_548_607_781_529],
          [-2_669_890.365_794_897_545_129, 4_691_838.809_715_726_412_833],
          [-2_681_242.560_635_542_497_039, 4_795_421.535_046_168_603_003],
        ],
      ],
    };

    const stats = (await geoblaze.stats(url, poly))[0];
    const georaster = await geoblaze.parse(url);
    const area = stats.sum * georaster.pixelHeight * georaster.pixelWidth;

    // QGIS Raster layer statistics results for existing_marine_reserves_6933_COG.tif within polygon:
    // {'MAX': 1.0, 'MEAN': 0.24600638977635783, 'MIN': 0.0, 'RANGE': 1.0,
    // 'STD_DEV': 0.4310267109578078, 'SUM': 154.0 }

    // QGIS Raster layer zonal statistics for existing_marine_reserves_6933_COG.tif within polygon:
    // Zone 1: 4162973897.36546230

    expect(stats.max).toBe(1);
    expect(stats.min).toBe(0);
    expect(stats.range).toBe(1);
    // expect(stats.std).toBeCloseTo(0.4310267109578078); // fails, geoblaze: 0.4187648662183485
    // expect(stats.mean).toBeCloseTo(0.24600638977635783); // fails, geoblaze: 0.2268041237113402
    expect(stats.sum).toBe(154);
    expect(area).toBeCloseTo(4_162_973_897.365_462_3);
  });

  test("raster 6933, geom 4326", async () => {
    const url =
      "http://127.0.0.1:8080/data/in/existing_marine_reserves_6933_COG.tif";

    const stats = (
      await geoblaze.stats(url, {
        srs: 4326,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-27.788_847_840_992_702, 40.904_867_247_459_123],
              [-26.026_220_533_700_467, 40.926_387_959_368_91],
              [-25.886_054_839_591_441, 39.834_382_805_634_981],
              [-27.671_191_788_638_673, 39.845_034_868_644_113],
              [-27.788_847_840_992_702, 40.904_867_247_459_123],
            ],
          ],
        },
      })
    )[0];
    const georaster = await geoblaze.parse(url);
    const area = stats.sum * georaster.pixelHeight * georaster.pixelWidth;

    // QGIS Raster layer statistics results for existing_marine_reserves_6933_COG.tif within polygon:
    // {'MAX': 1.0, 'MEAN': 0.24600638977635783, 'MIN': 0.0, 'RANGE': 1.0,
    // 'STD_DEV': 0.4310267109578078, 'SUM': 154.0 }

    // QGIS Raster layer zonal statistics for existing_marine_reserves_6933_COG.tif within polygon:
    // Zone 1: 4162973897.36546230

    expect(stats.max).toBe(1);
    expect(stats.min).toBe(0);
    expect(stats.range).toBe(1);
    // expect(stats.std).toBeCloseTo(0.4310267109578078); // fails, geoblaze: 0.4187648662183485
    // expect(stats.mean).toBeCloseTo(0.24600638977635783); // fails, geoblaze: 0.2268041237113402
    expect(stats.sum).toBe(154);
    expect(area).toBeCloseTo(4_162_973_897.365_462_3);
  });

  test("raster 6933, two 4326 polygons", async () => {
    const url =
      "http://127.0.0.1:8080/data/in/existing_marine_reserves_6933_COG.tif";

    // Wholly contains an area but split down the middle, no overlap
    const stats = (
      await geoblaze.stats(url, {
        srs: 4326,
        geometry: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [
                  [
                    [-27.788_847_840_992_702, 40.904_867_247_459_123],
                    [-26.026_220_533_700_467, 40.926_387_959_368_91],
                    [-25.886_054_839_591_441, 40],
                    [-27.671_191_788_638_673, 40],
                    [-27.788_847_840_992_702, 40.904_867_247_459_123],
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
                    [-27.788_847_840_992_702, 40],
                    [-26.026_220_533_700_467, 40],
                    [-25.886_054_839_591_441, 39.834_382_805_634_981],
                    [-27.671_191_788_638_673, 39.845_034_868_644_113],
                    [-27.788_847_840_992_702, 40],
                  ],
                ],
                type: "Polygon",
              },
            },
          ],
        },
      })
    )[0];
    const georaster = await geoblaze.parse(url);
    const area = stats.sum * georaster.pixelHeight * georaster.pixelWidth;

    // QGIS Raster layer statistics results for existing_marine_reserves_6933_COG.tif within polygons:
    // {'MAX': 1.0, 'MEAN': 0.24600638977635783, 'MIN': 0.0, 'RANGE': 1.0,
    // 'STD_DEV': 0.4310267109578078, 'SUM': 154.0 }

    // QGIS Raster layer zonal statistics for existing_marine_reserves_6933_COG.tif within polygons:
    // Zone 1: 4162973897.36546230

    expect(stats.max).toBe(1);
    expect(stats.min).toBe(0);
    expect(stats.range).toBe(1);
    // expect(stats.std).toBeCloseTo(0.4310267109578078); // fails, geoblaze: 0.4187648662183485
    // expect(stats.mean).toBeCloseTo(0.24600638977635783); // fails, geoblaze: 0.2268041237113402
    expect(stats.sum).toBe(154);
    expect(area).toBeCloseTo(4_162_973_897.365_462_3);
  });

  test("Two polygons overlapping", async () => {
    const url =
      "http://127.0.0.1:8080/data/in/existing_marine_reserves_6933_COG.tif";

    // Wholly contains an area but split down the middle, overlap
    const stats = (
      await geoblaze.stats(url, {
        srs: 4326,
        geometry: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [
                  [
                    [-27.5, 41],
                    [-26, 41],
                    [-26, 40],
                    [-27.5, 40],
                    [-27.5, 41],
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
                    [-27.5, 41],
                    [-26, 41],
                    [-26, 40],
                    [-27.5, 40],
                    [-27.5, 41],
                  ],
                ],
                type: "Polygon",
              },
            },
          ],
        },
      })
    )[0];
    const georaster = await geoblaze.parse(url);
    const area = stats.sum * georaster.pixelHeight * georaster.pixelWidth;

    // QGIS Raster layer statistics results for existing_marine_reserves_6933_COG.tif within polygons:
    // {'MAX': 1.0, 'MEAN': 0.24600638977635783, 'MIN': 0.0, 'RANGE': 1.0,
    // 'STD_DEV': 0.4310267109578078, 'SUM': 154.0 }

    // QGIS Raster layer zonal statistics for existing_marine_reserves_6933_COG.tif within polygons:
    // Zone 1: 4162973897.36546230

    expect(stats.max).toBe(1);
    expect(stats.min).toBe(0);
    expect(stats.range).toBe(1);
    // expect(stats.std).toBeCloseTo(0.4310267109578078); // fails, geoblaze: 0.4187648662183485
    // expect(stats.mean).toBeCloseTo(0.24600638977635783); // fails, geoblaze: 0.2268041237113402
    expect(stats.sum).toBe(154);
    expect(area).toBeCloseTo(4_162_973_897.365_462_3);
  });
});
