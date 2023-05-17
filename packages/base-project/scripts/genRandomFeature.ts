#!/usr/bin/env ts-node
import fs from "fs-extra";
import project from "../project";
import {
  FeatureCollection,
  genFeature,
  genFeatureCollection,
  genRandomPolygons,
  Polygon,
} from "@seasketch/geoprocessing";

/**
 * genRandomFeature script - generates random feature within the bounding box of the project.  Not guaranteed to be within the EEZ boundary
 * @param outdir - the output director to write features to.  Defaults to examples/features/
 * @param name - the name of the feature and the filename to use with a .json extension added.
 * @param numfeatures - number of features to generate.  Defaults to 1.  If greater than 1, will return as a feature collection
 */

(async () => {
  const usage = "Usage: genRandomFeature [numfeatures] [name] [outdir]";
  console.log(process.argv);
  const numPolygons = parseInt(process.argv[2]) || 1;
  if (!numPolygons || numPolygons <= 0) throw new Error(usage);

  const name = (() => {
    const argName = process.argv[3];
    if (argName) {
      return `${process.argv[3]}`;
    } else if (numPolygons > 1) {
      return "randomFeatureCollection";
    } else {
      return "randomFeature";
    }
  })();

  const outdir = process.argv[4] || `${__dirname}/../examples/features/`;

  const outfile = `${outdir}${name}.json`;

  const bounds = project.basic.bbox;
  if (!bounds) throw new Error("Missing bounds in basic.json");

  const features = (() => {
    const fc = genRandomPolygons({
      numPolygons,
      bounds,
    }) as FeatureCollection<Polygon>;
    if (numPolygons === 1) {
      return genFeature({ feature: fc.features[0], name });
    } else {
      const feats = genFeatureCollection(fc.features, { name });
      return feats;
    }
  })();

  await fs.remove(outfile);
  fs.writeJSON(outfile, features, { spaces: 2 }, (err) => {
    if (err) throw err;
    console.log(`features written to ${outfile}`);
  });
})();
