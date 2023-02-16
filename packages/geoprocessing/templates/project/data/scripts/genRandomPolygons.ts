#!/usr/bin/env ts-node
import fs from "fs-extra";
import project from "../../project/projectClient";
import { genRandomPolygons } from "@seasketch/geoprocessing";

/**
 * genRandomPolygons script - generates random polygons within the bounding box of the project
 * @param outfile - the output path with filename to write out polygons to. Defaults to data/src/randomPolygons.geojson
 * @param numPolygons - number of polygons to generate.  Defaults to 300
 */

const usage = "Usage: gen_random_polygons [outfile] [numPolygons]";
const outfile = process.argv[2] || `${__dirname}/../src/randomPolygons.geojson`;
const numPolygons = parseInt(process.argv[3]) || 300;
if (!numPolygons || numPolygons <= 0) throw new Error(usage);

const bounds = project.basic.bbox;
if (!bounds) throw new Error("Missing bounds in basic.json");

const fc = genRandomPolygons({ numPolygons, bounds });

fs.writeJSON(outfile, fc, (err) => {
  if (err) throw err;
  console.log(`Shapes written to ${outfile}`);
});
