import Handler, { clipLand, clipOutsideEez } from "./clipToOceanEez";
import {
  getExampleFeatures,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { ValidationError } from "@seasketch/geoprocessing";

describe("Basic unit tests", () => {
  test("clipLand", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipLand(example);
        expect(result).toBeTruthy();
      } catch (e) {
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  });

  test("clipOutsideEez", async () => {
    const examples = await getExampleFeatures();
    for (const example of examples) {
      try {
        const result = await clipOutsideEez(example);
        expect(result).toBeTruthy();
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
