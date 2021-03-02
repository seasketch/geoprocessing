import fs from "fs-extra";
import { Sketch, SketchCollection } from "../../src/types";
import { Feature, Geometry } from "geojson";
import path from "path";

/** Reads sketches from examples/sketches for testing. Run from project root */
export async function getExampleSketches(): Promise<
  Array<Sketch | SketchCollection>
> {
  const sketches: Array<Sketch | SketchCollection> = [];
  if (fs.existsSync("examples/sketches")) {
    let filenames = await fs.readdir("examples/sketches");
    await Promise.all(
      filenames
        .filter((fname) => /\.json/.test(fname))
        .map(async (f) => {
          const sketch = await fs.readJSON(`examples/sketches/${f}`);
          sketches.push(sketch);
        })
    );
  }
  return sketches;
}

/**
 * Convenience function returns object with sketches keyed by name
 */
export async function getExampleSketchesByName(): Promise<{
  [key: string]: Sketch | SketchCollection;
}> {
  const sketches = await getExampleSketches();
  return sketches.reduce<{
    [key: string]: Sketch | SketchCollection;
  }>((sketchObject, s) => {
    return {
      ...sketchObject,
      [s.properties.name]: s,
    };
  }, {});
}

export async function writeResultOutput(
  results: any,
  functionName: string,
  sketchName: string
) {
  if (!fs.existsSync("examples/output")) {
    await fs.mkdir("examples/output");
  }
  const folder = "examples/output/" + sketchName;
  if (!fs.existsSync(folder)) {
    await fs.mkdir(folder);
  }
  fs.writeFile(
    folder + "/" + functionName + ".json",
    JSON.stringify(results, null, "  ")
  );
}

export async function getExampleFeatures(): Promise<
  Feature<Geometry, { name: string }>[]
> {
  const features: Feature<Geometry, { name: string }>[] = [];
  if (fs.existsSync("examples/features")) {
    let filenames = await fs.readdir("examples/features");
    await Promise.all(
      filenames
        .filter((fname) => /\.json/.test(fname))
        .map(async (f) => {
          const feature = await fs.readJSON(`examples/features/${f}`);
          feature.properties = feature.properties || {};
          feature.properties.name = path.basename(f);
          features.push(feature);
        })
    );
  }
  return features;
}
