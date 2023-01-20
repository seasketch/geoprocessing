import { toSketchArray } from "./sketch";
import {
  genSampleSketch,
  genSampleSketchCollection,
  genSampleNullSketch,
  genSampleNullSketchCollection,
  getUserAttribute,
  getJsonUserAttribute,
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

describe("getUserAttribute - single", () => {
  // sketch
  expect(getUserAttribute(polySketch, "SINGLE")).toBe("single");
  // properties
  expect(getUserAttribute(polySketch.properties, "SINGLE")).toBe("single");
});

describe("getUserAttribute - single collection", () => {
  // sketch
  expect(getUserAttribute(polySketchCollection, "SINGLE")).toBe("single");
  // properties
  expect(getUserAttribute(polySketchCollection.properties, "SINGLE")).toBe(
    "single"
  );
});

describe("getUserAttribute - multi array", () => {
  // sketch
  const arr = getUserAttribute(polySketch, "MULTI");
  expect(Array.isArray(arr)).toBe(true);
  if (Array.isArray(arr)) {
    expect(arr.length).toBe(2);
  }

  // properties
  const arr2 = getUserAttribute(polySketch.properties, "MULTI");
  expect(Array.isArray(arr2)).toBe(true);
  if (Array.isArray(arr2)) {
    expect(arr2.length).toBe(2);
  }
});

describe("getUserAttribute - multi JSON string", () => {
  // sketch
  const val = getUserAttribute(polySketch, "MULTISTRING");
  expect(typeof val === "string").toBe(true);
  if (typeof val === "string") {
    const arr = JSON.parse(val);
    expect(arr.length).toBe(2);
  }

  // properties
  const val2 = getUserAttribute(polySketch.properties, "MULTISTRING");
  expect(typeof val2 === "string").toBe(true);
  if (typeof val2 === "string") {
    const arr = JSON.parse(val2);
    expect(arr.length).toBe(2);
  }
});

describe("getJsonUserAttribute - multi JSON string", () => {
  // sketch
  const arr = getJsonUserAttribute(polySketch, "MULTISTRING", []);
  expect(Array.isArray(arr)).toBe(true);
  expect(arr.length).toBe(2);

  // properties
  const arr2 = getJsonUserAttribute(polySketch.properties, "MULTISTRING", []);
  expect(Array.isArray(arr2)).toBe(true);
  expect(arr2.length).toBe(2);
});
