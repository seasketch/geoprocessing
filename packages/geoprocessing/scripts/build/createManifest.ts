import fs from "fs";
import path from "path";
import { generateManifest } from "./generateManifest.js";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { getHandlerFilenameFromSrcPath } from "../util/handler.js";
import { Package } from "../../src/types/index.js";

// Inspect project file contents and generate manifest file
if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const projectPath = process.env.PROJECT_PATH;
const buildPath = path.join("..", "..", "..", ".build");

const config: GeoprocessingJsonConfig = JSON.parse(
  fs.readFileSync(path.join(projectPath, "geoprocessing.json")).toString()
);

const pkgGeo: Package = JSON.parse(
  fs.readFileSync("./package.json").toString()
);

const projectPkg: Package = JSON.parse(
  fs.readFileSync(path.join(projectPath, "package.json")).toString()
);

/**
 * Given full path to source geoprocessing function, requires and returns its pre-generated handler module
 */
async function getHandlerModule(srcFuncPath: string) {
  const name = getHandlerFilenameFromSrcPath(srcFuncPath);
  const p = path.join(buildPath, name.replace(`.js`, ""));
  return await import(p);
}

const preprocessingBundles: PreprocessingBundle[] =
  config.preprocessingFunctions &&
  (await Promise.all(config.preprocessingFunctions.map(getHandlerModule)));
const geoprocessingBundles: GeoprocessingBundle[] =
  config.geoprocessingFunctions &&
  (await Promise.all(config.geoprocessingFunctions.map(getHandlerModule)));

const manifest = generateManifest(
  config,
  projectPkg,
  preprocessingBundles,
  geoprocessingBundles,
  pkgGeo.version
);
fs.writeFileSync(
  path.join(".build", "manifest.json"),
  JSON.stringify(manifest, null, "  ")
);
