import fs from "fs";
import path from "path";
import {
  GeoprocessingServiceMetadata,
  PreprocessingService,
} from "../../src/types";

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
  clients: config.clients,
  feedbackClients: [],
  functions: [] as GeoprocessingServiceMetadata[],
  preprocessingFunctions: [] as PreprocessingService[],
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
  let metadata = {
    handler: name,
    ...opts,
    vectorDataSources: handler.sources,
    purpose:
      handler.options.executionMode !== undefined
        ? "geoprocessing"
        : "preprocessing",
  };
  if (handler.options.executionMode !== undefined) {
    metadata = {
      ...metadata,
      rateLimited: false,
      rateLimit: 0,
      rateLimitPeriod: "daily",
      rateLimitConsumed: 0,
      medianDuration: 0,
      medianCost: 0,
      type: "javascript",
      issAllowList: ["*"],
    };
  }
  projectMetadata.functions.push(metadata);
}

// TODO: Tell authors something useful about VectorDataSources at deploy time

fs.writeFileSync(
  path.join(".build", "manifest.json"),
  JSON.stringify(projectMetadata, null, "  ")
);
