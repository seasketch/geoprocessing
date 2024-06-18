import fs from "fs-extra";
import path from "path";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { Package } from "../../src/types/index.js";
import ora from "ora";

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH || "UNDEFINED";

const spinner = ora("Upgrading project").start();

spinner.start("Update scripts");
spinner.succeed("Update scripts");

spinner.start("Update i18n");
spinner.succeed("Update i18n");

spinner.start("Update package.json");
spinner.succeed("Update package.json");

spinner.start("Update .vscode");
spinner.succeed("Update .vscode");

const geoprocessing: GeoprocessingJsonConfig = JSON.parse(
  fs
    .readFileSync(path.join(PROJECT_PATH, "project", "geoprocessing.json"))
    .toString()
);

const packageGp: Package = JSON.parse(
  fs.readFileSync("./package.json").toString()
);

const packageProject: Package = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);
