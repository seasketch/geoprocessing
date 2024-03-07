import fs from "fs-extra";
import area from "@turf/area";
import bbox from "@turf/bbox";
import { $ } from "zx";
import { getFeatures } from "../../../src/dataproviders/index.js";
import { featureCollection as fc } from "@turf/helpers";
import { chunk, clip, roundDecimal } from "../../../src/helpers/index.js";
import project from "./ProjectClientGlobal.js";

// Calculates stats using Marine Regions EEZ v12
// Which metadata says is based on ESRI World Countries 2014 with some differences, possibly amendments using GEBCO or other bathymetry data

const outfile = "./mr-eez-precalc.json";
const infile = "/mnt/c/data/World_EEZ_v12_20231025/eez_v12.shp";

(async () => {
  // start fresh
  await $`rm -f ${outfile}`;

  // calculate equal area 6933 using sqlite, and strip unneeded properties
  //const query = `SELECT "GEONAME", GEOMETRY, round(ST_Area(ST_Transform(GEOMETRY, 6933)), 0) as area_6933 FROM EEZ_Land_v3_202030 ORDER BY "GEONAME"`;

  // Convert shapefile to geojson and pare down attributes
  const query = `SELECT "GEONAME", GEOMETRY FROM eez_v12 ORDER BY "GEONAME"`;
  await $`ogr2ogr -f GeoJSON -dialect sqlite -sql ${query} ${outfile} ${infile}`;

  // Calculate turf area and bbox, strip geometry to save space
  let eezFeatures = fs.readJSONSync(outfile);

  for (const eezFeat of eezFeatures.features) {
    console.log(eezFeat.properties.GEONAME);
    eezFeat.area_turf = area(eezFeat);
    eezFeat.bbox = bbox(eezFeat);
    eezFeat.geometry = null; // remove geometry to save space
  }
  fs.writeJsonSync(outfile, eezFeatures);
})();
