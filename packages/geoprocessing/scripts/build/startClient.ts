import fs from "fs-extra";
import path from "path";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import { Package } from "../../src/types/index.js";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

if (!process.env.PROJECT_PATH) throw new Error("Missing PROJECT_PATH");

const PROJECT_PATH = process.env.PROJECT_PATH || "UNDEFINED";
const destBuildPath = path.join(PROJECT_PATH, ".build-web");

const geoprocessing: GeoprocessingJsonConfig = JSON.parse(
  fs
    .readFileSync(path.join(PROJECT_PATH, "project", "geoprocessing.json"))
    .toString(),
);

const packageGp: Package = JSON.parse(
  fs.readFileSync("./package.json").toString(),
);

const packageProject: Package = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString(),
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
`,
);

const minify = process.env.NOMINIFY ? false : true;

const server = await createServer({
  // any valid user config options, plus `mode` and `configFile`
  root: destBuildPath,
  plugins: [react(), nodePolyfills()],
  publicDir: path.join(PROJECT_PATH, "src", "assets"),
  server: {
    port: 8080,
    open: true,
  },
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
