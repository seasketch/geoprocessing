import fs from "fs";
import path from "path";
import { generateManifest } from "./generateManifest";
import { GeoprocessingJsonConfig } from "../../src/types";
import { Package, LambdaHandler } from "../types";

// Inspect project file contents and generate manifest file
if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const projectPath = process.env.PROJECT_PATH;
const buildPath = "../../../";

const config: GeoprocessingJsonConfig = JSON.parse(
  fs.readFileSync(path.join(projectPath, "geoprocessing.json")).toString()
);

const pkgGeo: Package = JSON.parse(
  fs.readFileSync("./package.json").toString()
);

const projectPkg: Package = JSON.parse(
  fs.readFileSync(path.join(projectPath, "package.json")).toString()
);

function getHandlerModule(func: string) {
  let name = path.basename(func);
  const parts = name.split(".");
  name = parts.slice(0, -1).join(".") + `Handler.js`;

  // Need path to build dir
  const p = path.join(buildPath, name.replace(`.js`, ""));
  return require(p);
}

const PreprocessingHandlers = config.preprocessingFunctions.map(
  getHandlerModule
);
const GeoprocessingHandlers = config.geoprocessingFunctions.map(
  getHandlerModule
);

const manifest = generateManifest(
  config,
  pkgGeo,
  PreprocessingHandlers,
  GeoprocessingHandlers,
  pkgGeo.version
);
fs.writeFileSync(
  path.join(".build", "manifest.json"),
  JSON.stringify(manifest, null, "  ")
);
