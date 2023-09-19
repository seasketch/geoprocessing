/**
 * @jest-environment node
 * @group e2e
 */

// @ts-ignore
import geoblaze from "geoblaze";

// Testing using EPSG:6933 NSIDC EASE-Grid 2.0 Global equal-area projection in geoblaze

describe("geoblaze equal-area tests", () => {
  test("discrete raster, no geometry", async () => {
    const url = "http://127.0.0.1:8080/existing_marine_reserves_6933_COG.tif";

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
    expect(stats.mean).toBeCloseTo(0.006075020775424822);
    expect(stats.std).toBeCloseTo(0.0777064214188436);
    expect(stats.sum).toBe(212);
    expect(area).toBeCloseTo(5730847183.38624382);
    // All should pass
  });

  test("cross-dateline geometry", async () => {
    const url = "http://127.0.0.1:8080/existing_marine_reserves_6933_COG.tif";

    const poly = {
      type: "Polygon",
      coordinates: [
        [
          [17000000, 6000000],
          [-17000000, 6000000],
          [-17000000, 3000000],
          [17000000, 3000000],
          [17000000, 6000000],
        ],
      ],
    };

    const stats = (await geoblaze.stats(url, poly))[0];

    // Should include 0 valid points, but cross-dateline polygons
    // expect(stats.sum).toBe(0); // fails, geoblaze: 212
  });

  test("raster and geom equal-area", async () => {
    const url = "http://127.0.0.1:8080/existing_marine_reserves_6933_COG.tif";

    // Wholly contains an area
    const poly = {
      type: "Polygon",
      coordinates: [
        [
          [-2681242.560635542497039, 4795421.535046168603003],
          [-2511173.208286261186004, 4797508.182961687445641],
          [-2497649.14184289611876, 4690789.620548607781529],
          [-2669890.365794897545129, 4691838.809715726412833],
          [-2681242.560635542497039, 4795421.535046168603003],
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
    expect(area).toBeCloseTo(4162973897.3654623);
  });

  test("raster 6933, geom 4326", async () => {
    const url = "http://127.0.0.1:8080/existing_marine_reserves_6933_COG.tif";

    const stats = (
      await geoblaze.stats(url, {
        srs: 4326,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-27.788847840992702, 40.904867247459123],
              [-26.026220533700467, 40.92638795936891],
              [-25.886054839591441, 39.834382805634981],
              [-27.671191788638673, 39.845034868644113],
              [-27.788847840992702, 40.904867247459123],
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
    expect(area).toBeCloseTo(4162973897.3654623);
  });

  test("raster 6933, two 4326 polygons", async () => {
    const url = "http://127.0.0.1:8080/existing_marine_reserves_6933_COG.tif";

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
                    [-27.788847840992702, 40.904867247459123],
                    [-26.026220533700467, 40.92638795936891],
                    [-25.886054839591441, 40],
                    [-27.671191788638673, 40],
                    [-27.788847840992702, 40.904867247459123],
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
                    [-27.788847840992702, 40],
                    [-26.026220533700467, 40],
                    [-25.886054839591441, 39.834382805634981],
                    [-27.671191788638673, 39.845034868644113],
                    [-27.788847840992702, 40],
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
    expect(area).toBeCloseTo(4162973897.3654623);
  });

  test("Two polygons overlapping", async () => {
    const url = "http://127.0.0.1:8080/existing_marine_reserves_6933_COG.tif";

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
    expect(area).toBeCloseTo(4162973897.3654623);
  });
});
