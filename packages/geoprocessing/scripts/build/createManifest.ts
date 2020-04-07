import fs from "fs";
import path from "path";
import { GeoprocessingServiceMetadata } from "../../src/types";

const PROJECT_PATH = process.env.PROJECT_PATH!;
const config = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "geoprocessing.json")).toString()
);
const pkgGeo = JSON.parse(fs.readFileSync("./package.json").toString());
const projectPkg = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, "package.json")).toString()
);

const projectMetadata = {
  title: projectPkg.name,
  author: config.author,
  region: config.region,
  apiVersion: pkgGeo.version,
  version: projectPkg.version,
  relatedUri: projectPkg.homepage,
  sourceUri: projectPkg.repository ? projectPkg.repository.url : null,
  published: new Date().toISOString(),
  preprocessingServices: [],
  clients: config.clients,
  feebackClients: [],
  functions: [] as GeoprocessingServiceMetadata[]
};

if (config.functions.length < 1) {
  throw new Error("No functions specified in geoprocessing.json");
}

for (const func of config.functions as string[]) {
  let name = path.basename(func);
  const parts = name.split(".");
  name = parts.slice(0, -1).join(".") + "Handler.js";

  const p = path.join("../../../", ".build/", name.replace(".js", ""));
  const handler = require(p);
  const opts = handler.options;
  projectMetadata.functions.push({
    handler: name,
    ...opts,
    rateLimited: false,
    rateLimit: 0,
    rateLimitPeriod: "daily",
    rateLimitConsumed: 0,
    medianDuration: 0,
    medianCost: 0,
    type: "javascript",
    issAllowList: ["*"],
    // @ts-ignore
    vectorDataSources: handler.sources
  });
}

// TODO: Tell authors something useful about VectorDataSources at deploy time

fs.writeFileSync(
  path.join(".build", "manifest.json"),
  JSON.stringify(projectMetadata, null, "  ")
);
