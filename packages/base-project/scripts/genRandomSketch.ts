#!/usr/bin/env ts-node
import fs from "fs-extra";
import project from "../project/projectClient.js";
import {
  featureToSketchCollection,
  featureToSketch,
  genRandomPolygons,
  FeatureCollection,
  Polygon,
} from "@seasketch/geoprocessing";

/**
 * genRandomSketch script - generates random sketch within the bounding box of the project.  Not guaranteed to be within the EEZ boundary
 * @param outdir - the output director to write sketches to.  Defaults to examples/sketches/
 * @param name - the name of the sketch and the filename to use with a .json extension added.
 * @param numSketches - number of sketches to generate.  Defaults to 1.  If greater than 1, will return as a sketch collection
 */

(async () => {
  const usage = "Usage: genRandomSketch [numSketches] [name] [outdir]";
  console.log(process.argv);
  const numPolygons = Number.parseInt(process.argv[2]) || 1;
  if (!numPolygons || numPolygons <= 0) throw new Error(usage);

  const name = (() => {
    const argName = process.argv[3];
    if (argName) {
      return `${process.argv[3]}.json`;
    } else if (numPolygons > 1) {
      return "randomSketchCollection";
    } else {
      return "randomSketch";
    }
  })();

  const outdir =
    process.argv[4] || `${import.meta.dirname}/../examples/sketches/`;

  const outfile = `${outdir}${name}.json`;

  const bounds = project.basic.bbox;
  if (!bounds) throw new Error("Missing bounds in basic.json");

  const sketches = (() => {
    const fc = genRandomPolygons({
      numPolygons,
      bounds,
    }) as FeatureCollection<Polygon>;
    if (numPolygons === 1) {
      return featureToSketch(fc.features[0], name);
    } else {
      const sc = featureToSketchCollection(fc, name);
      return sc;
    }
  })();

  await fs.remove(outfile);
  fs.writeJSON(outfile, sketches, { spaces: 2 }, (err) => {
    if (err) throw err;
    console.log(`Sketches written to ${outfile}`);
  });
})();
