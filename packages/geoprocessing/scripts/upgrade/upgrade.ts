import fs from "fs-extra";
import path from "path";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import ora from "ora";
import { loadedPackageSchema } from "../../src/types/package.js";
import { $ } from "zx";
import { updatePackageJson } from "./updatePackage.js";
import { getTemplatePackages } from "../template/addTemplate.js";

$.verbose = true;

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH || "UNDEFINED";
const GP_PATH = process.env.GP_PATH || "UNDEFINED";

const spinner = ora("Upgrading project").start();

//// scripts ////
spinner.start("Update scripts");
await $`mkdir -p scripts && cp -r ${GP_PATH}/dist/base-project/scripts/* scripts`;
spinner.succeed("Update scripts");

//// i18n ////
spinner.start("Update i18n");
await $`npx tsx scripts/translationInstall.ts`;
spinner.succeed("Update i18n");

//// package.json ////

spinner.start("Update package.json");
const projectPkgRaw: GeoprocessingJsonConfig = fs.readJSONSync(
  `${PROJECT_PATH}/package.json`
);
const projectPkg = loadedPackageSchema.parse(projectPkgRaw);

const basePkgRaw: GeoprocessingJsonConfig = fs.readJSONSync(
  path.join(`${GP_PATH}/dist/base-project/package.json`)
);
const basePkg = loadedPackageSchema.parse(basePkgRaw);

const starterTemplatePkgs = await getTemplatePackages("starter-template");
const addonTemplatePkgs = await getTemplatePackages("add-on-template");
console.log(starterTemplatePkgs);
console.log(addonTemplatePkgs);

const updatedPkg = updatePackageJson(projectPkg, basePkg, [
  ...addonTemplatePkgs,
  ...starterTemplatePkgs,
]);

fs.writeJSONSync(`${PROJECT_PATH}/package.json`, updatedPkg, { spaces: 2 });

spinner.succeed("Update package.json");

//vscode

spinner.start("Update .vscode");
spinner.succeed("Update .vscode");
