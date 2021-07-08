/**
 * @jest-environment node
 * @group smoke
 */
import { rasterSum } from "./rasterSum";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof rasterSum).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll("gp-raster-stats");
    for (const example of examples) {
      const result = await rasterSum(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "rasterSum", example.properties.name);
      expect(result.sum).toBeGreaterThanOrEqual(0);
    }
  });
});
