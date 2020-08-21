/**
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
      console.log(example.properties.name);
      const result = await rasterSum(example);
      console.log("result: ", result);
    }
  }, 60000);
});
