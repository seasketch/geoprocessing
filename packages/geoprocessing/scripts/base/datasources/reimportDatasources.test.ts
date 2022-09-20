/**
 * @group unit
 */
import { reimportDatasources } from "./reimportDatasources";
import { ProjectClientBase } from "../../../src";
import configFixtures from "../../../src/testing/fixtures/projectConfig";

const projectClient = new ProjectClientBase(configFixtures.simple);

afterEach(() => {
  // fs.removeSync("./test/data");
  // fs.remove("./test/datasources_test.json");
});

describe("Reimport datsources", () => {
  test("reimportData simple", async () => {
    // Switch to generating a geojson dataset and datasources file
    const vectorD = await reimportDatasources(
      projectClient,
      "./test/datasources_test.json",
      "./test/data"
    );

    // ensure folder and files exist with proper contents!
  }, 10000);
});
