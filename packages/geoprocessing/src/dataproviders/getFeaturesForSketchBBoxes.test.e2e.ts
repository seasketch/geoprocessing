import { expect, test } from "vitest";
import canonicalize from "../util/canonicalize.js";
import fs from "fs-extra";
import {
  getFeaturesForBBoxes,
  getFeaturesForSketchBBoxes,
} from "./getFeaturesForSketchBBoxes.js";
import { genSampleSketch } from "../helpers/sketch.js";
import { bbox, featureCollection, polygon } from "@turf/turf";
import fix from "../testing/fixtures/squareSketches.js";
import { SketchCollection } from "../types/sketch.js";
import { Polygon } from "geojson";

describe("getFeaturesForBBoxes", () => {
  test("getFeaturesForBBoxes - simple", async () => {
    const worldJson = fs.readJsonSync("data/in/world.json");
    // pull features out of FC and add index based ID, just as the flatgeobuf client does on read
    const worldFeatures = worldJson.features.map((f, index) => {
      f.id = index;
      return f;
    });
    const canonicalStr = canonicalize(worldFeatures);
    const url = "http://127.0.0.1:8080/data/in/world.fgb";
    const features = await getFeaturesForBBoxes([[-1, -1, 1, 1]], url);
    expect(features.length).toEqual(1);
    expect(canonicalize(features)).toEqual(canonicalStr);
  });
});

describe("getFeaturesForSketchBBoxes", () => {
  test("getFeaturesForSketchBBoxes - simple", async () => {
    const worldJson = fs.readJsonSync("data/in/world.json");
    // pull features out of FC and add index based ID, just as the flatgeobuf client does on read
    const worldFeatures = worldJson.features.map((f, index) => {
      f.id = index;
      return f;
    });
    const canonicalStr = canonicalize(worldFeatures);
    const url = "http://127.0.0.1:8080/data/in/world.fgb";
    const poly = polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]);
    const sketch = genSampleSketch(poly.geometry, "sketch1");
    const features = await getFeaturesForSketchBBoxes(sketch, url);
    expect(features.length).toEqual(1);
    expect(canonicalize(features)).toEqual(canonicalStr);
  });

  test("getFeaturesForSketchBBoxes - bottom left squares", async () => {
    const url = "http://127.0.0.1:8080/data/in/squares.fgb";
    const poly = polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ]);
    const sketch = genSampleSketch(poly.geometry, "sketch1");
    const features = await getFeaturesForSketchBBoxes(sketch, url);
    // Should pick up twoByPoly, insideTwoByPoly, and the corner of halfInsideTwoByPoly
    expect(features.length).toEqual(3);
  });

  test("getFeaturesForSketchBBoxes - sketch collection", async () => {
    const url = "http://127.0.0.1:8080/data/in/squares.fgb";
    const testSC: SketchCollection<Polygon> = {
      type: "FeatureCollection",
      properties: {
        id: "test",
        name: "Collection 1",
        updatedAt: "2021-11-20T00:00:34.269Z",
        createdAt: "2021-11-19T23:34:12.889Z",
        sketchClassId: "615b65a2aac8c8285d50d9f3",
        isCollection: true,
        userAttributes: [],
      },
      bbox: bbox(
        featureCollection([
          fix.outsideTwoByPolyTopLeftSketch,
          fix.outsideTwoByPolyBottomRightSketch,
        ]),
      ),
      features: [
        fix.outsideTwoByPolyTopLeftSketch,
        fix.outsideTwoByPolyBottomRightSketch,
      ],
    };
    const features = await getFeaturesForSketchBBoxes(testSC, url);
    // Should pick up outsideTwoByPolyTopLeftSketch, outsideTwoByPolyBottomRightSketch, and the corner of halfInsideTwoByPoly
    expect(features.length).toEqual(3);
  });
});
