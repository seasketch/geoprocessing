import Handler, { clipToOcean, clipToEez } from "./clipToOceanEez";
import {
  getExampleFeatures,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { ValidationError } from "@seasketch/geoprocessing";

const clipToOceanEez = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof clipToOceanEez).toBe("function");
  });

  test("clipToOceanEez", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipToOceanEez(example);
        expect(result).toBeTruthy();
        writeResultOutput(result, "clipToOceanEez", example.properties.name);
      } catch (e) {
        console.log("error", example.properties.name, e);
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });
});
