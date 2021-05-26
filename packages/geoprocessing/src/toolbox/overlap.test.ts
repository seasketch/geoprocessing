import { overlap } from "./overlap";
import { Geometry } from "../types";
import { genSampleSketch } from "../fixtures";

const pointSketch = genSampleSketch({
  type: "Point",
  coordinates: [1, 2],
});

const lineSketchA = genSampleSketch({
  type: "LineString",
  coordinates: [
    [1, 1],
    [2, 2],
    [3, 3],
  ],
});

const lineSketchB = genSampleSketch({
  type: "LineString",
  coordinates: [
    [2, 2],
    [3, 3],
    [4, 4],
  ],
});

const lineSketchC = genSampleSketch({
  type: "LineString",
  coordinates: [
    [4, 4],
    [5, 5],
  ],
});

const lineSketchD = genSampleSketch({
  type: "LineString",
  coordinates: [
    [4, 4],
    [5, 10],
  ],
});

const polySketchA = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [0, 2],
      [2, 2],
      [2, 0],
      [0, 0],
    ],
  ],
});

const polySketchB = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [1, 1],
      [1, 3],
      [3, 3],
      [3, 1],
      [1, 1],
    ],
  ],
});

const polySketchC = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [3, 3],
      [3, 5],
      [5, 5],
      [5, 3],
      [3, 3],
    ],
  ],
});

const polySketchD = genSampleSketch({
  type: "Polygon",
  coordinates: [
    [
      [3, 3],
      [3, 5],
      [5, 5],
      [5, 3],
      [3, 183827],
    ],
  ],
});

describe("Overlap unit tests", () => {
  test("sketches cannot be equal", async () => {
    const result = await overlap([polySketchA], [polySketchA]);
    expect(result.length).toBe(0);
  });

  // Polygons
  test("A and B poly feature overlap", async () => {
    const result = await overlap([polySketchA], [polySketchB]);
    expect(result.length).toBe(1);
  });
  test("A and C poly feature do not overlap", async () => {
    const result = await overlap([polySketchA], [polySketchC]);
    expect(result.length).toBe(0);
  });
  test("A and B poly geometry overlap", async () => {
    const result = await overlap(
      [polySketchA.geometry],
      [polySketchB.geometry]
    );
    expect(result.length).toBe(1);
  });
  test("A and C poly geometry do not overlap", async () => {
    const result = await overlap(
      [polySketchA.geometry],
      [polySketchC.geometry]
    );
    expect(result.length).toBe(0);
  });
  test("A and B together overlap with C", async () => {
    const result = await overlap([polySketchA, polySketchB], [polySketchC]);
    expect(result.length).toBe(1);
  });
  test("A and B together overlap with C and D", async () => {
    const result = await overlap(
      [polySketchA, polySketchB],
      [polySketchC, polySketchD]
    );
    expect(result.length).toBe(2);
  });
  test("A overlaps with B but not C", async () => {
    const result = await overlap([polySketchA], [polySketchB, polySketchC]);
    expect(result.length).toBe(1);
  });
  test("idProperty of name should return just one poly", async () => {
    const result = await overlap(
      [polySketchB],
      [polySketchA, polySketchC, polySketchD],
      "name"
    );
    // All test sketches get the same name so it should only return the first that overlaps
    expect(result.length).toBe(1);
  });

  // Lines
  test("A and B line overlap", async () => {
    const result = await overlap([lineSketchA], [lineSketchB]);
    expect(result.length).toBe(1);
  });
  test("A and C line do not overlap", async () => {
    const result = await overlap([lineSketchA], [lineSketchC]);
    expect(result.length).toBe(0);
  });
  test("A overlaps with B but not C", async () => {
    const result = await overlap([lineSketchA], [lineSketchB, lineSketchC]);
    expect(result.length).toBe(1);
  });
  test("idProperty of name should return just one line", async () => {
    const result = await overlap(
      [lineSketchB],
      [lineSketchA, lineSketchC, lineSketchD],
      "name"
    );
    // All test sketches get the same name so it should only return the first that overlaps
    expect(result.length).toBe(1);
  });
});
