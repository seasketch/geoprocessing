import {
  Geography,
  ProjectClientBase,
  firstMatchingMetric,
  geographySchema,
  metricsSchema,
} from "../../../src/index.js";
import fs from "fs-extra";
import path from "node:path";
import { precalcDatasources } from "./precalcDatasources.js";
import { importDatasource } from "./importDatasource.js";
import { writeGeographies } from "../geographies/geographies.js";
import configFixtures from "../../../src/testing/fixtures/projectConfig.js";
import { describe, beforeEach, expect, test } from "vitest";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "data/in";
const dstPath = "data/out";
const port = 8080;

const eezSrc = "eez";
const multiEezSrc = "two-samoas-eez";
const reefSrc = "samoa_benthic_reef_sand";

describe("precalcRasterDatasource", () => {
  beforeEach(() => {
    // Ensure test data folder
    fs.mkdirsSync(dstPath);
  });
  test("precalcRasterDatasource - single file, single class should write geography and precalc raster metrics", async () => {
    const dsFilename = "datasources_precalc_raster_test_1.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const datasourceId = "samoa_benthic_reef_sand";

    const geogDatasourceId = "eez_raster1";
    const geogFilename = "geographies_precalc_raster_test_1.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const geographyId = "eez_raster1";

    const precalcFilename = "precalc_raster_test_1.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);

    // Start off with clean empty datasources file
    fs.writeJSONSync(dsFilePath, []);

    // First import the datasources
    await importDatasource(
      projectClient,
      {
        geo_type: "vector",
        src: path.join(srcPath, `${eezSrc}.json`),
        datasourceId: geogDatasourceId,
        classKeys: [],
        formats: ["fgb", "json"],
        propertiesToKeep: [],
        precalc: true,
        explodeMulti: true,
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      },
    );
    await importDatasource(
      projectClient,
      {
        geo_type: "raster",
        src: path.join(srcPath, `${datasourceId}.tif`),
        datasourceId,
        classKeys: [],
        formats: ["tif"],
        noDataValue: 0,
        band: 1,
        measurementType: "quantitative",
        precalc: true,
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      },
    );
    // Create geography
    const eezGeog: Geography = {
      geographyId: geographyId,
      datasourceId: geogDatasourceId,
      display: geographyId,
      precalc: true,
    };
    writeGeographies([eezGeog], geogFilePath);
    const savedGeos = fs.readJSONSync(geogFilePath);
    expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
    geographySchema.parse(savedGeos[0]);

    await precalcDatasources(projectClient, {
      newDatasourcePath: dsFilePath,
      newGeographyPath: geogFilePath,
      newPrecalcPath: precalcFilePath,
      newDstPath: dstPath,
      port,
    });

    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);

    // Should create metrics for both the geography datasource and the raster datasource
    expect(metrics.length).toBe(6);

    const areaMetrics = metrics.filter((m) => m.metricId === "area");
    // vector ds area and raster ds area
    expect(areaMetrics.length).toEqual(2);

    const countMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "valid",
    );
    expect(countMetric).toBeTruthy();
    expect(countMetric.value).toBe(53);

    const sumMetric = firstMatchingMetric(metrics, (m) => m.metricId === "sum");
    expect(sumMetric).toBeTruthy();
    expect(sumMetric.value).toBe(53);

    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(path.join(dstPath, `${datasourceId}.tif`));
    fs.removeSync(precalcFilePath);
  }, 60_000);

  test("precalcRasterDatasource - multiple geog scenarios with external subdivided datasource", async () => {
    const dsFilename = "datasources_precalc_raster_test_9.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const rasterDatasourceId = "samoa_benthic_reef_sand9";
    const geogDatasourceId = "global-clipping-eez-land-union";
    const geogFilename = "geographies_precalc_raster_test_9.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const precalcFilename = "precalc_raster_test_9.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);

    // Start off with clean empty datasources file
    //TODO: remove this once global datasources are updated, because they'll be added by default on datasource import
    fs.writeJSONSync(dsFilePath, [
      {
        datasourceId: geogDatasourceId,
        geo_type: "vector",
        url: "https://d3muy0hbwp5qkl.cloudfront.net",
        formats: ["subdivided"],
        classKeys: [],
        idProperty: "UNION",
        nameProperty: "UNION",
        precalc: false,
      },
    ]);

    // Import raster to test against with known counts (both Samoa and American Samoa)
    await importDatasource(
      projectClient,
      {
        geo_type: "raster",
        src: path.join(srcPath, `${reefSrc}.tif`),
        datasourceId: rasterDatasourceId,
        classKeys: [],
        formats: ["tif"],
        noDataValue: 0,
        band: 1,
        measurementType: "quantitative",
        precalc: true,
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      },
    );

    // Create geographies that reference this datasource

    // Box filter should give all polygons within bounding box (more than 2)
    const geogBoxFilter: Geography = {
      geographyId: "geog-box-filter",
      datasourceId: geogDatasourceId,
      display: "geog-box-filter",
      bboxFilter: [
        -174.511_394_471_577_574_4, -17.555_268_752_861_550_8,
        -165.200_833_333_191_610_6, -10.024_476_331_539_347,
      ],
      precalc: true,
    };

    // Filter to single polygon geography
    const geogSingleFilter: Geography = {
      geographyId: "geog-single-filter",
      datasourceId: geogDatasourceId,
      propertyFilter: {
        property: "UNION",
        values: ["Samoa"],
      },
      bboxFilter: [
        -173.774_690_650_053_3, -17.555_268_752_861_55, -165.200_833_333_191_6,
        -10.024_476_331_539_347,
      ],
      display: "geog-single-filter",
      precalc: true,
    };

    // Filter should give two Samoan polygons
    const geogDoubleFilter: Geography = {
      geographyId: "geog-double-filter",
      datasourceId: geogDatasourceId,
      propertyFilter: {
        property: "UNION",
        values: ["Samoa", "American Samoa"], // Should include two polygons
      },
      bboxFilter: [
        -174.511_394_471_577_574_4, -17.555_268_752_861_550_8,
        -165.200_833_333_191_610_6, -10.024_476_331_539_347,
      ],
      display: "geog-double-filter",
      precalc: true,
    };

    writeGeographies(
      [geogBoxFilter, geogSingleFilter, geogDoubleFilter],
      geogFilePath,
    );

    await precalcDatasources(projectClient, {
      newDatasourcePath: dsFilePath,
      newGeographyPath: geogFilePath,
      newPrecalcPath: precalcFilePath,
      newDstPath: dstPath,
      port,
    });
    const savedGeos = fs.readJSONSync(geogFilePath);
    expect(Array.isArray(savedGeos) && savedGeos.length === 3).toBe(true);
    geographySchema.parse(savedGeos[0]);

    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);
    expect(metrics.length).toBe(12); // because precalc false for geog datasource

    const boxFilterSumMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-box-filter" && m.metricId === "sum",
    );
    expect(boxFilterSumMetric.value).toEqual(101);

    const boxFilterAreaMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-box-filter" && m.metricId === "area",
    );
    expect(boxFilterAreaMetric.value).toEqual(2_617_017_582.013_417); // Very close to QGIS calculated value

    const singleFilterSumMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-single-filter" && m.metricId === "sum",
    );
    expect(singleFilterSumMetric.value).toEqual(76);

    const singleFilterAreaMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-single-filter" && m.metricId === "area",
    );
    expect(singleFilterAreaMetric.value).toBeCloseTo(
      (2_617_017_582.013_417 / 101) * 76,
    );

    const doubleFilterSumMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-double-filter" && m.metricId === "sum",
    );
    expect(doubleFilterSumMetric.value).toEqual(98);

    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${rasterDatasourceId}.tif`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(precalcFilePath);
  }, 10_000);

  test("precalcRasterDatasource - multiple geog scenarios with external flatgeobuf datasource", async () => {
    const dsFilename = "datasources_precalc_raster_test_8.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const rasterDatasourceId = "samoa_benthic_reef_sand8";
    const geogDatasourceId = "global-eez-mr-v12";
    const geogFilename = "geographies_precalc_raster_test_8.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const precalcFilename = "precalc_raster_test_8.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);

    // Start off with clean empty datasources file
    //TODO: remove this once global datasources are updated, because they'll be added by default on datasource import
    fs.writeJSONSync(dsFilePath, [
      {
        datasourceId: geogDatasourceId,
        geo_type: "vector",
        url: `https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/${geogDatasourceId}.fgb`,
        formats: ["fgb", "json"],
        classKeys: [],
        idProperty: "GEONAME",
        nameProperty: "GEONAME",
        precalc: false,
      },
    ]);

    // Import raster to test against with known counts (both Samoa and American Samoa)
    await importDatasource(
      projectClient,
      {
        geo_type: "raster",
        src: path.join(srcPath, `${reefSrc}.tif`),
        datasourceId: rasterDatasourceId,
        classKeys: [],
        formats: ["tif"],
        noDataValue: 0,
        band: 1,
        measurementType: "quantitative",
        precalc: true,
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      },
    );

    // Create geographies that reference this datasource

    // Box filter should give all polygons within bounding box (more than 2)
    const geogBoxFilter: Geography = {
      geographyId: "geog-box-filter",
      datasourceId: geogDatasourceId,
      display: "geog-box-filter",
      bboxFilter: [
        -174.511_394_471_577_574_4, -17.555_268_752_861_550_8,
        -165.200_833_333_191_610_6, -10.024_476_331_539_347,
      ],
      precalc: true,
    };

    // Filter to single polygon geography
    const geogSingleFilter: Geography = {
      geographyId: "geog-single-filter",
      datasourceId: geogDatasourceId,
      propertyFilter: {
        property: "GEONAME",
        values: ["Samoan Exclusive Economic Zone"],
      },
      bboxFilter: [
        -173.774_690_650_053_3, -17.555_268_752_861_55, -165.200_833_333_191_6,
        -10.024_476_331_539_347,
      ],
      display: "geog-single-filter",
      precalc: true,
    };

    // Filter should give two Samoan polygons
    const geogDoubleFilter: Geography = {
      geographyId: "geog-double-filter",
      datasourceId: geogDatasourceId,
      propertyFilter: {
        property: "GEONAME",
        values: [
          "Samoan Exclusive Economic Zone",
          "United States Exclusive Economic Zone (American Samoa)",
        ], // Should include two polygons
      },
      bboxFilter: [
        -174.511_394_471_577_574_4, -17.555_268_752_861_550_8,
        -165.200_833_333_191_610_6, -10.024_476_331_539_347,
      ],
      display: "geog-double-filter",
      precalc: true,
    };

    writeGeographies(
      [geogBoxFilter, geogSingleFilter, geogDoubleFilter],
      geogFilePath,
    );

    await precalcDatasources(projectClient, {
      newDatasourcePath: dsFilePath,
      newGeographyPath: geogFilePath,
      newPrecalcPath: precalcFilePath,
      newDstPath: dstPath,
      port,
    });

    // Verify geography
    const savedGeos = fs.readJSONSync(geogFilePath);
    expect(Array.isArray(savedGeos) && savedGeos.length === 3).toBe(true);
    geographySchema.parse(savedGeos[0]);

    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);
    expect(metrics.length).toBe(12); // because precalc false for geog datasource

    const boxFilterMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-box-filter" && m.metricId === "sum",
    );
    expect(boxFilterMetric.value).toEqual(70);

    const singleFilterMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-single-filter" && m.metricId === "sum",
    );
    expect(singleFilterMetric.value).toEqual(53);

    const doubleFilterMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-double-filter" && m.metricId === "sum",
    );
    expect(doubleFilterMetric.value).toEqual(69);

    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${rasterDatasourceId}.tif`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(precalcFilePath);
  }, 30_000);

  test("precalcRasterDatasource - multiple geog scenarios with internal geojson datasource", async () => {
    const dsFilename = "datasources_precalc_raster_test_7.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const rasterDatasourceId = "samoa_benthic_reef_sand7";
    const geogDatasourceId = "two-samoas-eez";
    const geogFilename = "geographies_precalc_raster_test_7.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const precalcFilename = "precalc_raster_test_7.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);

    // Start off with clean empty datasources file
    fs.writeJSONSync(dsFilePath, []);

    // First import the two-samoas as internal datasource for geographies
    await importDatasource(
      projectClient,
      {
        geo_type: "vector",
        src: path.join(srcPath, `${multiEezSrc}.json`),
        datasourceId: geogDatasourceId,
        classKeys: [],
        formats: ["fgb", "json"],
        propertiesToKeep: [],
        precalc: false,
        explodeMulti: true,
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      },
    );

    // Import raster to test against with known counts (both Samoa and American Samoa)
    await importDatasource(
      projectClient,
      {
        geo_type: "raster",
        src: path.join(srcPath, `${reefSrc}.tif`),
        datasourceId: rasterDatasourceId,
        classKeys: [],
        formats: ["tif"],
        noDataValue: 0,
        band: 1,
        measurementType: "quantitative",
        precalc: true,
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      },
    );

    // Create geographies that reference this datasource

    // No filter should give all polygons (two) in geography
    const geoBoxFilter: Geography = {
      geographyId: "geog-box-filter",
      datasourceId: geogDatasourceId,
      display: "geog-box-filter",
      precalc: true,
    };

    // Filter to single polygon geography
    const geogSingleFilter: Geography = {
      geographyId: "geog-single-filter",
      datasourceId: geogDatasourceId,
      propertyFilter: {
        property: "GEONAME",
        values: ["Samoan Exclusive Economic Zone"],
      },
      bboxFilter: [
        -173.774_690_650_053_3, -17.555_268_752_861_55, -165.200_833_333_191_6,
        -10.024_476_331_539_347,
      ],
      display: "geog-single-filter",
      precalc: true,
    };

    // Filter should give all polygons (both countries)
    const geogDoubleFilter: Geography = {
      geographyId: "geog-double-filter",
      datasourceId: geogDatasourceId,
      propertyFilter: {
        property: "GEONAME",
        values: [
          "Samoan Exclusive Economic Zone",
          "United States Exclusive Economic Zone (American Samoa)",
        ], // Should include two polygons
      },
      bboxFilter: [
        -174.511_394_471_577_574_4, -17.555_268_752_861_550_8,
        -165.200_833_333_191_610_6, -10.024_476_331_539_347,
      ],
      display: "geog-double-filter",
      precalc: true,
    };

    writeGeographies(
      [geoBoxFilter, geogSingleFilter, geogDoubleFilter],
      geogFilePath,
    );

    await precalcDatasources(projectClient, {
      newDatasourcePath: dsFilePath,
      newGeographyPath: geogFilePath,
      newPrecalcPath: precalcFilePath,
      newDstPath: dstPath,
      port,
    });
    const savedGeos = fs.readJSONSync(geogFilePath);
    expect(Array.isArray(savedGeos) && savedGeos.length === 3).toBe(true);
    geographySchema.parse(savedGeos[0]);

    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);
    expect(metrics.length).toBe(12); // because precalc false for geog datasource

    // check each metric for expected value
    const noFilterMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-box-filter" && m.metricId === "sum",
    );
    expect(noFilterMetric.value).toEqual(69);

    const singleFilterMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-single-filter" && m.metricId === "sum",
    );
    expect(singleFilterMetric.value).toEqual(53);

    const doubleFilterMetric = firstMatchingMetric(
      metrics,
      (m) => m.geographyId === "geog-double-filter" && m.metricId === "sum",
    );
    expect(doubleFilterMetric.value).toEqual(69);

    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${rasterDatasourceId}.tif`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(precalcFilePath);
  }, 20_000);
});
