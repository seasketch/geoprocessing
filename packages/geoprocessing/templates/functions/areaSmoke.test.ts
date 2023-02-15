/**
 * @group smoke
 */
import Handler from "./area";
import {
  getExampleSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const calculateArea = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof calculateArea).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleSketches();
    for (const example of examples) {
      const result = await calculateArea(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "calculateArea", example.properties.name);
    }
  });
});
