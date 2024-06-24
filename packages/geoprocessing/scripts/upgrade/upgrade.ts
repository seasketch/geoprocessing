import fs from "fs-extra";
import path from "path";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import ora from "ora";
import { loadedPackageSchema } from "../../src/types/package.js";
import { $ } from "zx";
import { updatePackageJson } from "./updatePackage.js";
import { getTemplatePackages } from "../template/templatePackages.js";
import { TemplateType } from "../types.js";

$.verbose = false;

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH || "UNDEFINED";
const GP_PATH = process.env.GP_PATH || "UNDEFINED";

const projectPkgRaw: GeoprocessingJsonConfig = fs.readJSONSync(
  `${PROJECT_PATH}/package.json`
);
const projectPkg = loadedPackageSchema.parse(projectPkgRaw);

const spinner = ora("Upgrading project").start();

//// tsconfig ////

spinner.start("Update tsconfig.json");
await $`cp ${GP_PATH}/dist/base-project/tsconfig.json tsconfig.json`;
spinner.succeed("Update tsconfig.json");

//// scripts ////
spinner.start("Update scripts");
await $`mkdir -p scripts && cp -r ${GP_PATH}/dist/base-project/scripts/* scripts`;
spinner.succeed("Update scripts");

//// i18n ////
spinner.start("Update i18n");

await $`rm -rf src/i18n/baseLang`;
// Update (overwrite) most i18n directory except lang dir and some config files
await $`cp -r ${GP_PATH}/dist/base-project/src/i18n/baseLang src/i18n`;
await $`cp -r ${GP_PATH}/dist/base-project/src/i18n/bin/* src/i18n/bin`;
await $`mv src/i18n/supported.ts src/i18n/supported.ts.bak`;
await $`cp -r ${GP_PATH}/dist/base-project/src/i18n/*.* src/i18n`;
await $`mv src/i18n/supported.ts.bak src/i18n/supported.ts`;

// install and verify valid i18n config

if (!fs.existsSync("project/i18n.json")) {
  console.log("Creating new project/i18n.json");
  await fs.writeJSON("project/i18n.json", {
    localNamespace: "translation",
    remoteContext: projectPkg.name,
  });
} else {
  const i18nConfig = await fs.readJson("project/i18n.json");
  if (!i18nConfig.localNamespace) {
    i18nConfig.localNamespace = "translation";
  }
  if (!i18nConfig.remoteContext) {
    i18nConfig.remoteContext = projectPkg.name;
  }
  await fs.writeJson("project/i18n.json", i18nConfig, { spaces: 2 });
}

spinner.succeed("Update i18n");

//// package.json ////

spinner.start("Update package.json");

const basePkgRaw: GeoprocessingJsonConfig = fs.readJSONSync(
  path.join(`${GP_PATH}/dist/base-project/package.json`)
);
const basePkg = loadedPackageSchema.parse(basePkgRaw);

const templatesPath = getTemplatesPath("starter-template");
const starterTemplatePkgs = await getTemplatePackages(
  "starter-template",
  templatesPath
);
const addonTemplatePkgs = await getTemplatePackages(
  "add-on-template",
  templatesPath
);

const updatedPkg = updatePackageJson(projectPkg, basePkg, [
  ...addonTemplatePkgs,
  ...starterTemplatePkgs,
]);

// Remove old scripts
delete updatedPkg.scripts["install:scripts"];
delete updatedPkg.scripts["translation:install"];

fs.writeJSONSync(`${PROJECT_PATH}/package.json`, updatedPkg, { spaces: 2 });

spinner.succeed("Update package.json");

//// storybook ////

spinner.start("Update .storybook");

await $`rm -rf .storybook`;
// Update (overwrite) everything except lang directory
await $`cp -r ${GP_PATH}/dist/base-project/.storybook .storybook`;

spinner.succeed("Update .storybook");

//// vscode ////

spinner.start("Update .vscode");
await $`mkdir -p .vscode && cp -r ${GP_PATH}/dist/base-project/.vscode .vscode`;
spinner.succeed("Update .vscode");

//// other ////

if (fs.existsSync(".nvmrc")) {
  await $`rm .nvmrc`;
}

/**
 * @param templateType
 * @returns path to template directories, given template type
 */
function getTemplatesPath(templateType: TemplateType): string {
  // published bundle path exists if this is being run from the published geoprocessing package
  // (e.g. via geoprocessing init or add:template)
  const publishedBundlePath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "templates",
    `${templateType}s`
  );
  if (fs.existsSync(publishedBundlePath)) {
    // Use bundled templates if user running published version, e.g. via geoprocessing init
    return publishedBundlePath;
  } else {
    // Use src templates
    return path.join(import.meta.dirname, "..", "..", "..");
  }
}
