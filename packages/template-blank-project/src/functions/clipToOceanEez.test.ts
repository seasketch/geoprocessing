import { describe, test, expect, vi, afterEach, assert } from "vitest";
import { clipToOceanEez } from "./clipToOceanEez.js";
import { area, featureCollection, polygon } from "@turf/turf";
import { BBox } from "@seasketch/geoprocessing";

const landFeature = polygon([
  [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [0, 0],
  ],
]);

const eezFeature = polygon([
  [
    [0, 0],
    [3, 0],
    [3, 3],
    [0, 3],
    [0, 0],
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

// third inside land, third outside eez, this inside eez
const thirdEach = polygon([
  [
    [1, 1],
    [4, 1],
    [4, 2],
    [1, 2],
    [1, 1],
  ],
]);

// fully outside eez
const outsideEez = polygon([
  [
    [3, 1],
    [4, 1],
    [4, 2],
    [3, 2],
    [3, 1],
  ],
]);

/**
 * clipToOceanEez uses land vector datasource and eez with land vector datasource
 * to remove portion of feature that is within land feature (difference), and keep
 * the portion of feature that is inside the eez (intersection)
 */

describe("clipToOceanEez", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Mock VectorDataSource fetchUnion method to return clipFeature
  vi.mock(import("@seasketch/geoprocessing"), async (importOriginal) => {
    const actual = await importOriginal();
    const VectorDataSource = vi.fn();
    VectorDataSource.prototype.fetchUnion = vi.fn(
      (bbox: BBox, unionProperty?: string) => {
        if (unionProperty === "gid") {
          return featureCollection([landFeature]);
        } else if (unionProperty === "UNION") {
          return featureCollection([eezFeature]);
        }
      },
    );

    VectorDataSource.prototype.fetchBundle = vi.fn();
    VectorDataSource.prototype.fetchBundleIndex = vi.fn();
    return { ...actual, VectorDataSource };
  });

  test("clipToOceanEez - feature inside of land feature should throw", async () => {
    try {
      await clipToOceanEez(insideLand);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe("Feature is outside of boundary");
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("clipToOceanEez - feature outside of eez and land should throw", async () => {
    try {
      await clipToOceanEez(outsideEez);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe("Feature is outside of boundary");
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("clipToOceanEez - feature spanning land and outside eez should have middle third remain", async () => {
    const result = await clipToOceanEez(thirdEach);
    // Expect half inside land to be clipped off and ocean-side polygon with approximately half the area to be returned
    expect(area(result)).toBeCloseTo(area(thirdEach) / 3);
  });
});
