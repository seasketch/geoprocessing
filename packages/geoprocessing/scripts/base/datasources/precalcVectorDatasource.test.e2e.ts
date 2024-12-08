import {
  Geography,
  ProjectClientBase,
  geographySchema,
  firstMatchingMetric,
  metricsSchema,
  isInternalVectorDatasource,
} from "../../../src/index.js";
import configFixtures from "../../../src/testing/fixtures/projectConfig.js";
import fs from "fs-extra";
import path from "node:path";
import { precalcDatasources } from "./precalcDatasources.js";
import { importDatasource } from "./importDatasource.js";
import { writeGeographies } from "../geographies/geographies.js";
import { expect, describe, test, beforeEach } from "vitest";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "data/in";
const dstPath = "data/out";
const port = 8080;
const eezSrc = "eez";
const eezCrossSrc = "samoa-eez-cross";
const shelfSrc = "shelf_class";
const shelfSrcUpdated = "shelf_class_updated";
const deepwaterSrc = "deepwater_bioregions";

describe("precalcDatasources", () => {
  describe("precalcVectorDatasource", () => {
    beforeEach(() => {
      // Ensure test data folder
      fs.mkdirsSync(dstPath);
    });

    test("precalcVectorDatasource - single geog, internal datasource, single class", async () => {
      const dsFilename = "datasources_precalc_vector_test_1.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const datasourceId = "eez1";
      const geogFilename = "geographies_precalc_vector_test_1.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez1";
      const precalcFilename = "precalc_vector_test_1.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // Start off with clean empty datasources file
      fs.writeJSONSync(dsFilePath, []);
      // First import the datasource
      const returnedDs = await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezSrc}.json`),
          datasourceId,
          classKeys: [],
          formats: ["fgb"],
          propertiesToKeep: [],
          precalc: true,
          explodeMulti: false,
        },
        {
          newDatasourcePath: dsFilePath,
          newDstPath: dstPath,
          doPublish: false,
        },
      );

      // Verify explode option came out false in datasource
      if (isInternalVectorDatasource(returnedDs)) {
        expect(returnedDs.explodeMulti).toBe(false);
      } else {
        throw new Error("expected internal vector datasource");
      }

      // Create geography
      const eezGeog: Geography = {
        geographyId: geographyId,
        datasourceId: geographyId,
        display: geographyId,
        precalc: true,
      };
      writeGeographies([eezGeog], geogFilePath);

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(2);
      for (const metric of metrics) {
        expect(metric.classId).toBe(`${geographyId}-total`);
        expect(metric.geographyId).toBe(geographyId);
      }

      const areaMetric = firstMatchingMetric(
        metrics,
        (m) => m.metricId === "area",
      );
      expect(areaMetric).toBeTruthy();

      const countMetric = firstMatchingMetric(
        metrics,
        (m) => m.metricId === "count",
      );
      expect(countMetric).toBeTruthy();
      expect(countMetric.value).toBe(1);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${datasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${datasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20_000);

    test("precalcVectorDatasource - single geog, internal datasource, multi-class", async () => {
      const dsFilename = "datasources_precalc_vector_test_2.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId = "shelf_class2";
      const geogDatasourceId = "eez2";
      const geogFilename = "geographies_precalc_vector_test_2.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez2";
      const precalcFilename = "precalc_vector_test_2.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // First import the datasources
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezSrc}.json`),
          datasourceId: geogDatasourceId,
          classKeys: [],
          formats: ["fgb"],
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
          geo_type: "vector",
          src: path.join(srcPath, `${shelfSrc}.json`),
          datasourceId: classDatasourceId,
          classKeys: ["Class"],
          formats: ["fgb"],
          propertiesToKeep: ["Class"],
          precalc: true,
          explodeMulti: true,
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
        datasourceId: geographyId,
        display: geographyId,
        precalc: true,
      };
      writeGeographies([eezGeog], geogFilePath);

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(8);
      for (const metric of metrics) {
        expect(metric.geographyId).toBe(geogDatasourceId);
      }

      const shelfTotalCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId}-total` && m.metricId === "count",
      );
      expect(shelfTotalCountMetric).toBeTruthy();
      expect(shelfTotalCountMetric.value).toBe(7);

      const shelfTotalAreaMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId}-total` && m.metricId === "area",
      );
      expect(shelfTotalAreaMetric).toBeTruthy();

      const shelfMediumCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId}-medium` && m.metricId === "count",
      );
      expect(shelfMediumCountMetric).toBeTruthy();
      expect(shelfMediumCountMetric.value).toBe(2);

      const shelfHighCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId}-high` && m.metricId === "count",
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
    }, 20_000);
    test("precalcVectorDatasource - single geog, two datasources should write metrics", async () => {
      const dsFilename = "datasources_precalc_vector_test_3.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId1 = "shelf_class3";
      const classDatasourceId2 = "deepwater_bioregions3";
      const geogDatasourceId = "eez3";
      const geogFilename = "geographies_precalc_vector_test_3.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez3";
      const precalcFilename = "precalc_vector_test_3.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // First import the datasources
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezSrc}.json`),
          datasourceId: geogDatasourceId,
          classKeys: [],
          formats: ["fgb"],
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
          geo_type: "vector",
          src: path.join(srcPath, `${shelfSrc}.json`),
          datasourceId: classDatasourceId1,
          classKeys: ["Class"],
          formats: ["fgb"],
          propertiesToKeep: ["Class"],
          precalc: true,
          explodeMulti: true,
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
        datasourceId: geographyId,
        display: geographyId,
        precalc: true,
      };
      writeGeographies([eezGeog], geogFilePath);

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Import second datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${deepwaterSrc}.json`),
          datasourceId: classDatasourceId2,
          classKeys: [],
          formats: ["fgb"],
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

      // Precalc second datasource
      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos2 = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos2) && savedGeos2.length === 1).toBe(true);
      geographySchema.parse(savedGeos2[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(10);
      for (const metric of metrics) {
        expect(metric.geographyId).toBe(geogDatasourceId);
      }

      const shelfTotalCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-total` && m.metricId === "count",
      );
      expect(shelfTotalCountMetric).toBeTruthy();
      expect(shelfTotalCountMetric.value).toBe(7);

      const shelfTotalAreaMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-total` && m.metricId === "area",
      );
      expect(shelfTotalAreaMetric).toBeTruthy();

      const shelfMediumCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-medium` &&
          m.metricId === "count",
      );
      expect(shelfMediumCountMetric).toBeTruthy();
      expect(shelfMediumCountMetric.value).toBe(2);

      const shelfHighCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-high` && m.metricId === "count",
      );
      expect(shelfHighCountMetric).toBeTruthy();
      expect(shelfHighCountMetric.value).toBe(5);

      const deepwaterCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId2}-total` && m.metricId === "count",
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
    }, 20_000);
    test("precalcVectorDatasource - single geog, update datasource", async () => {
      const dsFilename = "datasources_precalc_vector_test_4.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId1 = "shelf_class4";
      const classDatasourceId2 = "shelf_class_updated4";
      const geogDatasourceId = "eez4";
      const geogFilename = "geographies_precalc_vector_test_4.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez4";
      const precalcFilename = "precalc_vector_test_4.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // Import first datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezSrc}.json`),
          datasourceId: geogDatasourceId,
          classKeys: [],
          formats: ["fgb"],

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
      // Import second datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${shelfSrc}.json`),
          datasourceId: classDatasourceId1,
          classKeys: ["Class"],
          formats: ["fgb"],
          propertiesToKeep: ["Class"],
          precalc: true,
          explodeMulti: true,
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
        datasourceId: geographyId,
        display: geographyId,
        precalc: true,
      };
      writeGeographies([eezGeog], geogFilePath);

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Import "updated" datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${shelfSrcUpdated}.json`),
          datasourceId: classDatasourceId1,
          classKeys: ["Class"],
          formats: ["fgb"],
          propertiesToKeep: ["Class"],
          precalc: true,
          explodeMulti: true,
        },
        {
          newDatasourcePath: dsFilePath,
          newDstPath: dstPath,
          doPublish: false,
        },
      );

      // Precalc datasources again
      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos2 = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos2) && savedGeos2.length === 1).toBe(true);
      geographySchema.parse(savedGeos2[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(6);
      for (const metric of metrics) {
        expect(metric.geographyId).toBe(geogDatasourceId);
      }

      const shelfTotalCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-total` && m.metricId === "count",
      );
      expect(shelfTotalCountMetric).toBeTruthy();
      expect(shelfTotalCountMetric.value).toBe(5);

      const shelfTotalAreaMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-total` && m.metricId === "area",
      );
      expect(shelfTotalAreaMetric).toBeTruthy();

      const shelfHighCountMetric = firstMatchingMetric(
        metrics,
        (m) =>
          m.classId === `${classDatasourceId1}-high` && m.metricId === "count",
      );
      expect(shelfHighCountMetric).toBeTruthy();
      expect(shelfHighCountMetric.value).toBe(5);

      try {
        const shelfMediumCountMetric = firstMatchingMetric(
          metrics,
          (m) =>
            m.classId === `${classDatasourceId1}-medium` &&
            m.metricId === "count",
        );
        expect(shelfMediumCountMetric).toBeFalsy();
      } catch {
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
    }, 20_000);

    test("precalcVectorDatasource - multiple geog scenarios with external subdivided datasource", async () => {
      const dsFilename = "datasources_precalc_vector_test_6.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const internalDatasourceId = "samoa-eez-cross";
      const externalDatasourceId = "global-clipping-eez-land-union";
      const geogFilename = "geographies_precalc_vector_test_6.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const precalcFilename = "precalc_vector_test_6.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // start with external datasource for geography
      fs.writeJSONSync(dsFilePath, [
        {
          datasourceId: externalDatasourceId,
          geo_type: "vector",
          url: `https://d3muy0hbwp5qkl.cloudfront.net`,
          formats: ["subdivided"],
          classKeys: [],
          idProperty: "UNION",
          nameProperty: "UNION",
          precalc: false, // precalc false because we only need the geography included in precalc, not its datasource in its entirety
        },
      ]);

      // add internal datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezCrossSrc}.json`),
          datasourceId: internalDatasourceId,
          classKeys: [],
          formats: ["fgb"],
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

      // Create geographies that reference this datasource

      // Box filter should give all polygons within bounding box (more than 2)
      const geogBoxFilter: Geography = {
        geographyId: "geog-box-filter",
        datasourceId: externalDatasourceId,
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
        datasourceId: externalDatasourceId,
        propertyFilter: {
          property: "UNION",
          values: ["Samoa"],
        },
        bboxFilter: [
          -173.774_690_650_053_3, -17.555_268_752_861_55,
          -165.200_833_333_191_6, -10.024_476_331_539_347,
        ],
        display: "geog-single-filter",
        precalc: true,
      };

      // Filter should give two Samoan polygons
      const geogDoubleFilter: Geography = {
        geographyId: "geog-double-filter",
        datasourceId: externalDatasourceId,
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

      // Verify geography file
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 3).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(6); // because precalc false for geog datasource

      const countMetrics = metrics.filter((m) => m.metricId === "count");
      expect(countMetrics.length).toEqual(3);

      const boxFilterMetric = firstMatchingMetric(
        metrics,
        (m) => m.geographyId === "geog-box-filter" && m.metricId === "area",
      );
      // Largest area value
      expect(boxFilterMetric.value).toEqual(61_852_303_909.376_854);

      const singleFilterMetric = firstMatchingMetric(
        metrics,
        (m) => m.geographyId === "geog-single-filter" && m.metricId === "area",
      );
      // Smallest area value, samoa only

      expect(singleFilterMetric.value).toEqual(37_738_114_925.589_806);

      const doubleFilterMetric = firstMatchingMetric(
        metrics,
        (m) => m.geographyId === "geog-double-filter" && m.metricId === "area",
      );
      // Slightly larger area value, both samoa
      expect(doubleFilterMetric.value).toEqual(39_645_944_257.713_905);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${internalDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${internalDatasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20_000);

    test("precalcVectorDatasource - multiple geog scenarios with external flatgeobuf datasource", async () => {
      const dsFilename = "datasources_precalc_vector_test_7.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const internalDatasourceId = "samoa-eez-cross";
      const externalDatasourceId = "global-eez-mr-v12";
      const geogFilename = "geographies_precalc_vector_test_7.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const precalcFilename = "precalc_vector_test_7.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // start with external datasource for geography
      fs.writeJSONSync(dsFilePath, [
        {
          datasourceId: externalDatasourceId,
          geo_type: "vector",
          url: `https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/${externalDatasourceId}.fgb`,
          formats: ["fgb"],
          classKeys: [],
          idProperty: "GEONAME",
          nameProperty: "GEONAME",
          precalc: false, // precalc false because we only need the geography included in precalc, not its datasource in its entirety
        },
      ]);

      // add internal datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezCrossSrc}.json`),
          datasourceId: internalDatasourceId,
          classKeys: [],
          formats: ["fgb"],
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

      // Create geographies that reference this datasource

      // Box filter should give all eez polygons within bounding box (more than 2)
      const geogBoxFilter: Geography = {
        geographyId: "geog-box-filter",
        datasourceId: externalDatasourceId,
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
        datasourceId: externalDatasourceId,
        propertyFilter: {
          property: "GEONAME",
          values: ["Samoan Exclusive Economic Zone"],
        },
        bboxFilter: [
          -173.774_690_650_053_3, -17.555_268_752_861_55,
          -165.200_833_333_191_6, -10.024_476_331_539_347,
        ],
        display: "geog-single-filter",
        precalc: true,
      };

      // Filter should give two Samoan polygons
      const geogDoubleFilter: Geography = {
        geographyId: "geog-double-filter",
        datasourceId: externalDatasourceId,
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

      // Verify geography file
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 3).toBe(true);
      geographySchema.parse(savedGeos[0]);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(6); // because precalc false for geog datasource

      const countMetrics = metrics.filter((m) => m.metricId === "count");
      expect(countMetrics.length).toEqual(3);

      const boxFilterMetric = firstMatchingMetric(
        metrics,
        (m) => m.geographyId === "geog-box-filter" && m.metricId === "area",
      );
      // Largest area value
      expect(boxFilterMetric.value).toEqual(59_556_498_695.328_66);

      const singleFilterMetric = firstMatchingMetric(
        metrics,
        (m) => m.geographyId === "geog-single-filter" && m.metricId === "area",
      );
      // Smallest area value, samoa only
      expect(singleFilterMetric.value).toEqual(35_442_309_711.542_16);

      const doubleFilterMetric = firstMatchingMetric(
        metrics,
        (m) => m.geographyId === "geog-double-filter" && m.metricId === "area",
      );
      // Slightly larger area value, both samoa
      expect(doubleFilterMetric.value).toEqual(37_350_139_043.666_25);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${internalDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${internalDatasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20_000);

    test("precalcVectorDatasource - world geog, external datasource", async () => {
      const dsFilename = "datasources_precalc_vector_test_8.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const datasourceId = "world";
      const geogFilename = "geographies_precalc_vector_test_8.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "world";
      const precalcFilename = "precalc_vector_test_8.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // start with external datasource for geography
      fs.writeJSONSync(dsFilePath, [
        {
          datasourceId,
          geo_type: "vector",
          formats: ["json", "fgb"],
          layerName: "world",
          classKeys: [],
          url: "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world.fgb",
          propertiesToKeep: [],
          precalc: true,
        },
      ]);

      // Create geography
      const worldGeog: Geography = {
        geographyId: geographyId,
        datasourceId: geographyId,
        display: geographyId,
        groups: ["default-boundary"],
        precalc: true,
      };
      writeGeographies([worldGeog], geogFilePath);

      // should fallback to world since datasource has no bboxFilter
      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(2);
      for (const metric of metrics) {
        expect(metric.classId).toBe(`${geographyId}-total`);
        expect(metric.geographyId).toBe(geographyId);
      }

      const areaMetric = firstMatchingMetric(
        metrics,
        (m) => m.metricId === "area",
      );
      expect(areaMetric).toBeTruthy();

      const countMetric = firstMatchingMetric(
        metrics,
        (m) => m.metricId === "count",
      );
      expect(countMetric).toBeTruthy();
      expect(countMetric.value).toBe(1);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${datasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${datasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20_000);

    test("precalcVectorDatasource - world geog, internal datasource", async () => {
      const dsFilename = "datasources_precalc_vector_test_9.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const datasourceId = "world";
      const internalDatasourceId = "ecological_value";
      const internalFilename = "multi_class_valuability.json";
      const geogFilename = "geographies_precalc_vector_test_9.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "world";
      const precalcFilename = "precalc_vector_test_9.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // start with external datasource for geography
      fs.writeJSONSync(dsFilePath, [
        {
          datasourceId,
          geo_type: "vector",
          formats: ["json", "fgb"],
          layerName: "world",
          classKeys: [],
          url: "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/world.fgb",
          propertiesToKeep: [],
          precalc: false,
        },
      ]);

      // add internal datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${internalFilename}`),
          datasourceId: internalDatasourceId,
          classKeys: ["Value"],
          formats: ["fgb"],
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

      // Create geography
      const worldGeog: Geography = {
        geographyId: geographyId,
        datasourceId: geographyId,
        display: geographyId,
        groups: ["default-boundary"],
        precalc: true,
      };
      writeGeographies([worldGeog], geogFilePath);

      // should fallback to world since datasource has no bboxFilter
      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });
      const savedGeos = fs.readJSONSync(geogFilePath);
      expect(Array.isArray(savedGeos) && savedGeos.length === 1).toBe(true);

      // Verify precalc
      const metrics = fs.readJSONSync(precalcFilePath);
      metricsSchema.parse(metrics);
      expect(metrics.length).toBe(22);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${datasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${datasourceId}.json`));
      fs.removeSync(geogFilePath);
      fs.removeSync(precalcFilePath);
    }, 20_000);

    test("precalcDatasource - all precalc false should precalculate nothing", async () => {
      const dsFilename = "datasources_precalc_false_test.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const internalDatasourceId = "samoa-eez-cross";
      const externalDatasourceId = "global-eez-mr-v12";
      const geogFilename = "geographies_precalc_false_test.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const precalcFilename = "precalc_false_test.json";
      const precalcFilePath = path.join(dstPath, precalcFilename);

      // start with external datasource for geography
      fs.writeJSONSync(dsFilePath, [
        {
          datasourceId: externalDatasourceId,
          geo_type: "vector",
          url: `https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/${externalDatasourceId}.fgb`,
          formats: ["fgb"],
          classKeys: [],
          idProperty: "GEONAME",
          nameProperty: "GEONAME",
          precalc: false,
        },
      ]);

      // add internal datasource
      await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${eezCrossSrc}.json`),
          datasourceId: internalDatasourceId,
          classKeys: [],
          formats: ["fgb"],
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

      // Create geographies that reference this datasource

      // Box filter should give all eez polygons within bounding box (more than 2)
      const geogBoxFilter: Geography = {
        geographyId: "geog-box-filter",
        datasourceId: externalDatasourceId,
        display: "geog-box-filter",
        bboxFilter: [
          -174.511_394_471_577_574_4, -17.555_268_752_861_550_8,
          -165.200_833_333_191_610_6, -10.024_476_331_539_347,
        ],
        precalc: false,
      };

      writeGeographies([geogBoxFilter], geogFilePath);

      await precalcDatasources(projectClient, {
        newDatasourcePath: dsFilePath,
        newGeographyPath: geogFilePath,
        newPrecalcPath: precalcFilePath,
        newDstPath: dstPath,
        port,
      });

      // Verify precalc file was not created
      expect(fs.existsSync(precalcFilePath)).toBe(false);

      fs.removeSync(dsFilePath);
      fs.removeSync(path.join(dstPath, `${internalDatasourceId}.fgb`));
      fs.removeSync(path.join(dstPath, `${internalDatasourceId}.json`));
      fs.removeSync(geogFilePath);
    }, 20_000);
  });
});
