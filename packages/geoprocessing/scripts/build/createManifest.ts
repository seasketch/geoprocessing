import fs from "fs";
import path from "path";
import { GeoprocessingServiceMetadata } from "../../src/types";
import mock from "mock-require";
import * as stuff from "../../src/index";
import {
  DEFAULTS as VectorDataSourceDefaults,
  VectorDataSourceOptions
} from "../../src/VectorDataSource";

mock("aws-sdk", {
  DynamoDB: {
    DocumentClient: function() {}
  },
  Lambda: function() {}
});

let VectorDataSources: VectorDataSourceMock[] = [];

class VectorDataSourceMock {
  url: string;
  options: VectorDataSourceOptions;

  constructor(url: string, options: {}) {
    this.url = url;
    this.options = { ...VectorDataSourceDefaults, ...options };
    VectorDataSources.push(this);
  }
}

mock("@seasketch/geoprocessing", {
  ...stuff,
  VectorDataSource: VectorDataSourceMock
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
  clients: config.clients,
  feebackClients: [],
  functions: [] as GeoprocessingServiceMetadata[]
};

if (config.functions.length < 1) {
  throw new Error("No functions specified in geoprocessing.json");
}

for (const func of config.functions as string[]) {
  const name = path.basename(func).replace(".ts", ".js");
  VectorDataSources = [];

  const handler = require(path.join(PROJECT_PATH, func));
  const opts = handler.default.options;
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
    vectorDataSources: VectorDataSources.map(v => ({
      url: v.url,
      options: v.options
    }))
  });
}

// TODO: Tell authors something useful about VectorDataSources at deploy time

fs.writeFileSync(
  path.join(PROJECT_PATH, ".build", "manifest.json"),
  JSON.stringify(projectMetadata, null, "  ")
);
