/**
 * @jest-environment node
 * @group unit
 */
import { rasterSum } from "./rasterSum";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Unit tests", () => {
  test("rasterSumTest", async () => {
    const examples = await getExamplePolygonSketchAll("gpRasterSum");
    for (let example of examples) {
      const result = await rasterSum(example);
    }
  }, 60000);
});
