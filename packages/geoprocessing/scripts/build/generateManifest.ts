import { Manifest } from "../manifest";
import { Package, PreprocessingBundle, GeoprocessingBundle } from "../types";
import { GeoprocessingJsonConfig } from "../../src/types";

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
    title: projectPkg.name,
    author: config.author,
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

  return manifest;
}
