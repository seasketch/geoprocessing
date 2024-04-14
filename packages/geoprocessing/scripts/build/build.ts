import fs from "fs";
import path from "path";
import * as esbuild from 'esbuild'
import { generateManifest } from "./generateManifest.js";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { getHandlerFilenameFromSrcPath } from "../util/handler.js";
import { Package } from "../../src/types/index.js";
import { generateHandler } from "./generateHandler.js"

// Inspect project file contents and generate manifest file
if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH;
const GP_ROOT = path.join(import.meta.dirname, "../../");

const srcBuildPath = path.join(GP_ROOT, ".build");
const destBuildPath = path.join(PROJECT_PATH, ".build");

if (!fs.existsSync(srcBuildPath)) {
  fs.mkdirSync(srcBuildPath);
}

const geoprocessing: GeoprocessingJsonConfig = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
);

const packageGp: Package = JSON.parse(
  fs.readFileSync("./package.json").toString()
);

const packageProject: Package = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);


if (
  !geoprocessing.preprocessingFunctions &&
  !geoprocessing.geoprocessingFunctions
) {
  throw new Error("No functions found in geoprocessing.json");
}

// For each project function generate root lambda function and bundle into single JS file with all dependencies
const functionPaths = [...geoprocessing.geoprocessingFunctions, ...geoprocessing.preprocessingFunctions]

console.log('Building geoprocessing functions...\n')

await Promise.all(functionPaths.map(async funcPath => {
  const handlerPath = generateHandler(funcPath, srcBuildPath, PROJECT_PATH)
  const bundledPath = handlerPath.replace('Handler', '').replace('.ts', '.js')
  console.log(`${bundledPath}`)
  const buildResult = await esbuild.build({
    entryPoints: [handlerPath],
    bundle: true,
    outfile: bundledPath,
    platform: 'node',
    format: 'esm',
    sourcemap: false,
    external: ['aws-cdk-lib', 'aws-sdk']
  })
  if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
    console.log(JSON.stringify(buildResult, null, 2))
  }
}))

// MANIFEST

console.log('\nBuilding service manifest...\n')

/**
 * Given full path to source geoprocessing function, requires and returns its pre-generated handler module
 */
async function getHandlerModule(srcFuncPath: string) {
  const name = getHandlerFilenameFromSrcPath(srcFuncPath);
  const p = path.join(srcBuildPath, name);
  return await import(p);
}

const preprocessingBundles: PreprocessingBundle[] =
  geoprocessing.preprocessingFunctions &&
  (await Promise.all(geoprocessing.preprocessingFunctions.map(getHandlerModule)));
const geoprocessingBundles: GeoprocessingBundle[] =
  geoprocessing.geoprocessingFunctions &&
  (await Promise.all(geoprocessing.geoprocessingFunctions.map(getHandlerModule)));

const manifest = generateManifest(
  geoprocessing,
  packageProject,
  preprocessingBundles,
  geoprocessingBundles,
  packageGp.version
);
const manifestPath = path.join(srcBuildPath, "manifest.json")
console.log(`\nCreating service manifest ${manifestPath}\n`)
fs.writeFileSync(
  manifestPath,
  JSON.stringify(manifest, null, "  ")
);


// OTHER_FUNCTIONS

console.log('Building support lambda functions...\n')

const otherFunctions = ['src/aws/serviceHandlers.ts', 'src/sockets/sendmessage.ts', 'src/sockets/connect.ts', 'src/sockets/disconnect.ts']

await Promise.all(otherFunctions.map(async functionPath => {
  const bundledName = path.basename(functionPath).replace('.ts', '.js')
  const bundledPath = path.join(destBuildPath, bundledName)
  console.log(`${bundledPath}`)
  const buildResult = await esbuild.build({
    entryPoints: [functionPath],
    bundle: true,
    outfile: bundledPath,
    platform: 'node',
    format: 'esm',
    sourcemap: false,
    external: ['aws-cdk-lib', 'aws-sdk']
  })
  if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
    console.log(JSON.stringify(buildResult, null, 2))
  }
}))