import { getExamplePolygonSketches, writeResultOutput } from ".";
import { Feature } from "@turf/helpers";
import { ValidationError } from "../../src";
import booleanValid from "@turf/boolean-valid";

/**
 * Runs smoke test for a preprocessor function taking polygon input
 * Runs preprocessor function for all example polygon sketches
 */
export const polygonPreprocessorSmokeTest = (
  preprocessorFunc: (feature: Feature) => Promise<Feature>,
  /**  */
  preprocessorName: string,
  options: {
    /** Partial name of example polygon sketch to load */
    partialName?: string | undefined;
    /** timeout for test run in milliseconds, defaults to 10000 */
    timeout?: number;
  } = {}
) => {
  const { partialName = undefined, timeout = 10000 } = options;

  describe("Basic smoke tests", () => {
    test("handler function is present", () => {
      expect(typeof preprocessorFunc).toBe("function");
    });

    test(
      `${preprocessorName}Smoke`,
      async () => {
        const examples = await getExamplePolygonSketches(partialName);
        if (examples.length === 0) {
          throw new Error(
            `No example sketches found.  Have you put any Sketch Polygon JSON files in your examples/sketches directory? ${
              partialName && partialName.length > 0
                ? "Does your partialName " +
                  partialName +
                  " not match the name of any example polygon sketches?"
                : ""
            }`
          );
        }
        for (const example of examples) {
          try {
            const result = await preprocessorFunc(example);
            expect(result).toBeTruthy();
            expect(booleanValid(result));
            expect(
              result.geometry.type === "Polygon" ||
                result.geometry.type === "MultiPolygon"
            );
            writeResultOutput(
              result,
              preprocessorName,
              example?.properties?.name
            );
          } catch (e) {
            console.log("error", example?.properties?.name, e);
            if (e instanceof ValidationError) {
              // ValidationErrors don't indicate failures, just comprehensive tests
            } else {
              throw e;
            }
          }
        }
      },
      timeout
    );
  });
};
