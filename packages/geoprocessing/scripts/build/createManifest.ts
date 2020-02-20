import fs from "fs";
import path from "path";
import { GeoprocessingServiceMetadata } from "../../src/types";
import mock from "mock-require";

mock("aws-sdk", {
  DynamoDB: {
    DocumentClient: function() {}
  },
  Lambda: function() {}
});

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
  clients: [],
  feebackClients: [],
  functions: [] as GeoprocessingServiceMetadata[]
};

if (config.functions.length < 1) {
  throw new Error("No functions specified in geoprocessing.json");
}

// console.log(config.functions);
for (const func of config.functions as string[]) {
  const name = path.basename(func).replace(".ts", ".js");
  const opts = require(path.join(PROJECT_PATH, ".build", name)).options;
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
    issAllowList: ["*"]
  });
}

fs.writeFileSync(
  path.join(PROJECT_PATH, ".build", "manifest.json"),
  JSON.stringify(projectMetadata, null, "  ")
);
