import bboxPolygon from "@turf/bbox-polygon";
import booleanEqual from "@turf/boolean-equal";
import { intersect } from "./intersect";
import { polygon, multiPolygon } from "@turf/helpers";

const p1 = bboxPolygon([0, 0, 2, 2]);
const p2 = bboxPolygon([-1, -1, 1, 1]);
const p3 = bboxPolygon([1, 1, 2, 2]);

describe("Polygon intersect", () => {
  test("single", async () => {
    const truth = polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]);
    const result = intersect(p1, p2);
    if (!result) fail();
    expect(result).toBeTruthy();
    expect(booleanEqual(result, truth)).toBe(true);
  });

  test("multiple", async () => {
    const truth = multiPolygon([
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
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
          [1, 1],
        ],
      ],
    ]);
    const result = intersect(p1, [p2, p3]);
    if (!result) fail();
    expect(result).toBeTruthy();
    expect(booleanEqual(result, truth)).toBe(true);
  });
});
