/**
 * @jest-environment node
 * @group unit
 */

import { importDatasource } from "./importDatasource";
import { ProjectClientBase, vectorDatasourceSchema } from "../../../src";
import configFixtures from "../../../src/testing/fixtures/projectConfig";
import fs from "fs-extra";
import path from "path";

const projectClient = new ProjectClientBase(configFixtures.simple);
const srcPath = "src/testing/data";
const dstPath = "src/testing/output";

// Switch to generating a geojson dataset
describe("Import vector data", () => {
  // test("importVectorDatasource single-file multi-class", async () => {
  //   // TODO: switch to generating test vector dataset
  //   const vectorD = await importDatasource(
  //     projectClient,
  //     {
  //       geo_type: "vector",
  //       src: "data/src/Data_Received/Layers_From_Kaituu/Revised Deepwater Bioregions.shp",
  //       datasourceId: "deepwater_bioregions",
  //       classKeys: ["Draft name"],
  //       formats: [],
  //       propertiesToKeep: [],
  //     },
  //     {
  //       newDatasourcePath: "./test/datasources_test.json",
  //       newDstPath: "./test/data",
  //     }
  //   );

  //   // ensure folder and files exist with proper contents!
  // }, 10000);

  describe("importVectorDatasource - single file, multi-class", () => {
    const dstConfigFilename = "datasources_test_1.json";
    const dstConfigFilePath = path.join(dstPath, dstConfigFilename);

    beforeEach(() => {
      // Ensure test data folder
      fs.mkdirsSync(dstPath);
      // Start off with clean empty config file
      fs.writeJSONSync(dstConfigFilePath, []);
    });
    test("importVectorDatasource should write file to dist and save config", async () => {
      const eezDs = await importDatasource(
        projectClient,
        {
          geo_type: "vector",
          src: path.join(srcPath, "eez.json"),
          datasourceId: "eez",
          classKeys: [],
          formats: [],
          propertiesToKeep: [],
        },
        {
          newDatasourcePath: dstConfigFilePath,
          newDstPath: dstPath,
        }
      );
      const savedDs = fs.readJSONSync(dstConfigFilePath);
      expect(Array.isArray(savedDs) && savedDs.length === 1).toBe(true);
      const validDs = vectorDatasourceSchema.parse(savedDs[0]);
      expect(validDs.layerName).toEqual("eez");
      // expect(eezDs).toEqual(validDs);
      expect(fs.existsSync(path.join(dstPath, "eez.json")));
      expect(fs.existsSync(path.join(dstPath, "eez.fgb")));
    }, 10000);
    afterEach(() => {
      // Remove the output
      fs.removeSync(dstConfigFilePath);
      fs.removeSync(path.join(dstPath, "eez.fgb"));
      fs.removeSync(path.join(dstPath, "eez.json"));
    });
  });
});

// Switch to generating a geojson dataset
// describe("Import raster data", () => {
//   test("importRasterDatasource single class", async () => {
//     // TODO: switch to generating test raster dataset
//     const vectorD = await importDatasource(
//       projectClient,
//       {
//         geo_type: "raster",
//         src: "data/src/Data_Products/OUS/heatmaps/Commercial_Fishing.tif",
//         datasourceId: "ous_commercial",
//         formats: [],
//         noDataValue: 0,
//         band: 1,
//         measurementType: "quantitative",
//       },
//       {
//         newDatasourcePath: "./test/datasources_test.json",
//         newDstPath: "./test/data",
//       }
//     );

//     // ensure folder and files exist with proper contents!
//   }, 10000);
// });
