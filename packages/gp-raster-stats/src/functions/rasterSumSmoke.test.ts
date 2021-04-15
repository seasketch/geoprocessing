/**
 * @jest-environment node
 * @group smoke
 */
import Handler from "./rasterSum";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const rasterSum = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof rasterSum).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleSketches();
    for (const example of examples) {
      const result = await rasterSum(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "rasterSum", example.properties.name);
      expect(result.area[0]).toBeGreaterThanOrEqual(0);
    }
  });
});
