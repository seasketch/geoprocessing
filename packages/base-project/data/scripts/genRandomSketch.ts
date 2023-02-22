#!/usr/bin/env ts-node
import fs from "fs-extra";
import project from "../../project/projectClient";
import {
  featureToSketchCollection,
  genRandomPolygons,
} from "@seasketch/geoprocessing";

/**
 * genRandomSketch script - generates random sketch within the bounding box of the project.  Not guaranteed to be within the EEZ boundary
 * @param outdir - the output director to write sketches to.  Defaults to examples/sketches/
 * @param name - the name of the sketch and the filename to use with a .json extension added.
 * @param numSketches - number of sketches to generate.  Defaults to 1.  If greater than 1, will return as a sketch collection
 */

(async () => {
  const usage = "Usage: gen_random_sketch [numSketches] [name] [outdir]";
  console.log(process.argv);
  const numPolygons = parseInt(process.argv[2]) || 1;
  if (!numPolygons || numPolygons <= 0) throw new Error(usage);

  const name = process.argv[3]
    ? `${process.argv[3]}.json`
    : "randomSketch.json";

  const outdir = process.argv[4] || `${__dirname}/../../examples/sketches/`;

  const outfile = `${outdir}${name}`;

  const bounds = project.basic.bbox;
  if (!bounds) throw new Error("Missing bounds in basic.json");

  const fc = genRandomPolygons({ numPolygons, bounds });
  const sc = featureToSketchCollection(fc);

  const sketches = (() => {
    if (numPolygons === 1) {
      return sc.features[0];
    } else {
      return sc;
    }
  })();

  await fs.remove(outfile);
  fs.writeJSON(outfile, sketches, { spaces: 2 }, (err) => {
    if (err) throw err;
    console.log(`Sketches written to ${outfile}`);
  });
})();
