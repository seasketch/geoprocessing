import {
  getExampleSketches,
  getExampleSketchCollections,
  getExampleSketchAll,
} from "./index";

describe("Example load utilities", () => {
  test("can get both sketches and collections", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleSketchAll();
    expect(examples.length).toBe(2);
  });
  test("can get just collections", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleSketchCollections();
    expect(examples.length).toBe(1);
  });
  test("can get just sketches", async () => {
    console.log("cwd", process.cwd());
    const examples = await getExampleSketches();
    expect(examples.length).toBe(1);
  });
});
