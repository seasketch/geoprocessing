import fs from "fs-extra";
import {
  featureToSketchCollection,
  featureToSketch,
  genFeature,
  genFeatureCollection,
  genRandomPolygons,
  FeatureCollection,
  Polygon,
} from "@seasketch/geoprocessing";
import { program } from "commander";

/**
 * genRandomFeature script - generates random feature or sketch within given bounding box.
 * npx tsx genRandomFeature.ts --help for more info
 */

program
  .option(
    "--outDir <outDir>",
    "output directory",
    `${import.meta.dirname}/../examples/sketches/`,
  )
  .option(
    "--bbox <bbox>",
    "bounding box to constrain features",
    "[-180, -90, 180, 90]",
  )
  .option("--numFeatures <numFeatures>", "number of features to generate", "1")
  .option("--name <name>", "name of the file")
  .option("-s, --sketch", "generates Sketch instead of Feature");
program.parse();
const options = program.opts();

console.log(options);

const outdir = options.outDir;
const bbox = JSON.parse(options.bbox);
const numFeatures = Number.parseInt(options.numFeatures) || 1;
const type = options.sketch ? "Sketch" : "Feature";

console.log(bbox);

const name = (() => {
  const argName = options.name;
  if (argName) {
    return `${process.argv[3]}.json`;
  } else if (numFeatures > 1) {
    return `random${type}Collection`;
  } else {
    return `random${type}`;
  }
})();
const outfile = `${outdir}${name}.json`;

const sketches = (() => {
  const fc = genRandomPolygons({
    numPolygons: numFeatures,
    bounds: bbox,
  }) as FeatureCollection<Polygon>;

  if (type === "Feature") {
    if (numFeatures === 1) {
      return genFeature({ feature: fc.features[0], name });
    } else {
      const feats = genFeatureCollection(fc.features, { name });
      return feats;
    }
  } else {
    if (numFeatures === 1) {
      return featureToSketch(fc.features[0], name);
    } else {
      const sc = featureToSketchCollection(fc, name);
      return sc;
    }
  }
})();

await fs.remove(outfile);
fs.writeJSON(outfile, sketches, { spaces: 2 }, (err) => {
  if (err) throw err;
  console.log(`Sketches written to ${outfile}`);
});
