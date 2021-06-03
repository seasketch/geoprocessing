import {
  getExampleSketches,
  getExamplePolygonSketches,
  getExampleSketchCollections,
  getExampleSketchAll,
  getExampleLineStringSketches,
  getExamplePointSketches,
} from "./index";

describe("Example load utilities", () => {
  test("can get both sketches and collections", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleSketchAll();
    expect(examples.length).toBe(4);
  });
  test("can get just collections", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleSketchCollections();
    expect(examples.length).toBe(1);
  });
  test("can get just sketches", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleSketches();
    expect(examples.length).toBe(3);
  });
  test("can get just sketch polygons", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExamplePolygonSketches();
    expect(examples.length).toBe(1);
  });
  test("can get just sketch linestrings", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleLineStringSketches();
    expect(examples.length).toBe(1);
  });
  test("can get just sketch points", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExamplePointSketches();
    expect(examples.length).toBe(1);
  });
});
