import { describe, test, expect } from "vitest";
import { removeOverlap } from "./removeOverlap.js";
import fix from "../testing/fixtures/squareSketches.js";

describe("removeOverlap", () => {
  test("removeOverlap - polygon to multipolygon", () => {
    const multiInsideTwoByPoly = removeOverlap([
      fix.twoByPoly,
      fix.halfInsideTwoByPoly,
    ]);
    console.log(JSON.stringify(multiInsideTwoByPoly));
    expect(multiInsideTwoByPoly.geometry.coordinates).toEqual([
      [
        [0, 0],
        [2, 0],
        [2, 1],
        [3, 1],
        [3, 2],
        [0, 2],
        [0, 0],
      ],
    ]);
  });
});
