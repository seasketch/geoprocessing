import bboxPolygon from "@turf/bbox-polygon";
import booleanEqual from "@turf/boolean-equal";
import { difference } from "./difference";
import { polygon, multiPolygon } from "@turf/helpers";

const p1 = bboxPolygon([0, 0, 2, 2]);
const p2 = bboxPolygon([0, 0, 1, 1]);
const p3 = bboxPolygon([1, 1, 2, 2]);

describe("Polygon difference", () => {
  test("single poly", async () => {
    const truth = polygon([
      [
        [0, 1],
        [1, 1],
        [1, 0],
        [2, 0],
        [2, 2],
        [0, 2],
        [0, 1],
      ],
    ]);
    const result = difference(p1, p2);
    if (!result) fail();
    expect(result).toBeTruthy();
    expect(booleanEqual(result, truth)).toBe(true);
  });

  test("multipolygon", async () => {
    const mp1 = multiPolygon([
      [
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
        ],
      ],
      [
        [
          [1, 1],
          [1, 2],
          [2, 2],
          [2, 1],
          [1, 1],
        ],
      ],
    ]);
    const truth = multiPolygon([
      [
        [
          [0, 1],
          [1, 1],
          [1, 2],
          [0, 2],
          [0, 1],
        ],
      ],
      [
        [
          [1, 0],
          [2, 0],
          [2, 1],
          [1, 1],
          [1, 0],
        ],
      ],
    ]);
    const result = difference(p1, mp1);
    console.log(JSON.stringify(result));
    if (!result) fail();
    expect(result).toBeTruthy();
    expect(booleanEqual(result, truth)).toBe(true);
  });

  test("multiple", async () => {
    const truth = multiPolygon([
      [
        [
          [0, 1],
          [1, 1],
          [1, 2],
          [0, 2],
          [0, 1],
        ],
      ],
      [
        [
          [1, 0],
          [2, 0],
          [2, 1],
          [1, 1],
          [1, 0],
        ],
      ],
    ]);
    const result = difference(p1, [p2, p3]);
    if (!result) fail();
    expect(result).toBeTruthy();
    expect(booleanEqual(result, truth)).toBe(true);
  });
});
