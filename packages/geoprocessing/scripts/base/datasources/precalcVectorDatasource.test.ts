/**
 * @jest-environment node
 * @group scripts/e2e
 */

import {
  Geography,
  ProjectClientBase,
  geographySchema,
  firstMatchingMetric,
  metricsSchema,
} from "../../../src";
import configFixtures from "../../../src/testing/fixtures/projectConfig";
import fs from "fs-extra";
import path from "path";
import { precalcDatasources } from "./precalcDatasources";
import { importDatasource } from "./importDatasource";
import { writeGeographies } from "../geographies/geographies";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "data/testing";
const dstPath = "data/testing/output";

describe("precalcDatasources", () => {
  describe("precalcVectorDatasource", () => {
    beforeEach(() => {
      // Ensure test data folder
      fs.mkdirsSync(dstPath);
    });
    test("precalcVectorDatasource - single file, single class should write geography and precalc vector metrics", async () => {
      const dsFilename = "datasources_precalc_vector_test_1.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const datasourceId = "eez";
      const geogFilename = "geographies_precalc_vector_test_1.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez";
      const precalcFilename = "precalc_vector_test_1.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // Start off with clean empty datasources file
      fs.writeJSONSync(dsFilePath, []);
      // First import the datasource
      const returnedDs = await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${datasourceId}.json`),
          datasourceId,
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
      // Create geography
      const eezGeog: Geography = {
        geographyId: geographyId,
        datasourceId: geographyId,
        display: geographyId,
      };
      writeGeographies([eezGeog], geogFilePath);

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      const validGeos = geographySchema.parse(savedGeos[0]);

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
      fs.removeSync(path.join(dstPath, `${datasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${datasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20000);
    test("precalcVectorDatasource - single geog, multi-class should write geography and precalc vector metrics", async () => {
      const dsFilename = "datasources_precalc_vector_test_2.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId = "shelf_class";
      const geogDatasourceId = "eez";
      const geogFilename = "geographies_precalc_vector_test_2.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez";
      const precalcFilename = "precalc_vector_test_2.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

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
          geo_type: "vector",
          src: path.join(srcPath, `${classDatasourceId}.json`),
          datasourceId: classDatasourceId,
          classKeys: ["Class"],
          formats: [],
          propertiesToKeep: ["Class"],
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

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(8);
      metrics.forEach((metric) => {
        expect(metric.geographyId).toBe("eez");
      });

      const shelfTotalCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-total" && m.metricId === "count"
      );
      expect(shelfTotalCountMetric).toBeTruthy();
      expect(shelfTotalCountMetric.value).toBe(7);

      const shelfTotalAreaMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-total" && m.metricId === "area"
      );
      expect(shelfTotalAreaMetric).toBeTruthy();

      const shelfMediumCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-medium" && m.metricId === "count"
      );
      expect(shelfMediumCountMetric).toBeTruthy();
      expect(shelfMediumCountMetric.value).toBe(2);

      const shelfHighCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-high" && m.metricId === "count"
      );
      expect(shelfHighCountMetric).toBeTruthy();
      expect(shelfHighCountMetric.value).toBe(5);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${classDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId}.json`));
      fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20000);
    test("precalcVectorDatasource - single geog, two datasources should write metrics", async () => {
      const dsFilename = "datasources_precalc_vector_test_3.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId1 = "shelf_class";
      const classDatasourceId2 = "deepwater_bioregions";
      const geogDatasourceId = "eez";
      const geogFilename = "geographies_precalc_vector_test_3.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez";
      const precalcFilename = "precalc_vector_test_3.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

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
          geo_type: "vector",
          src: path.join(srcPath, `${classDatasourceId1}.json`),
          datasourceId: classDatasourceId1,
          classKeys: ["Class"],
          formats: [],
          propertiesToKeep: ["Class"],
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

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Import second datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${classDatasourceId2}.json`),
          datasourceId: classDatasourceId2,
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

      // Precalc second datasource
      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
      });
      const savedGeos2 = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos2) && savedGeos2.length === 1).toBe(true);
      geographySchema.parse(savedGeos2[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      console.log(metrics);
      expect(metrics.length).toBe(10);
      metrics.forEach((metric) => {
        expect(metric.geographyId).toBe("eez");
      });

      const shelfTotalCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-total" && m.metricId === "count"
      );
      expect(shelfTotalCountMetric).toBeTruthy();
      expect(shelfTotalCountMetric.value).toBe(7);

      const shelfTotalAreaMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-total" && m.metricId === "area"
      );
      expect(shelfTotalAreaMetric).toBeTruthy();

      const shelfMediumCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-medium" && m.metricId === "count"
      );
      expect(shelfMediumCountMetric).toBeTruthy();
      expect(shelfMediumCountMetric.value).toBe(2);

      const shelfHighCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-high" && m.metricId === "count"
      );
      expect(shelfHighCountMetric).toBeTruthy();
      expect(shelfHighCountMetric.value).toBe(5);

      const deepwaterCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === "deepwater_bioregions-total" && m.metricId === "count"
      );
      expect(deepwaterCountMetric).toBeTruthy();
      expect(deepwaterCountMetric.value).toBe(8);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${classDatasourceId1}.fgb`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId1}.json`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId2}.fgb`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId2}.json`));
      fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20000);
    test("precalcVectorDatasource - single geog, update datasource", async () => {
      const dsFilename = "datasources_precalc_vector_test_4.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId1 = "shelf_class";
      const classDatasourceId2 = "shelf_class_updated";
      const geogDatasourceId = "eez";
      const geogFilename = "geographies_precalc_vector_test_4.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez";
      const precalcFilename = "precalc_vector_test_4.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // First import geography
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
      // Import first datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${classDatasourceId1}.json`),
          datasourceId: classDatasourceId1,
          classKeys: ["Class"],
          formats: [],
          propertiesToKeep: ["Class"],
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

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Import "updated" datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${classDatasourceId2}.json`),
          datasourceId: classDatasourceId1,
          classKeys: ["Class"],
          formats: [],
          propertiesToKeep: ["Class"],
        },
        {
          newDatasourcePath: dsFilePath,
          newDstPath: dstPath,
          doPublish: false,
        }
      );

      // Precalc datasources again
      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
      });
      const savedGeos2 = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos2) && savedGeos2.length === 1).toBe(true);
      geographySchema.parse(savedGeos2[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(6);
      metrics.forEach((metric) => {
        expect(metric.geographyId).toBe("eez");
      });

      const shelfTotalCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-total" && m.metricId === "count"
      );
      expect(shelfTotalCountMetric).toBeTruthy();
      expect(shelfTotalCountMetric.value).toBe(5);

      const shelfTotalAreaMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-total" && m.metricId === "area"
      );
      expect(shelfTotalAreaMetric).toBeTruthy();

      const shelfHighCountMetric = firstMatchingMetric(
        metrics,
        (m) => m.classId === "shelf_class-high" && m.metricId === "count"
      );
      expect(shelfHighCountMetric).toBeTruthy();
      expect(shelfHighCountMetric.value).toBe(5);

      try {
        const shelfMediumCountMetric = firstMatchingMetric(
          metrics,
          (m) => m.classId === "shelf_class-medium" && m.metricId === "count"
        );
        expect(shelfMediumCountMetric).toBeFalsy();
      } catch (err: unknown) {
        // Erroring is the correct behavior
      }

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${classDatasourceId1}.fgb`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId1}.json`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId2}.fgb`));
      fs.removeSync(path.join(dstPath, `${classDatasourceId2}.json`));
      fs.removeSync(path.join(dstPath, `${geogDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${geogDatasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20000);
  });
});
