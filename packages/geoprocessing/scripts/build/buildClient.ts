import fs from "fs";
import path from "path";
import * as esbuild from "esbuild";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { Package } from "../../src/types/index.js";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";
import inlineImage from "esbuild-plugin-inline-image";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";

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

console.log("Found report clients in geoprocessing.json:");

const reportClients = geoprocessing.clients.reduce((clientSoFar, curClient) => {
  return { [curClient.name]: curClient.source, ...clientSoFar };
}, {});
Object.values(reportClients).forEach((clientPath) => console.log(clientPath));

// Generate top-level ReportApp.tsx

const clientImportStr = geoprocessing.clients
  .map(
    (c) => `
reportClients["${c.name}"] = React.lazy(
  () => import("../${c.source}")
);
`
  )
  .join("");

fs.writeFileSync(
  path.join(PROJECT_PATH, ".build-web/ReportApp.tsx"),
  `
  import React, { Suspense, lazy } from "react";
  import ReactDOM from "react-dom";
  import { App } from "@seasketch/geoprocessing/client-ui";

  const ReportApp = () => {
    const reportClients: Record<
      string,
      React.LazyExoticComponent<() => React.JSX.Element>
    > = {};
    ${clientImportStr}

    return (
      <Suspense fallback={<div>Loading reports...</div>}>
        <App reports={reportClients} />
      </Suspense>
    );
  };

  ReactDOM.render(<ReportApp />, document.body);
`
);

const buildResult = await esbuild.build({
  entryPoints: [".build-web/ReportApp.tsx"],
  bundle: true,
  outdir: destBuildPath,
  format: "esm",
  minify: true,
  sourcemap: "linked",
  metafile: true,
  treeShaking: true,
  logLevel: "info",
  external: [],
  define: {
    "process.env.REPORT_CLIENTS": JSON.stringify(reportClients),
    "process.env.GP_VERSION": JSON.stringify(packageGp.version),
  },
  plugins: [
    //@ts-ignore
    inlineImage(),
    nodeModulesPolyfillPlugin({
      modules: {
        fs: "empty",
        process: "empty",
      },
    }),
    htmlPlugin({
      files: [
        {
          entryPoints: [".build-web/ReportApp.tsx"],
          filename: "index.html",
          scriptLoading: "module",
          hash: true,
        },
      ],
    }),
  ],
});
if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
  console.log(JSON.stringify(buildResult, null, 2));
}
