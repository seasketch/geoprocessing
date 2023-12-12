/**
 * @jest-environment node
 * @group smoke
 */
import Handler from "./simpleFunction";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

const simpleFunction = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof simpleFunction).toBe("function");
  });
  test("simpleFunction - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await simpleFunction(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "simpleFunction", example.properties.name);
    }
  }, 60000);
});
