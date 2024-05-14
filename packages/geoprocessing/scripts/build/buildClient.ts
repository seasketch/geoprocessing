import fs from "fs-extra";
import path from "path";
// import * as esbuild from "esbuild";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { Package } from "../../src/types/index.js";
// import inlineImage from "esbuild-plugin-inline-image";
// import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import { v4 as uuid } from "uuid";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH || "UNDEFINED";
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

// Generate top-level ReportApp.tsx with dynamic import of report clients

const clientImportStr = geoprocessing.clients
  .map(
    (c) => `
reportClients["${c.name}"] = React.lazy(
  () => import(/* @vite-ignore */"../${c.source}")
);
`
  )
  .join("");

fs.writeFileSync(
  path.join(destBuildPath, "ReportApp.tsx"),
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

  ReactDOM.render(<ReportApp />, document.getElementById("root"));
`
);

// Create top-level index.html that loads report client

console.log("Generating index.html");
fs.writeFileSync(
  path.join(destBuildPath, "index.html"),
  `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>Report App</title>
      <style>
        html, body {margin: 0px; background-color:#efefef;padding: 4px;padding-top: 0px;}
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="ReportApp.tsx"></script>
    </body>
  </html>
`
);

const minify = process.env.NOMINIFY ? false : true;

const buildResult = await build({
  root: destBuildPath,
  base: "/",
  plugins: [react(), nodePolyfills()],
  publicDir: path.join(PROJECT_PATH, "src", "assets"),
  // add inline image
  build: {
    sourcemap: true,
    minify,
    outDir: path.join(destBuildPath, "dist"),
    emptyOutDir: false,
  },
});

// const buildResult = await esbuild.build({
//   entryPoints: [`${destBuildPath}/ReportApp.tsx`],
//   bundle: true,
//   outdir: destBuildPath,
//   format: "esm",
//   minify: minify,
//   sourcemap: "linked",
//   metafile: true,
//   treeShaking: true,
//   logLevel: "info",
//   external: [],
//   define: {
//     "process.env.GP_VERSION": JSON.stringify(packageGp.version),
//   },
//   plugins: [
//     //@ts-ignore
//     inlineImage(),
//     nodeModulesPolyfillPlugin({
//       modules: {
//         fs: "empty",
//       },
//     }),
//   ],
// });

// if (buildResult.errors.length > 0 || buildResult.warnings.length > 0) {
//   console.log(JSON.stringify(buildResult, null, 2));
//   throw new Error();
// }

// if (buildResult.metafile && process.env.ANALYZE) {
//   // use https://bundle-buddy.com/esbuild to analyze
//   console.log("Generating metafile esbuild-metafile-client.json");
//   await fs.writeFile(
//     `${PROJECT_PATH}/esbuild-metafile-client.json`,
//     JSON.stringify(buildResult.metafile)
//   );
// }
