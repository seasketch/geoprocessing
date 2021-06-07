import { clipToBounds } from "./clipToBounds";
import {
  getExampleFeatures,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { ValidationError } from "@seasketch/geoprocessing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof clipToBounds).toBe("function");
  });
  test("tests run against all examples", async () => {
    const examples = await getExampleFeatures("gp-clip-bbox");
    for (const example of examples) {
      try {
        const result = await clipToBounds(example);
        expect(result).toBeTruthy();
        writeResultOutput(result, "clipToBounds", example.properties?.name);
      } catch (e) {
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });
});

describe("Unit tests", () => {
  test.todo("Implement unit tests");
});
