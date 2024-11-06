import { writeResultOutput } from "./index.js";
import { Feature } from "geojson";
import { Sketch, ValidationError } from "../../src/index.js";
import { booleanValid } from "@turf/turf";

/**
 * Runs smoke test for a preprocessor function taking polygon input
 * Runs preprocessor function for all example polygon sketches
 */
export const polygonSmokeTest = (
  preprocessorFunc: (feature: Feature) => Promise<Feature>,
  /** Preprocessor function name */
  preprocessorName: string,
  /** Feature or Sketch examples to run against */
  examples: Feature[] | Sketch[],
  options: {
    /** timeout for test run in milliseconds, defaults to 10000 */
    timeout?: number;
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
          console.log(`No example sketches provided`);
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
