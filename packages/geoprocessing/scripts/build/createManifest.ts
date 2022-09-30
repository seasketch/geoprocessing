import fs from "fs";
import path from "path";
import { generateManifest } from "./generateManifest";
import { GeoprocessingJsonConfig } from "../../src/types";
import { PreprocessingBundle, GeoprocessingBundle } from "../types";
import { getHandlerFilenameFromSrcPath } from "../util/handler";
import { Package } from "../../src/types";

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
function getHandlerModule(srcFuncPath: string) {
  const name = getHandlerFilenameFromSrcPath(srcFuncPath);
  const p = path.join(buildPath, name.replace(`.js`, ""));
  return require(p);
}

const preprocessingBundles: PreprocessingBundle[] =
  config.preprocessingFunctions &&
  config.preprocessingFunctions.map(getHandlerModule);
const geoprocessingBundles: GeoprocessingBundle[] =
  config.geoprocessingFunctions &&
  config.geoprocessingFunctions.map(getHandlerModule);

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
