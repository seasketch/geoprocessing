/**
 * @jest-environment node
 * @group unit
 */
import { rasterSum } from "./rasterSum";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Unit tests", () => {
  test("rasterSumTest", async () => {
    const examples = await getExampleSketches("gpRasterSum");
    for (let example of examples) {
      const result = await rasterSum(example);
    }
  }, 60000);
});
