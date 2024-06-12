import { describe, test, expect } from "vitest";
import { zeroSketchCollection } from "./zeroGeometry.js";
import sk from "../testing/fixtures/sketches.js";

describe("zero polygon", () => {
  test("zeroSketch", () => {
    const zsc = zeroSketchCollection(sk.wholeMixedSC);
    zsc.features.forEach((f) => {
      expect(f.geometry.coordinates.length).toBe(3);
      expect(f.geometry.coordinates[0][0]).toEqual([0, 0]);
    });
  });
});
