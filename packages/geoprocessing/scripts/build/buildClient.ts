import fs from "fs";
import path from "path";
import * as esbuild from "esbuild";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { Package } from "../../src/types/index.js";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";
import inlineImage from "esbuild-plugin-inline-image";

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH;
const GP_ROOT = path.join(import.meta.dirname, "../../");
const destBuildPath = path.join(PROJECT_PATH, ".build-web");

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

console.log("Building report clients:");

// await Promise.all(geoprocessing.clients.map(async client => {
//   const clientPath = path.join(PROJECT_PATH, client.source)
//   console.log('clientPath', clientPath)
//   const bundledPath = path.join(destBuildPath, client.source).replace('.ts', '.js')
//   console.log('bundledPath', `${bundledPath}`)
//   const buildResult = await esbuild.build({
//     entryPoints: [clientPath],
//     bundle: true,
//     outfile: bundledPath,
//     format: 'esm',
//     sourcemap: false,
//   })
//   if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
//     console.log(JSON.stringify(buildResult, null, 2))
//   }
// }))

// const appPath = path.join(PROJECT_PATH, "src/components/App.tsx")
// console.log('appPath', appPath)
// const bundledPath = path.join(destBuildPath, 'main.js')
// console.log('bundledPath', `${bundledPath}`)
const reportClients = geoprocessing.clients.reduce((clientSoFar, curClient) => {
  return { [curClient.name]: curClient.source, ...clientSoFar };
}, {});
Object.values(reportClients).forEach((clientPath) => console.log(clientPath));

const buildResult = await esbuild.build({
  entryPoints: ["src/components/Root.tsx"],
  bundle: true,
  outdir: destBuildPath,
  format: "esm",
  sourcemap: true,
  metafile: true,
  logLevel: "info",
  external: ["node-fetch", "geoblaze"],
  // splitting: true,
  define: {
    "process.env.REPORT_CLIENTS": JSON.stringify(reportClients),
    "process.env.GP_VERSION": JSON.stringify(packageGp.version),
  },
  plugins: [
    //@ts-ignore
    inlineImage(),
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/components/Root.tsx"],
          filename: "index.html",
        },
      ],
    }),
  ],
});
if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
  console.log(JSON.stringify(buildResult, null, 2));
}
