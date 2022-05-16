import {
  getExampleSketches,
  getExamplePolygonSketches,
  getExampleSketchCollections,
  getExampleSketchAll,
  getExamplePolygonSketchAll,
  getExampleLineStringSketchAll,
  getExamplePointSketchAll,
  getExampleLineStringSketches,
  getExamplePointSketches,
  getExampleMultiPolygonSketchAll,
  getExamplePolygonAllSketchAll,
  getExampleMultiPolygonSketches,
  getExamplePolygonAllSketches,
} from "./index";

// examples are loaded from fixture folder in packages/geoprocessing/examples
describe("Example load utilities", () => {
  test("can get both sketches and collections of all geometry type", async () => {
    const examples = await getExampleSketchAll();
    expect(examples.length).toBe(9);
  });
  test("can get just polygon sketches and collections", async () => {
    const examples = await getExamplePolygonSketchAll();
    expect(examples.length).toBe(2);
  });
  test("can get just multipolygon sketches and collections", async () => {
    const examples = await getExampleMultiPolygonSketchAll();
    expect(examples.length).toBe(2);
  });
  test("can get polygon and multipolygon sketches and collections", async () => {
    const examples = await getExamplePolygonAllSketchAll();
    expect(examples.length).toBe(5);
  });
  test("can get just linestring sketches and collections", async () => {
    const examples = await getExampleLineStringSketchAll();
    expect(examples.length).toBe(2);
  });
  test("can get just point sketches and collections", async () => {
    const examples = await getExamplePointSketchAll();
    expect(examples.length).toBe(2);
  });
  test("can filter examples by name", async () => {
    const examples = await getExampleSketchAll("sketch_line");
    expect(examples.length).toBe(1);
  });
  test("can get just collections", async () => {
    const examples = await getExampleSketchCollections();
    expect(examples.length).toBe(5);
  });
  test("can get just sketches", async () => {
    const examples = await getExampleSketches();
    expect(examples.length).toBe(4);
  });
  test("can get just sketch polygons", async () => {
    const examples = await getExamplePolygonSketches();
    expect(examples.length).toBe(1);
  });
  test("can get just sketch multipolygons", async () => {
    const examples = await getExampleMultiPolygonSketches();
    expect(examples.length).toBe(1);
  });
  test("can get sketch polygons and multipolygons", async () => {
    const examples = await getExamplePolygonAllSketches();
    expect(examples.length).toBe(2);
  });
  test("can get just sketch linestrings", async () => {
    const examples = await getExampleLineStringSketches();
    expect(examples.length).toBe(1);
  });
  test("can get just sketch points", async () => {
    const examples = await getExamplePointSketches();
    expect(examples.length).toBe(1);
  });
});
