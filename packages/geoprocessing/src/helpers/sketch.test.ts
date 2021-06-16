import { toSketchArray } from "./sketch";
import { genSampleSketch, genSampleSketchCollection } from "../helpers";
import { randomPolygon } from "@turf/random";

const polySketch = genSampleSketch(randomPolygon(1).features[0].geometry);
const polySketchCollection = genSampleSketchCollection(randomPolygon(4));

describe("Feature helper unit tests", () => {
  test("toFeaturePolygonArray", async () => {
    expect(toSketchArray(polySketch).length).toBe(1);
    expect(toSketchArray(polySketchCollection).length).toBe(4);
  });
});
