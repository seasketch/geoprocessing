/**
 * @jest-environment node
 * @group unit
 */
import Handler from "./rasterSum";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const rasterSum = Handler.func;

describe("Unit tests", () => {
  test("rasterSumTest", async () => {
    const examples = await getExampleSketches();
    for (let example of examples) {
      const result = await rasterSum(example);
    }
  }, 60000);
});
