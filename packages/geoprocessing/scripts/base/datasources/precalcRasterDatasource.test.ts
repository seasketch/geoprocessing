/**
 * @jest-environment node
 * @group scripts/e2e
 */

import {
  Geography,
  ProjectClientBase,
  firstMatchingMetric,
  geographySchema,
  metricsSchema,
} from "../../../src";
import configFixtures from "../../../src/testing/fixtures/projectConfig";
import fs from "fs-extra";
import path from "path";
import { precalcDatasources } from "./precalcDatasources";
import { importDatasource } from "./importDatasource";
import { writeGeographies } from "../geographies/geographies";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "data/in";
const dstPath = "data/out";

const eezSrc = "eez";

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
        formats: ["json"],
        propertiesToKeep: [],
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      }
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
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      }
    );
    // Create geography
    const eezGeog: Geography = {
      geographyId: geographyId,
      datasourceId: geogDatasourceId,
      display: geographyId,
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
    });

    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);
    expect(metrics.length).toBe(3);

    const areaMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "area"
    );
    expect(areaMetric).toBeTruthy();

    const countMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "count"
    );
    expect(countMetric).toBeTruthy();
    expect(countMetric.value).toBe(1);

    const sumMetric = firstMatchingMetric(metrics, (m) => m.metricId === "sum");
    expect(sumMetric).toBeTruthy();
    expect(sumMetric.value).toBe(49);

    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(path.join(dstPath, `${datasourceId}.tif`));
    fs.removeSync(precalcFilePath);
  }, 5000);

  test("precalcRasterDatasource - geography using external subdivided datasource", async () => {
    const dsFilename = "datasources_precalc_raster_test_3.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const datasourceId = "samoa_benthic_reef_sand";
    const geogDatasourceId = "eez_raster2";
    const geogFilename = "geographies_precalc_raster_test_3.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const geographyId = "eez_raster2";
    const precalcFilename = "precalc_raster_test_2.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);
    // Start off with clean empty datasources file
    fs.writeJSONSync(dsFilePath, [
      {
        datasourceId: "global-clipping-eez-land-union",
        geo_type: "vector",
        url: "https://d3muy0hbwp5qkl.cloudfront.net",
        formats: ["subdivided"],
        classKeys: [],
        idProperty: "UNION",
        nameProperty: "UNION",
      },
    ]);
    // First import the datasources
    await importDatasource(
      projectClient,
      {
        geo_type: "vector",
        src: path.join(srcPath, `${eezSrc}.json`),
        datasourceId: geogDatasourceId,
        classKeys: [],
        formats: ["json"],
        propertiesToKeep: [],
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      }
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
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      }
    );
    // Create geography
    const eezGeog: Geography = {
      geographyId: geographyId,
      datasourceId: "global-clipping-eez-land-union",
      propertyFilter: {
        property: "UNION",
        values: ["Samoa"],
      },
      bboxFilter: [
        -173.7746906500533, -17.55526875286155, -165.2008333331916,
        -10.024476331539347,
      ],
      display: geographyId,
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
    });
    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);
    expect(metrics.length).toBe(3);
    const areaMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "area"
    );
    expect(areaMetric).toBeTruthy();

    const countMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "count"
    );
    expect(countMetric).toBeTruthy();
    expect(countMetric.value).toBe(1);

    const sumMetric = firstMatchingMetric(metrics, (m) => m.metricId === "sum");
    expect(sumMetric).toBeTruthy();
    expect(sumMetric.value).toBe(70);
    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(path.join(dstPath, `${datasourceId}.tif`));
    fs.removeSync(precalcFilePath);
  }, 5000);

  test("precalcRasterDatasource - geography using external flatgeobuf datasource", async () => {
    const dsFilename = "datasources_precalc_raster_test_3.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const datasourceId = "samoa_benthic_reef_sand";
    const geogDatasourceId = "eez_raster3";
    const geogFilename = "geographies_precalc_raster_test_3.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const geographyId = "eez_raster3";
    const precalcFilename = "precalc_raster_test_3.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);
    // Start off with clean empty datasources file
    fs.writeJSONSync(dsFilePath, [
      {
        datasourceId: "global-clipping-eez-land-union",
        geo_type: "vector",
        url: "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-eez-with-land-mr-v3.fgb",
        formats: ["fgb"],
        classKeys: [],
        idProperty: "UNION",
        nameProperty: "UNION",
      },
    ]);
    // First import the datasources
    await importDatasource(
      projectClient,
      {
        geo_type: "vector",
        src: path.join(srcPath, `${eezSrc}.json`),
        datasourceId: geogDatasourceId,
        classKeys: [],
        formats: ["json"],
        propertiesToKeep: [],
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      }
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
      },
      {
        newDatasourcePath: dsFilePath,
        newDstPath: dstPath,
        doPublish: false,
      }
    );
    // Create geography
    const eezGeog: Geography = {
      geographyId: geographyId,
      datasourceId: "global-clipping-eez-land-union",
      propertyFilter: {
        property: "UNION",
        values: ["Samoa"],
      },
      bboxFilter: [
        -173.7746906500533, -17.55526875286155, -165.2008333331916,
        -10.024476331539347,
      ],
      display: geographyId,
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
    });
    // Verify precalc
    const metrics = fs.readJSONSync(precalcFilePath);
    metricsSchema.parse(metrics);
    expect(metrics.length).toBe(3);
    const areaMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "area"
    );
    expect(areaMetric).toBeTruthy();

    const countMetric = firstMatchingMetric(
      metrics,
      (m) => m.metricId === "count"
    );
    expect(countMetric).toBeTruthy();
    expect(countMetric.value).toBe(1);

    const sumMetric = firstMatchingMetric(metrics, (m) => m.metricId === "sum");
    expect(sumMetric).toBeTruthy();
    expect(sumMetric.value).toBe(70);
    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(path.join(dstPath, `${datasourceId}.tif`));
    fs.removeSync(precalcFilePath);
  }, 5000);
});
