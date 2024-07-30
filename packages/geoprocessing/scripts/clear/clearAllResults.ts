import fs from "fs";
import path from "path";
import { deleteTasks } from "./deleteTasks.js";

const packageJson = JSON.parse(
  fs.readFileSync(path.join("./", "package.json")).toString()
);

const geoprocessingJson = JSON.parse(
  fs.readFileSync(path.join("./", "project", "geoprocessing.json")).toString()
);

export async function clearResults() {
  await deleteTasks(packageJson.name, geoprocessingJson.region);
}
