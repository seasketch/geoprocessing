import { Manifest } from "../manifest";
import {
  Package,
  PreprocessingHandlerModule,
  GeoprocessingHandlerModule,
} from "../types";
import { GeoprocessingJsonConfig } from "../../src/types";

/**
 * Inspects project at projectPath and returns a Manifest
 */
export function generateManifest(
  config: GeoprocessingJsonConfig,
  projectPkg: Package,
  preprocessingHandlers: PreprocessingHandlerModule[],
  geoprocessingHandlers: GeoprocessingHandlerModule[],
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

  manifest.preprocessingFunctions = preprocessingHandlers.map((handler) => ({
    purpose: "preprocessing",
    ...handler.options,
    vectorDataSources: handler.sources,
    rateLimited: false,
    rateLimit: 0,
    rateLimitPeriod: "daily" as const,
    rateLimitConsumed: 0,
    medianDuration: 0,
    medianCost: 0,
    type: "javascript" as const,
    issAllowList: ["*"],
  }));

  manifest.geoprocessingFunctions = geoprocessingHandlers.map((handler) => ({
    purpose: "geoprocessing",
    ...handler.options,
    vectorDataSources: handler.sources,
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
