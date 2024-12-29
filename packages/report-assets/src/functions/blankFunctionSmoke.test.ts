import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { blankFunction } from "./blankFunction.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof blankFunction).toBe("function");
  });
  test("blankFunction - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await blankFunction(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "blankFunction", example.properties.name);
    }
  }, 60_000);
});
