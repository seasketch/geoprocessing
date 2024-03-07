import { toFeaturePolygonArray } from "./feature.js";
import { genSampleSketch, genSampleSketchCollection } from "../helpers/index.js";
import { randomPolygon } from "@turf/random";

const polySketch = genSampleSketch(randomPolygon(1).features[0].geometry);
const polySketchCollection = genSampleSketchCollection(randomPolygon(4));

describe("Feature helper unit tests", () => {
  test("toFeaturePolygonArray", async () => {
    expect(toFeaturePolygonArray(polySketch).length).toBe(1);
    expect(toFeaturePolygonArray(polySketchCollection).length).toBe(4);
  });
});
