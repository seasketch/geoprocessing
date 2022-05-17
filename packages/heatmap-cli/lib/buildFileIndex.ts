import fs from "fs";
import { FeatureCollection, Polygon, MultiPolygon } from "geojson";

import { buildIndex } from "@seasketch/heatmap-core";

export function buildFileIndex(
  inFile: string,
  outDir: string,
  options?: {
    resolutions: number[];
    numClasses: number;
  }
) {
  const buildOptions = {
    resolutions: [8, 9, 10, 11],
    numClasses: 20,
    ...(options || {}),
  };
  const geojsonFC = JSON.parse(
    fs.readFileSync(`${inFile}`).toString()
  ) as FeatureCollection<Polygon | MultiPolygon>;

  const { meta, index } = buildIndex(
    geojsonFC,
    buildOptions.resolutions,
    buildOptions.numClasses
  );

  index.map((resResult, resIndex) => {
    const res = buildOptions.resolutions[resIndex];
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
