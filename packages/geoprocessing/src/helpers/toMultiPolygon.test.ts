import { describe, test, expect } from "vitest";
import { toMultiPolygon } from "./toMultiPolygon.js";
import fix from "../testing/fixtures/squareSketches.js";

describe("toMultiPolygon", () => {
  test("toMultiPolygon - polygon to multipolygon", () => {
    const multiInsideTwoByPoly = toMultiPolygon([fix.insideTwoByPoly]);
    expect(multiInsideTwoByPoly.geometry.coordinates).toEqual(
      fix.insideTwoByMultiPoly.geometry.coordinates,
    );
  });

  test("toMultiPolygon - two polygons", () => {
    const doubleInsideTwoByPoly = toMultiPolygon([
      fix.insideTwoByPoly,
      fix.insideTwoByPoly,
    ]);
    expect(doubleInsideTwoByPoly.geometry.coordinates).toEqual([
      [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
      [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    ]);
  });

  test("toMultiPolygon - polygon and multipolygon", () => {
    const doubleInsideTwoByPoly = toMultiPolygon([
      fix.insideTwoByPoly,
      fix.insideTwoByMultiPoly,
    ]);
    expect(doubleInsideTwoByPoly.geometry.coordinates).toEqual([
      [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
      [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    ]);
  });
});
