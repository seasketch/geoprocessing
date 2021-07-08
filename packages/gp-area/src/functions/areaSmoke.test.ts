/**
 * @group smoke
 */
import { area } from "./area";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof area).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll("gpArea");
    for (const example of examples) {
      const result = await area(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "area", example.properties.name);
    }
  });
});
