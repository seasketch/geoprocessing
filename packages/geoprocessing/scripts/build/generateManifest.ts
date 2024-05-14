import { Manifest } from "../manifest.js";
import { PreprocessingBundle, GeoprocessingBundle } from "../types.js";
import { GeoprocessingJsonConfig } from "../../src/types/index.js";
import slugify from "../../src/util/slugify.js"
import { Package } from "../../src/types/index.js";

/**
 * Compiles project assets into a single Manifest
 */
export function generateManifest(
  config: GeoprocessingJsonConfig,
  projectPkg: Package,
  preprocessingBundles: PreprocessingBundle[],
  geoprocessingBundles: GeoprocessingBundle[],
  version: string
): Manifest {
  const manifest: Manifest = {
    title: slugify(
      projectPkg.name.replace(/@/g, "").replace("gp-", "").replace("/", "-")
    ),
    author: slugify(config.author.replace(/\<.*\>/, "")),
    region: config.region,
    apiVersion: version,
    version: projectPkg.version,
    relatedUri: projectPkg.homepage,
    sourceUri: projectPkg.repository ? projectPkg.repository.url : undefined,
    published: new Date().toISOString(),
    clients: config.clients.map((c) => ({
      title: c.name,
      uri: `https://test.com/${c.name}`,
      bundleSize: 0,
      apiVersion: "",
      tabs: [],
    })),
    feedbackClients: [],
    preprocessingFunctions: [],
    geoprocessingFunctions: [],
    preprocessingServices: [],
    geoprocessingServices: [],
    uri: "",
  };

  if (preprocessingBundles) {
    manifest.preprocessingFunctions = preprocessingBundles.map((bundle) => ({
      purpose: "preprocessing",
      ...bundle.options,
      handlerFilename: bundle.handlerFilename,
      vectorDataSources: bundle.sources,
      rateLimited: false,
      rateLimit: 0,
      rateLimitPeriod: "daily" as const,
      rateLimitConsumed: 0,
      medianDuration: 0,
      medianCost: 0,
      type: "javascript" as const,
      issAllowList: ["*"],
    }));
  }

  if (manifest.geoprocessingFunctions) {
    manifest.geoprocessingFunctions = geoprocessingBundles.map((bundle) => ({
      purpose: "geoprocessing",
      ...bundle.options,
      handlerFilename: bundle.handlerFilename,
      vectorDataSources: bundle.sources,
      rateLimited: false,
      rateLimit: 0,
      rateLimitPeriod: "daily" as const,
      rateLimitConsumed: 0,
      medianDuration: 0,
      medianCost: 0,
      type: "javascript" as const,
      issAllowList: ["*"],
    }));
  }

  return manifest;
}
