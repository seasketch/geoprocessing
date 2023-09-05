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

describe("precalcRasterDatasource", () => {
  beforeEach(() => {
    // Ensure test data folder
    fs.mkdirsSync(dstPath);
  });
  test("precalcRasterDatasource - single file, single class should write geography and precalc raster metrics", async () => {
    const dsFilename = "datasources_precalc_raster_test_1.json";
    const dsFilePath = path.join(dstPath, dsFilename);
    const datasourceId = "samoa_benthic_reef_sand";

    const geogDatasourceId = "eez";
    const geogFilename = "geographies_precalc_raster_test_1.json";
    const geogFilePath = path.join(dstPath, geogFilename);
    const geographyId = "eez";

    const precalcFilename = "precalc_raster_test_1.json";
    const precalcFilePath = path.join(dstPath, precalcFilename);

    // Start off with clean empty datasources file
    fs.writeJSONSync(dsFilePath, []);

    // First import the datasources
    await importDatasource(
      projectClient,
      {
        geo_type: "vector",
        src: path.join(srcPath, `${geogDatasourceId}.json`),
        datasourceId: geogDatasourceId,
        classKeys: [],
        formats: [],
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
        formats: [],
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
      datasourceId: geographyId,
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
    expect(metrics.length).toBe(2);
    metrics.forEach((metric) => {
      expect(metric.classId).toBe("eez-total");
      expect(metric.geographyId).toBe("eez");
    });

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

    fs.removeSync(dsFilePath);
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
    fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
    fs.removeSync(geogFilePath);
    fs.removeSync(path.join(dstPath, `${datasourceId}.tif`));
    fs.removeSync(precalcFilePath);
  }, 20000);
});
