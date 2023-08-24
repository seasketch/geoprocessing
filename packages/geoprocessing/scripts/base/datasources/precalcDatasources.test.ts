/**
 * @jest-environment node
 * @group scripts/e2e
 */

import {
  Geography,
  ProjectClientBase,
  geographySchema,
  metricSchema,
  firstMatchingMetric,
  Metric,
  metricsSchema,
} from "../../../src";
import configFixtures from "../../../src/testing/fixtures/projectConfig";
import fs from "fs-extra";
import path from "path";
import {
  precalcDatasources,
  staleMetricsFilterNursery,
} from "./precalcDatasources";
import { importDatasource } from "./importDatasource";
import { writeGeographies } from "../geographies/geographies";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "data/testing";
const dstPath = "data/testing/output";
describe("staleMetricsFilterNursery", () => {
  test("staleMetricsFilterNursery - simple should return true", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "eez-total",
        metricId: "area",
        sketchId: "eez",
        groupId: null,
        value: 123,
      },
    ];
    const matcher = staleMetricsFilterNursery(
      ["shelf_class-total", "shelf_class-medium", "shelf_class-high"],
      "eez"
    );
    const filtered = m.filter(matcher);
    expect(filtered.length).toBe(1);
  });
  test("staleMetricsFilterNursery - simple should return false", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "eez-total",
        metricId: "area",
        sketchId: "eez",
        groupId: null,
        value: 123,
      },
    ];
    const matcher = staleMetricsFilterNursery(
      [
        "shelf_class-total",
        "shelf_class-medium",
        "shelf_class-high",
        "eez-total",
      ],
      "eez"
    );
    const filtered = m.filter(matcher);
    expect(filtered.length).toBe(0);
  });
  test("staleMetricsFilterNursery - complex should return 4 metrics", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
    ];

    // should filter out metrics with eez geography
    const matcher = staleMetricsFilterNursery(
      ["basins-total", "canyons-total"],
      "eez"
    );
    const filtered = m.filter(matcher);
    expect(filtered.length).toBe(4);
  });
  test("staleMetricsFilterNursery - complex should return 6 metrics", () => {
    const m: Metric[] = [
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "eez",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 1,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "canyons-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "area",
        sketchId: "mpa1",
        groupId: null,
        value: 123,
      },
      {
        geographyId: "nearshore",
        classId: "basins-total",
        metricId: "count",
        sketchId: "mpa1",
        groupId: null,
        value: 3,
      },
    ];

    // should filter out metrics with eez geography
    const matcher = staleMetricsFilterNursery(["basins-total"], "eez");
    const filtered = m.filter(matcher);
    console.log(filtered);
    expect(filtered.length).toBe(6);
  });
});
describe("precalcDatasources", () => {
  describe("precalcVectorDatasource - single file, single class", () => {
    beforeEach(() => {
      // Ensure test data folder
      fs.mkdirsSync(dstPath);
    });
    test("precalcVectorDatasource - single file, single class should write geography and precalc vector metrics", async () => {
      const dsFilename = "datasources_precalc_test_1.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const datasourceId = "eez";
      const geogFilename = "geographies_precalc_test_1.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez";
      const precalcFilename = "precalc_test_1.json";
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
      const dsFilename = "datasources_precalc_test_2.json";
      const dsFilePath = path.join(dstPath, dsFilename);
      const classDatasourceId = "shelf_class";
      const geogDatasourceId = "eez";
      const geogFilename = "geographies_precalc_test_2.json";
      const geogFilePath = path.join(dstPath, geogFilename);
      const geographyId = "eez";
      const precalcFilename = "precalc_test_2.json";
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
  });
});
