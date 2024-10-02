import fs from "fs-extra";
import path from "node:path";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

/**
 * Builds project geoprocessing and preprocessing functions
 * @param projectPath - project path containing package.json, geoprocessing.json, and geoprocessing or preprocessing functions
 * @param destBuildPath - path to write bundled clients to
 */
export async function buildProjectClients(
  projectPath: string,
  destBuildPath: string,
) {
  const geoprocessing: GeoprocessingJsonConfig = JSON.parse(
    fs
      .readFileSync(path.join(projectPath, "project", "geoprocessing.json"))
      .toString(),
  );

  if (
    !geoprocessing.preprocessingFunctions &&
    !geoprocessing.geoprocessingFunctions
  ) {
    throw new Error("No functions found in geoprocessing.json");
  }

  if (process.env.NODE_ENV !== "test")
    console.log("Found report clients in geoprocessing.json:");

  const reportClients = geoprocessing.clients.reduce(
    (clientSoFar, curClient) => {
      return { [curClient.name]: curClient.source, ...clientSoFar };
    },
    {},
  );
  if (process.env.NODE_ENV !== "test")
    for (const clientPath of Object.values(reportClients))
      console.log(clientPath);

  // Generate top-level ReportApp.tsx with dynamic import of report clients

  const clientImportStr = geoprocessing.clients
    .map(
      (c) => `
  reportClients["${c.name}"] = React.lazy(
    () => import(/* @vite-ignore */"../${c.source}")
  );
  `,
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
  `,
  );

  // Create top-level index.html that loads report client

  if (process.env.NODE_ENV !== "test") console.log("Generating index.html");
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
  `,
  );

  const minify = process.env.NOMINIFY ? false : true;

  await build({
    root: destBuildPath,
    base: "/",
    plugins: [react(), nodePolyfills()],
    publicDir: path.join(projectPath, "src", "assets"),
    logLevel: process.env.NODE_ENV === "test" ? "error" : "info",
    // add inline image
    build: {
      sourcemap: true,
      minify,
      outDir: path.join(destBuildPath, "dist"),
      emptyOutDir: false,
    },
  });
}
