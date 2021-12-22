import { toSketchArray } from "./sketch";
import {
  genSampleSketch,
  genSampleSketchCollection,
  genSampleNullSketch,
  genSampleNullSketchCollection,
} from "../helpers";
import { randomPolygon } from "@turf/random";

const polySketch = genSampleSketch(randomPolygon(1).features[0].geometry);
const polySketchCollection = genSampleSketchCollection(randomPolygon(4));
const nullSketch = genSampleNullSketch();
const nullSketchCollection = genSampleNullSketchCollection([nullSketch]);

describe("Feature helper unit tests", () => {
  test("toFeaturePolygonArray", async () => {
    expect(toSketchArray(polySketch).length).toBe(1);
    expect(toSketchArray(polySketchCollection).length).toBe(4);
    expect(nullSketch.geometry).toBe(undefined);
    expect(nullSketchCollection.features.length).toBe(1);
    expect(nullSketchCollection.features[0].geometry).toBe(undefined);
  });
});
