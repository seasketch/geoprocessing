#!/usr/bin/env ts-node
import {
  FeatureCollection,
  Polygon,
  featureToSketchCollection,
} from "@seasketch/geoprocessing";
import fs from "fs-extra";

if (require.main === module) {
  const usage =
    "Converts geojson polygon feature collection to sketch collection \n Usage: convertToSketch [INFILE] [OUTFILE] [NAME_PROPERTY]. \n INFILE expected to be polygon feature collection. \n NAME is optional feature property to assign sketch name from.  If not property by that name in feature then used as a name prefix [PREFIX]-1, [PREFIX-2], otherwise sketch names assigned as 'Area-1', 'Area-2'";

  let infile = process.argv[2];
  let outfile = process.argv[3];
  let name = process.argv[4];
  if (!infile || !outfile) {
    console.error(usage);
    process.exit();
  }

  const fc = fs.readJSONSync(infile) as FeatureCollection<Polygon>;
  const sc = featureToSketchCollection(fc, name);

  fs.removeSync(outfile);
  fs.writeJSONSync(outfile, sc, { spaces: 4 });
}
