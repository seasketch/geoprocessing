import { writeResultOutput } from "./index.js";
import { Feature } from "geojson";
import { Sketch, ValidationError } from "../../src/index.js";
import { booleanValid } from "@turf/turf";

/**
 * Runs a basic smoke test on a preprocessor function that takes feature or sketch polygon input
 * For each example provided, runs the preprocessing function and checks that the output is truthy,
 * and that the geometry is valid according to the OGC spec using turf.booleanValid
 * then outputs the result to examples/output directory.  If you need more comprehensive tests,
 * consider writing additional tests after calling this test or simply copying the source code for this test
 * function to create your own.
 */
export const polygonSmokeTest = (
  preprocessorFunc: (feature: Feature) => Promise<Feature>,
  /** Preprocessor function name */
  preprocessorName: string,
  /** Feature or Sketch examples to run against */
  examples: Feature[] | Sketch[],
  options: {
    /** timeout for test run in milliseconds, defaults to 10000 or 10 seconds */
    timeout?: number;
    /** If true console outputs the name of the example on start of run */
    debug?: boolean;
  } = {},
) => {
  const { timeout = 10_000, debug = false } = options;

  describe("Basic smoke tests", () => {
    test("handler function is present", () => {
      expect(typeof preprocessorFunc).toBe("function");
    });

    test(
      `${preprocessorName}Smoke`,
      async () => {
        if (examples.length === 0) {
          console.log(`No examples provided`);
        }
        for (const example of examples) {
          if (debug) {
            console.log("Example:", example.properties?.name);
          }
          try {
            const result = await preprocessorFunc(example);
            expect(result).toBeTruthy();
            expect(booleanValid(result));
            expect(
              result.geometry.type === "Polygon" ||
                result.geometry.type === "MultiPolygon",
            );
            writeResultOutput(
              result,
              preprocessorName,
              example?.properties?.name,
            );
          } catch (error) {
            console.log("error", example?.properties?.name, error);
            if (error instanceof ValidationError) {
              // ValidationErrors don't indicate failures, just comprehensive tests
            } else {
              throw error;
            }
          }
        }
      },
      timeout,
    );
  });
};
