import { describe, test, expect } from "vitest";
import { cleanCoords } from "./cleanCoords.js";
import { feature, featureCollection } from "@turf/turf";
import { Feature, Polygon } from "../types/index.js";

describe("cleanCoords", () => {
  test("cleanCoords Polygon", async () => {
    const poly: Feature<Polygon> = feature({
      type: "Polygon",
      coordinates: [
        [
          [175, -92],
          [182, -92],
          [182, -15],
          [175, -15],
          [175, -92],
        ],
      ],
    });
    const result = cleanCoords(poly);
    // 182 should be cleaned to -178 and -92 should be cleaned to 88
    expect(result.geometry.coordinates).toEqual([
      [
        [175, 88],
        [-178, 88],
        [-178, -15],
        [175, -15],
        [175, 88],
      ],
    ]);
  });

  test("cleanCoords FeatureCollection", async () => {
    const poly: Feature<Polygon> = feature({
      type: "Polygon",
      coordinates: [
        [
          [175, -92],
          [182, -92],
          [182, -15],
          [175, -15],
          [175, -92],
        ],
      ],
    });
    const fc = featureCollection([poly]);
    const result = cleanCoords(fc);

    expect(result.type).toBe("FeatureCollection");
    expect(result.features.length).toBe(1);
    expect(result.features[0].geometry.coordinates).toEqual([
      [
        [175, 88],
        [-178, 88],
        [-178, -15],
        [175, -15],
        [175, 88],
      ],
    ]);
  });
});
