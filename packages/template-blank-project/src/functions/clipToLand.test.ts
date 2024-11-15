import { describe, test, expect, vi, afterEach, assert } from "vitest";
import { clipToLand } from "./clipToLand.js";
import { area, featureCollection, polygon } from "@turf/turf";

const landFeature = polygon([
  [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [0, 0],
  ],
]);

// fully outside landFeature
const outside = polygon([
  [
    [3, 3],
    [4, 3],
    [4, 4],
    [3, 4],
    [3, 3],
  ],
]);

// half inside landFeature
const halfInside = polygon([
  [
    [1, 1],
    [3, 1],
    [3, 2],
    [1, 2],
    [1, 1],
  ],
]);

// fully inside landFeature
const inside = polygon([
  [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 1],
  ],
]);

describe("clipToLand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Mock VectorDataSource fetchUnion method to return landFeature
  vi.mock(import("@seasketch/geoprocessing"), async (importOriginal) => {
    const actual = await importOriginal();
    const VectorDataSource = vi.fn();
    VectorDataSource.prototype.fetchUnion = vi.fn(() =>
      featureCollection([landFeature]),
    );
    return { ...actual, VectorDataSource };
  });

  test("clipToLand - feature outside of land should throw", async () => {
    try {
      await clipToLand(outside);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe("Feature is outside of boundary");
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("clipToLand - feature inside of land boundary should return entire", async () => {
    const result = await clipToLand(inside);
    expect(result).toEqual(inside);
    expect(area(result)).toBe(area(inside));
  });

  test("clipToLand - feature partially inside of land boundary should return clipped", async () => {
    const result = await clipToLand(halfInside);
    // Expect half outside land to be clipped off and land-side polygon with approximately half the area to be returned
    expect(area(result)).toBeCloseTo(area(inside));
  });
});
