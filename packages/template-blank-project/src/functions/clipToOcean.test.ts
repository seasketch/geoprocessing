import { describe, test, expect, vi, afterEach, assert } from "vitest";
import { clipToOcean } from "./clipToOcean.js";
import { area, polygon } from "@turf/turf";

const landFeature = polygon([
  [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [0, 0],
  ],
]);

// half inside and half outside clipFeature
const halfInsideOutside = polygon([
  [
    [1, 1],
    [3, 1],
    [3, 2],
    [1, 2],
    [1, 1],
  ],
]);

// fully outside half clipFeature
const outsideLand = polygon([
  [
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 2],
    [2, 1],
  ],
]);

// fully inside half clipFeature
const insideLand = polygon([
  [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 1],
  ],
]);

/**
 * clipToOcean uses land vector datasource to remove portion of feature that is within land feature
 */

describe("clipToOcean", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Mock loadFgb method to return landFeature
  // @ts-ignore
  vi.mock(import("@seasketch/geoprocessing"), async (importOriginal) => {
    const actual = await importOriginal();
    const loadFgb = vi.fn(() => [landFeature]);
    return { ...actual, loadFgb };
  });

  test("clipToOcean - feature inside of land feature should throw", async () => {
    try {
      await clipToOcean(insideLand);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe("Feature is not in the ocean");
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("clipToOcean - feature outside of land feature should return entire", async () => {
    const result = await clipToOcean(outsideLand);
    expect(result).toEqual(outsideLand);
    expect(area(result)).toBe(area(outsideLand));
  });

  test("clipToOcean - feature partially outside of land feature should return clipped", async () => {
    const result = await clipToOcean(halfInsideOutside);
    // Expect half inside land to be clipped off and ocean-side polygon with approximately half the area to be returned
    expect(area(result)).toBeCloseTo(area(insideLand));
  });
});
