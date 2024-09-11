import {
  GeoprocessingProject,
  GeoprocessingServiceMetadata,
  PreprocessingServiceMetadata,
} from "../src/types/index.js";
import { hasOwnProperty, VectorDataSourceDetails } from "../src/index.js";

/**
 * Select metadata of GeoprocessingBundle for manifest
 */
export interface GeoprocessingFunctionMetadata
  extends Omit<
    GeoprocessingServiceMetadata,
    "restrictedAccess" | "uri" | "endpoint"
  > {
  handlerFilename: string;
  purpose: "geoprocessing" | "preprocessing";
  vectorDataSources: VectorDataSourceDetails[];
  uri?: string; // Add back to override as optional.  Type smell
  endpoint?: string; // Add back to override as optional.  Type smell
}

/**
 * Select metadata of PreprocessingBundle for manifest
 */
export interface PreprocessingFunctionMetadata
  extends Omit<
    PreprocessingServiceMetadata,
    "restrictedAccess" | "uri" | "endpoint"
  > {
  handlerFilename: string;
  purpose: "geoprocessing" | "preprocessing";
  uri?: string; // Add back to override as optional.  Type smell
  endpoint?: string; // Add back to override as optional.  Type smell
}

export type ProcessingFunctionMetadata =
  | PreprocessingFunctionMetadata
  | GeoprocessingFunctionMetadata;

export type SyncFunctionMetadata = ProcessingFunctionMetadata;
export type AsyncFunctionMetadata = GeoprocessingFunctionMetadata;

export interface Manifest extends GeoprocessingProject {
  preprocessingFunctions: PreprocessingFunctionMetadata[];
  geoprocessingFunctions: GeoprocessingFunctionMetadata[];
  region: string;
  version: string;
}

//// Helpers ////

/** Returns true if manifest contains clients */
export const hasClients = (manifest: Manifest): boolean => {
  return manifest.clients.length > 0;
};

export const getSyncFunctionMetadata = (
  manifest: Manifest,
): ProcessingFunctionMetadata[] => {
  return [
    ...manifest.preprocessingFunctions,
    ...manifest.geoprocessingFunctions.filter(
      (func) => func.executionMode === "sync",
    ),
  ];
};

export const getAsyncFunctionMetadata = (
  manifest: Manifest,
): GeoprocessingFunctionMetadata[] => {
  return manifest.geoprocessingFunctions.filter(
    (func) =>
      func.executionMode === "async" && func.purpose !== "preprocessing",
  );
};

//// Validators ////

/** Returns true if metadata is for geoprocessing function and narrows type */
export const isGeoprocessingFunctionMetadata = (
  meta: any,
): meta is GeoprocessingFunctionMetadata => {
  return (
    meta &&
    hasOwnProperty(meta, "purpose") &&
    meta.purpose === "geoprocessing" &&
    hasOwnProperty(meta, "executionMode") &&
    (meta.executionMode === "async" || meta.executionMode === "sync")
  );
};

/** Returns true if metadata is for preprocessing function and narrows type */
export const isPreprocessingFunctionMetadata = (
  meta: any,
): meta is PreprocessingFunctionMetadata => {
  return (
    meta &&
    hasOwnProperty(meta, "purpose") &&
    meta.purpose === "preprocessing" &&
    !hasOwnProperty(meta, "executionMode")
  );
};

/** Returns true if metadata is for sync function and narrows type */
export const isSyncFunctionMetadata = (
  meta: any,
): meta is SyncFunctionMetadata => {
  return (
    isPreprocessingFunctionMetadata(meta) ||
    (isGeoprocessingFunctionMetadata(meta) && meta.executionMode === "sync")
  );
};

/** Returns true if metadata is for async function and narrows type */
export const isAsyncFunctionMetadata = (
  meta: any,
): meta is AsyncFunctionMetadata => {
  return (
    isGeoprocessingFunctionMetadata(meta) && meta.executionMode === "async"
  );
};
