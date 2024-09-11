import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { deleteTasks } from "./deleteTasks.js";

interface ClearCacheOptions {
  tableName: string;
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join("./", "package.json")).toString(),
);

const geoprocessingJson = JSON.parse(
  fs.readFileSync(path.join("./", "project", "geoprocessing.json")).toString(),
);

export async function clearResults() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "tableName",
      message:
        "Name of the report function cache to clear. Enter 'all' to clear all cached reports:",
      validate: (value) =>
        /^\w+$/.test(value) ? true : "Please use only alphabetical characters",
    },
  ]);
  await clearCachedResults(answers);
}

export async function clearCachedResults(options: ClearCacheOptions) {
  const serviceName = options.tableName;
  await deleteTasks(packageJson.name, geoprocessingJson.region, serviceName);
}

clearResults();
