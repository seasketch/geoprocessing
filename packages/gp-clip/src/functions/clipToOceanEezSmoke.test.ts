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

  test("clipToOcean", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipToOcean(example);
        expect(result).toBeTruthy();
        writeResultOutput(result, "clipToOcean", example.properties.name);
      } catch (e) {
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });

  test("clipToEez", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipToEez(example);
        expect(result).toBeTruthy();
        writeResultOutput(result, "clipToEez", example.properties.name);
      } catch (e) {
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });

  test("clipToOceanEez", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipToOceanEez(example);
        expect(result).toBeTruthy();
        writeResultOutput(result, "clipToOceanEez", example.properties.name);
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
