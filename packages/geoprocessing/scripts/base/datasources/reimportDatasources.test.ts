/**
 * @jest-environment node
 * @group e2e
 */
import { reimportDatasources } from "./reimportDatasources";
import {
  internalVectorDatasourceSchema,
  internalRasterDatasourceSchema,
  datasourcesSchema,
  ProjectClientBase,
} from "../../../src";
import configFixtures from "../../../src/testing/fixtures/projectConfig";
import { importDatasource } from "./importDatasource";
import path from "path";
import fs from "fs-extra";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "data/testing";
const dstPath = "data/testing/output";

describe("Reimport datsources", () => {
  describe("reimportVectorDatasource - single file, single class", () => {
    const dstConfigFilename = "datasources_test_reimport.json";
    const dstConfigFilePath = path.join(dstPath, dstConfigFilename);
    const vectorDatasourceId = "eez-reimport";
    const rasterDatasourceId = "quad_10-reimport";

    beforeEach(() => {
      // Ensure test data folder
      fs.mkdirsSync(dstPath);
      // Start off with clean empty config file
      fs.writeJSONSync(dstConfigFilePath, []);
    });
    test("reimportVectorDatasource - should import and then reimport two datasources", async () => {
      const importVectorDs = await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, `${vectorDatasourceId}.json`),
          datasourceId: vectorDatasourceId,
          classKeys: [],
          formats: [],
          propertiesToKeep: [],
        },
        {
          newDatasourcePath: dstConfigFilePath,
          newDstPath: dstPath,
        }
      );

      const importRasterDs = await importDatasource(
        projectClient,
        {
          geo_type: "raster",
          src: path.join(srcPath, `${rasterDatasourceId}.tif`),
          datasourceId: rasterDatasourceId,
          classKeys: [],
          formats: [],
          noDataValue: 0,
          band: 1,
          measurementType: "quantitative",
        },
        {
          newDatasourcePath: dstConfigFilePath,
          newDstPath: dstPath,
        }
      );

      const reimportDss = await reimportDatasources(
        projectClient,
        dstConfigFilePath,
        dstPath
      );

      expect(reimportDss.length).toBe(2);

      const savedReimportDss = fs.readJSONSync(dstConfigFilePath);
      expect(
        Array.isArray(savedReimportDss) && savedReimportDss.length === 2
      ).toBe(true);
      const validReimportDss = datasourcesSchema.parse(savedReimportDss);

      //// Check vector, assume first element
      const validVectorReimportDs = internalVectorDatasourceSchema.parse(
        reimportDss[0]
      );
      // Import created timestamp should match reimport created timestamp
      expect(new Date(importVectorDs.created).getTime()).toEqual(
        new Date(validVectorReimportDs.created).getTime()
      );

      // Import timestamp should be less than reimport timestamp
      expect(new Date(importVectorDs.lastUpdated).getTime()).toBeLessThan(
        new Date(validVectorReimportDs.lastUpdated).getTime()
      );

      //// Check raster, assume second element
      const validRasterReimportDs = internalRasterDatasourceSchema.parse(
        reimportDss[1]
      );

      // Import created timestamp should match reimport created timestamp
      expect(new Date(importRasterDs.created).getTime()).toEqual(
        new Date(validRasterReimportDs.created).getTime()
      );

      // Import timestamp should be less than reimport timestamp
      expect(new Date(importRasterDs.lastUpdated).getTime()).toBeLessThan(
        new Date(validRasterReimportDs.lastUpdated).getTime()
      );

      // Returned reimport object and reimport object from disk should match including timestamps
      expect(reimportDss).toEqual(validReimportDss);
      expect(fs.existsSync(path.join(dstPath, `${vectorDatasourceId}.json`)));
      expect(fs.existsSync(path.join(dstPath, `${vectorDatasourceId}.fgb`)));
    }, 10000);
    afterEach(() => {
      // Remove the output
      // fs.removeSync(dstConfigFilePath);
      // fs.removeSync(path.join(dstPath, `${vectorDatasourceId}.fgb`));
      // fs.removeSync(path.join(dstPath, `${vectorDatasourceId}.json`));
      // fs.removeSync(path.join(dstPath, `${rasterDatasourceId}.tif`));
    });
  });
});
