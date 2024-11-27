import fs from "fs-extra";
import { area, bbox, featureCollection as fc } from "@turf/turf";
import { $ } from "zx";
import { getFeatures } from "../../../src/dataproviders/index.js";
import { chunk, roundDecimal } from "../../../src/helpers/index.js";
import project from "./ProjectClientGlobal.js";
import { clip } from "../../../src/toolbox/clip.js";

const outfile = "./mr-eez-land-union-precalc.json";
const infile = "/mnt/c/data/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.shp";

// THIS SCRIPT IS NOT VIABLE AS-IS
// Problem - turf falling over on large eez and/or land features, even when chunking
// Suggest solutions
// Option 1 - In QGIS, subtract whole OSM land from EEZ
// Option 2 - crosswalk eez to osm land, fetch land features, filter to one country, calc with each land feature, then area, sum the result

// start fresh
await $`rm -f ${outfile}`;

// calculate equal area 6933 using sqlite, and strip unneeded properties
//const query = `SELECT "UNION", GEOMETRY, round(ST_Area(ST_Transform(GEOMETRY, 6933)), 0) as area_6933 FROM EEZ_Land_v3_202030 ORDER BY "UNION"`;

// Convert shapefile to geojson and pare down attributes
const query = `SELECT "UNION", GEOMETRY FROM EEZ_Land_v3_202030 ORDER BY "UNION"`;
await $`ogr2ogr -f GeoJSON -dialect sqlite -sql ${query} ${outfile} ${infile}`;

// Calculate turf area (after subtracting osm land) and bbox, strip geometry to save space
const eezFeatures = fs.readJSONSync(outfile);
// calculate turf area = eez - osm land
const landDs = project.getExternalVectorDatasourceById(
  "global-clipping-osm-land",
);
const landUrl = project.getDatasourceUrl(landDs);
for (const eezFeat of eezFeatures.features) {
  // Get land features that overlap with eez
  const eezBbox = bbox(eezFeat);
  const landFeatures = await getFeatures(landDs, landUrl, {
    unionProperty: "gid", // gid is assigned per country
    bbox: eezBbox,
  });

  const eezNoLandArea = area(eezFeat);
  let remEezArea = 0;
  console.log(eezFeat.properties.UNION);
  console.log("eezNoLandArea:", eezNoLandArea);
  console.log("numLandFeatures:", landFeatures.length);

  const featToChunkSize = (numFeatures) => {
    if (numFeatures > 8000) return 100;
    else if (numFeatures > 6000) return 500;
    else if (numFeatures > 4000) return 4000;
    else return numFeatures;
  };

  const chunkSize = featToChunkSize(landFeatures.length);
  const chunks = chunk(landFeatures, chunkSize);

  console.log(`${chunks.length} chunks, ${chunkSize} features each`);
  // Start with whole eezFeat and subtract one chunk of land features at a time to not blow up clip
  let remainder = eezFeat;
  for (const [idx, curChunk] of chunks.entries()) {
    console.log(`chunk ${idx + 1} of ${chunks.length}`);
    remainder = clip(fc([remainder, ...curChunk]), "difference");
  }
  remEezArea = remainder ? area(remainder) : remEezArea;

  console.log("remEezArea:", eezNoLandArea);
  console.log(
    `${roundDecimal((remEezArea / eezNoLandArea) * 100, 1)}% decrease`,
  );
  console.log(" ");
  console.log(" ");

  eezFeat.area_turf = remEezArea;
  eezFeat.bbox = bbox(eezFeat);
  eezFeat.geometry = null; // remove geometry to save space
  fs.writeJsonSync(outfile, eezFeatures);
}
