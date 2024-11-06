import fs from "fs-extra";
import path from "node:path";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import ora from "ora";
import { LoadedPackage, loadedPackageSchema } from "../../src/types/package.js";
import { $ } from "zx";
import { updatePackageJson } from "./updatePackage.js";
import { getTemplatePackages } from "../template/templatePackages.js";
import { TemplateType } from "../types.js";
import { rekeyObject } from "../../src/index.js";

$.verbose = false;

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH || "UNDEFINED";
const GP_PATH = process.env.GP_PATH || "UNDEFINED";

const projectPkgRaw: GeoprocessingJsonConfig = fs.readJSONSync(
  `${PROJECT_PATH}/package.json`,
);
const projectPkg = loadedPackageSchema.parse(projectPkgRaw);

const spinner = ora("Upgrading project").start();

//// tsconfig ////

spinner.start("Update tsconfig.json");
await $`cp ${GP_PATH}/dist/base-project/tsconfig.json tsconfig.json`;
spinner.succeed("Update tsconfig.json");

//// scripts ////
spinner.start("Update scripts");

await $`mkdir -p scripts`;
await $`rm -rf scripts/genRandomFeature.ts scripts/genRandomSketch.ts`; // remove old scripts
await $`cp -r ${GP_PATH}/dist/base-project/scripts/* scripts`;
spinner.succeed("Update scripts");

//// i18n ////
spinner.start("Update i18n");

const extraTerms = (await fs.readJson(
  "src/i18n/extraTerms.json",
  "utf8",
)) as Record<string, string>;

await $`rm -rf src/i18n/baseLang`;
// Update (overwrite) most i18n directory except lang dir
await $`rm -f src/i18n/supported.ts`;
await $`cp -r ${GP_PATH}/dist/base-project/src/i18n/baseLang src/i18n`;
await $`cp -r ${GP_PATH}/dist/base-project/src/i18n/bin/* src/i18n/bin`;
await $`cp -r ${GP_PATH}/dist/base-project/src/i18n/*.* src/i18n`;

// Merge in new extra terms
const newTerms = (await fs.readJson(
  `${GP_PATH}/dist/base-project/src/i18n/extraTerms.json`,
  "utf8",
)) as Record<string, string>;
const updatedTerms = { ...extraTerms, ...newTerms };
await fs.writeJson("src/i18n/extraTerms.json", updatedTerms);

// install and verify valid i18n config

if (fs.existsSync("project/i18n.json")) {
  const i18nConfig = await fs.readJson("project/i18n.json");
  if (!i18nConfig.localNamespace) {
    i18nConfig.localNamespace = "translation";
  }
  if (!i18nConfig.remoteContext) {
    i18nConfig.remoteContext = projectPkg.name;
  }
  await fs.writeJson("project/i18n.json", i18nConfig);
} else {
  console.log("Creating new project/i18n.json");
  await fs.writeJSON("project/i18n.json", {
    localNamespace: "translation",
    remoteContext: projectPkg.name,
  });
}

const basic = await fs.readJson("project/basic.json");
if (!basic.languages || basic.languages.length === 0) {
  basic.languages = ["EN"];
  console.log(
    " Project languages are now configured in project/basic.json.  You will need to add/re-add languages there besides English. Just look at the codes found in `src/i18n/languages.json`.",
  );
}
await fs.writeJson("project/basic.json", basic);

spinner.succeed("Update i18n");

//// package.json ////

spinner.start("Update package.json");

const basePkgRaw: GeoprocessingJsonConfig = fs.readJSONSync(
  path.join(`${GP_PATH}/dist/base-project/package.json`),
);

loadedPackageSchema.parse(basePkgRaw); // parsing loses undefined fields so don't use result
const validPkg = basePkgRaw as unknown as LoadedPackage; // use the raw object we know is valid and cast

const templatesPath = getTemplatesPath("starter-template");
const starterTemplatePkgs = await getTemplatePackages(
  "starter-template",
  templatesPath,
);
const addonTemplatePkgs = await getTemplatePackages(
  "add-on-template",
  templatesPath,
);

const updatedPkg = updatePackageJson(projectPkg, validPkg, [
  ...addonTemplatePkgs,
  ...starterTemplatePkgs,
]);

// Remove old scripts
delete updatedPkg.scripts["install:scripts"];
delete updatedPkg.scripts["translation:install"];
delete updatedPkg.scripts["translation:extract"];
delete updatedPkg.scripts["translation:import"];
delete updatedPkg.scripts["translation:publish"];
delete updatedPkg.scripts["translation:sync"];

fs.writeJSONSync(`${PROJECT_PATH}/package.json`, updatedPkg);

spinner.succeed("Update package.json");

//// storybook ////

spinner.start("Update .storybook");

await $`rm -rf .storybook`;
// Update (overwrite) everything except lang directory
await $`cp -r ${GP_PATH}/dist/base-project/.storybook .storybook`;

spinner.succeed("Update .storybook");

//// vscode ////

spinner.start("Update .vscode");
await $`rm -rf .vscode && mkdir -p .vscode && cp -r ${GP_PATH}/dist/base-project/.vscode .`;
spinner.succeed("Update .vscode");

//// migration ////

spinner.start("Migrate config files");

// add type module (esm enable)
const pkg = fs.readJsonSync("package.json");
pkg.type = "module";
fs.writeJSONSync("package.json", pkg);

// move babel to have cjs extension
if (fs.existsSync("babel.config.js")) {
  await $`mv babel.config.js babel.config.cjs`;
}

// .nvmrc dropped in 7.0
if (fs.existsSync(".nvmrc")) {
  await $`rm .nvmrc`;
}

// geoprocessing.json moved to project folder in 7.0
if (fs.existsSync("geoprocessing.json")) {
  await $`mv geoprocessing.json project/geoprocessing.json`;
}

// update geoprocessing.json path in projectClient
const pc = await fs.readFile("project/projectClient.ts", "utf8");
const newPc = pc.replace("../geoprocessing.json", "./geoprocessing.json");
fs.writeFile("project/projectClient.ts", newPc, "utf8");

// copy prettier config file
await $`cp -r ${GP_PATH}/dist/base-project/.prettierrc.json .`;

// Merge prettier ignore file if exists
if (fs.existsSync(`${PROJECT_PATH}/.prettierignore`)) {
  // Convert to array of lines
  const projIgnoreArray = fs
    .readFileSync(`${PROJECT_PATH}/.prettierignore`)
    .toString()
    .split("\n");

  const gpIgnoreArray = fs
    .readFileSync(`${GP_PATH}/dist/base-project/.prettierignore`)
    .toString()
    .split("\n");

  for (const line of projIgnoreArray) {
    if (gpIgnoreArray.includes(line)) {
      continue;
    } else {
      gpIgnoreArray.push(line);
    }
  }

  // Convert back to string, with strings separates by newlines
  const ignoreLines = gpIgnoreArray.reduce<string>((acc, line, curIndex) => {
    if (line.length === 0) {
      return "";
    }
    if (curIndex === gpIgnoreArray.length - 1) {
      return acc.concat(line);
    }
    return acc.concat(line + "\n");
  }, "");

  await fs.writeFile(`${PROJECT_PATH}/.prettierignore`, ignoreLines);
} else {
  await $`cp -r ${GP_PATH}/dist/base-project/.prettierignore .`;
}

//// rekey package.json ////

fs.writeJSONSync(
  "package.json",
  rekeyObject(fs.readJsonSync("package.json"), [
    "name",
    "version",
    "description",
    "private",
    "type",
    "main",
    "keywords",
    "repositoryUrl",
    "repository",
    "bugs",
    "homepage",
    "author",
    "license",
    "scripts",
    "lint-staged",
    "dependencies",
    "devDependencies",
  ]),
  { spaces: 2 },
);

spinner.succeed("Migrate config files");

spinner.start("Run prettier code formatting");
await $`npx prettier --write --log-level=silent .`;
spinner.succeed("Run prettier code formatting");

console.log(`Upgrade complete!

See upgrade tutorial for additional steps - https://github.com/seasketch/geoprocessing/wiki/Tutorials/#upgrading-your-project  
`);

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
    `${templateType}s`,
  );
  if (fs.existsSync(publishedBundlePath)) {
    // Use bundled templates if user running published version, e.g. via geoprocessing init
    return publishedBundlePath;
  } else {
    // Use src templates
    return path.join(import.meta.dirname, "..", "..", "..");
  }
}
