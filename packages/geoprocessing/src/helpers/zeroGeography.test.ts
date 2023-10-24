/**
 * @jest-environment node
 * @group unit
 */

import { zeroSketchCollection } from "./zeroGeometry";
import sk from "../testing/fixtures/sketches";

describe("zero polygon", () => {
  test("zeroSketch", () => {
    const zsc = zeroSketchCollection(sk.wholeMixedSC);
    zsc.features.forEach((f) => {
      expect(f.geometry.coordinates.length).toBe(3);
      expect(f.geometry.coordinates[0][0]).toEqual([0, 0]);
    });
  });
});
