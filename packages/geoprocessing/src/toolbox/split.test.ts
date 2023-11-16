/**
 * @group unit
 */

import { splitFeature, splitSketch } from "./split";
import { feature } from "@turf/helpers";
import { Feature, Polygon, Sketch } from "../types";
import { toFeaturePolygonArray, toSketchArray } from "../helpers";
import {
  genSampleSketch,
  genSampleSketchCollectionFromSketches,
  isSketch,
  isSketchCollection,
} from "../helpers/sketch";
import deepEqual from "fast-deep-equal";

describe("splitFeature", () => {
  test("splitFeature Polygon antimeridian", async () => {
    const poly: Feature<Polygon> = feature({
      type: "Polygon",
      coordinates: [
        [
          [175, -16],
          [-178, -16],
          [-178, -15],
          [175, -15],
          [175, -16],
        ],
      ],
    });
    const result = toFeaturePolygonArray(splitFeature(poly));

    // Split into a multipolygon with two polygons
    expect(result.length).toBe(1);
    expect(result[0].geometry.type).toBe("MultiPolygon");
    expect(result[0].geometry.coordinates).toEqual([
      [
        [
          [180, -15],
          [175, -15],
          [175, -16],
          [180, -16],
          [180, -15],
        ],
      ],
      [
        [
          [-180, -16],
          [-178, -16],
          [-178, -15],
          [-180, -15],
          [-180, -16],
        ],
      ],
    ]);
  });
});

describe("splitSketch", () => {
  test("splitSketch Sketch not crossing should be untouched", async () => {
    const poly: Sketch<Polygon> = genSampleSketch({
      type: "Polygon",
      coordinates: [
        [
          [2, 2],
          [2, 8],
          [8, 8],
          [8, 2],
          [2, 2],
        ],
      ],
    });
    const splitPoly = splitSketch(poly);
    expect(deepEqual(splitPoly, poly)).toBe(true); // no change
  });

  test("splitSketch SketchCollection not crossing should be untouched", async () => {
    const sketch: Sketch<Polygon> = genSampleSketch({
      type: "Polygon",
      coordinates: [
        [
          [2, 2],
          [2, 8],
          [8, 8],
          [8, 2],
          [2, 2],
        ],
      ],
    });
    const sc = genSampleSketchCollectionFromSketches([sketch]);
    const splitSc = splitSketch(sc);
    expect(deepEqual(splitSc, sc)).toBe(true); // no change
  });

  test("splitSketch Sketch antimeridian", async () => {
    const sketch: Sketch<Polygon> = genSampleSketch({
      type: "Polygon",
      coordinates: [
        [
          [175, -16],
          [-178, -16],
          [-178, -15],
          [175, -15],
          [175, -16],
        ],
      ],
    });
    const result = splitSketch(sketch);

    // Split into a multipolygon with two polygons
    if (isSketch(result)) {
      expect(result.geometry.type).toBe("MultiPolygon");
      expect(result.geometry.coordinates).toEqual([
        [
          [
            [180, -15],
            [175, -15],
            [175, -16],
            [180, -16],
            [180, -15],
          ],
        ],
        [
          [
            [-180, -16],
            [-178, -16],
            [-178, -15],
            [-180, -15],
            [-180, -16],
          ],
        ],
      ]);
    } else {
      fail("Should not get here");
    }
  });

  test("splitSketch SketchCollection antimeridian", async () => {
    const sketch: Sketch<Polygon> = genSampleSketch({
      type: "Polygon",
      coordinates: [
        [
          [175, -16],
          [-178, -16],
          [-178, -15],
          [175, -15],
          [175, -16],
        ],
      ],
    });
    const sc = genSampleSketchCollectionFromSketches([sketch]);
    const splitSc = splitSketch(sc);

    // Split into a multipolygon with two polygons
    // console.log("BEFORE", JSON.stringify(sc));
    // console.log("AFTER", JSON.stringify(splitSc));
    if (isSketchCollection(splitSc)) {
      expect(splitSc.features[0].geometry.type).toBe("MultiPolygon");
      expect(deepEqual(sc.properties, splitSc.properties)).toBe(true);
      expect(deepEqual(sc.bbox, splitSc.bbox)).toBe(true);
      expect(splitSc.features[0].geometry.coordinates).toEqual([
        [
          [
            [180, -15],
            [175, -15],
            [175, -16],
            [180, -16],
            [180, -15],
          ],
        ],
        [
          [
            [-180, -16],
            [-178, -16],
            [-178, -15],
            [-180, -15],
            [-180, -16],
          ],
        ],
      ]);
    } else {
      fail("Should not reach here");
    }
  });
});
