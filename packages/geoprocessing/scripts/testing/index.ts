import fs from "fs-extra";
import { Sketch, SketchCollection } from "../../src/types";

/** Reads sketches from examples/sketches for testing. Run from project root */
export async function getExampleSketches(): Promise<
  Array<Sketch | SketchCollection>
> {
  let filenames = await fs.readdir("examples/sketches");
  const sketches: Array<Sketch | SketchCollection> = [];
  await Promise.all(
    filenames
      .filter(fname => /\.json/.test(fname))
      .map(async f => {
        const sketch = await fs.readJSON(`examples/sketches/${f}`);
        sketches.push(sketch);
      })
  );
  return sketches;
}

export async function writeResultOutput(
  results: any,
  functionName: string,
  sketchName: string
) {
  const folder = "examples/output/" + sketchName;
  if (!fs.existsSync(folder)) {
    await fs.mkdir(folder);
  }
  fs.writeFile(
    folder + "/" + functionName + ".json",
    JSON.stringify(results, null, "  ")
  );
}
