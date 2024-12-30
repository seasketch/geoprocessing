import { describe, test, expect, vi, afterEach, assert } from "vitest";
import { area, polygon } from "@turf/turf";
import { validatePolygon } from "./validatePolygon.js";

const valid = polygon([
  [
    [0, 0],
    [0.1, 0],
    [0.1, 0.1],
    [0, 0.1],
    [0, 0],
  ],
]);

const bowtie = polygon([
  [
    [0, 0],
    [1, 1],
    [1, 0],
    [0, 1],
    [0, 0],
  ],
]);

const tiny = polygon([
  [
    [0.000_001, 0.000_001],
    [0.000_002, 0.000_001],
    [0.000_002, 0.000_002],
    [0.000_001, 0.000_002],
    [0.000_001, 0.000_001],
  ],
]);

const world = polygon([
  [
    [-180, 90],
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
  ],
]);

describe("validatePolygon", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("validatePolygon - invalid polygon should throw", async () => {
    try {
      await validatePolygon(bowtie);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe("Your sketch polygon crosses itself");
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("validatePolygon - tiny polygon should throw", async () => {
    try {
      await validatePolygon(tiny);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Shapes should be at least 100 square meters in size",
        );
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("validatePolygon - world polygon should throw", async () => {
    try {
      await validatePolygon(world);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Shapes should be no more than 1,000,000 square km in size",
        );
        return;
      }
    }
    assert.fail("This should not be reached");
  });

  test("validatePolygon - valid polygon", async () => {
    const validatedPolygon = await validatePolygon(valid);
    expect(validatedPolygon).toEqual(valid);
  });
});
