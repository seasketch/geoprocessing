import fs from "fs";
import { calcAreaStats } from "../../src/metrics/calcAreaByClass";
import { FeatureCollection, Polygon } from "../../src/types";

export function areaByClass(
  inPath: string,
  outPath: string,
  classProperty: string
) {
  console.log("dirname", __dirname);
  const fc = JSON.parse(fs.readFileSync(inPath).toString());
  const features = fc as FeatureCollection<Polygon>;
  const stats = calcAreaStats(features, { classProperty });
  fs.writeFile(outPath, JSON.stringify(stats, null, 2), (err) =>
    err
      ? console.error("Error", err)
      : console.info(`Successfully wrote ${outPath}`)
  );
}
