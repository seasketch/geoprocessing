import fs from "fs-extra";
import { SketchCollection } from "../types";
import { Feature } from "geojson";

/** Reads sketches from examples/sketches for testing. Run from project root */
export async function getExampleSketches(): Promise<
  Array<Feature | SketchCollection>
> {
  let filenames = await fs.readdir("examples/sketches");
  const sketches = [];
  await Promise.all(
    filenames
      .filter(fname => /\.json/.test(fname))
      .map(async f => {
        const sketch = await fs.readJSON(f);
        sketches.push(sketch);
      })
  );
  return sketches;
}
