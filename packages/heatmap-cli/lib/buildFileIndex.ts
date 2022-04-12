import fs from "fs";
import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

import { buildIndex } from "@seasketch/heatmap-core";

export function buildFileIndex(inFile: string, outDir: string) {
  const geojsonFC = JSON.parse(
    fs.readFileSync(`${inFile}`).toString()
  ) as FeatureCollection<Polygon | MultiPolygon>;

  const resolutions = [8, 9, 10, 11];
  const numClasses = 20;

  const { meta, index } = buildIndex(geojsonFC, resolutions, numClasses);

  index.map((resResult, resIndex) => {
    const res = resolutions[resIndex];
    fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(
      `${outDir}/h3_${res}_heat.json`,
      JSON.stringify(resResult.heatMap, null, 2)
    );
    fs.writeFileSync(
      `${outDir}/h3_${res}_heat_geo.json`,
      JSON.stringify(resResult.heatMapGeo, null, 2)
    );

    fs.writeFileSync(
      `${outDir}/h3_${res}_sap_byClass_compact.json`,
      JSON.stringify(resResult.sapByClassCompact, null, 2)
    );
    fs.writeFileSync(
      `${outDir}/h3_${res}_sap_byClass_geo.json`,
      JSON.stringify(resResult.sapByClassGeo, null, 2)
    );
  });

  console.log("Writing meta");
  fs.writeFileSync(`${outDir}/meta.json`, JSON.stringify(meta, null, 2));

  return true;
}
