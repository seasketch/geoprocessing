import {
  GeoprocessingProject,
  GeoprocessingServiceMetadata,
  PreprocessingServiceMetadata,
} from "../src/types";
import { VectorDataSourceDetails } from "../src";
import { getHandlerFilenameFromSrcPath } from "./util/handler";

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

/** Returns true if metadata is for geoprocessing function and narrows type */
export const isGeoprocessingFunctionMetadata = (
  meta: any
): meta is GeoprocessingFunctionMetadata => {
  return (
    meta &&
    meta.hasOwnProperty("purpose") &&
    meta.hasOwnProperty.purpose === "geoprocessing" &&
    meta.hasOwnProperty("executionMode") &&
    (meta.executionMode === "async" || meta.executionmode === "sync")
  );
};

/** Returns true if metadata is for preprocessing function and narrows type */
export const isPreprocessingFunctionMetadata = (
  meta: any
): meta is PreprocessingFunctionMetadata => {
  return (
    meta &&
    meta.hasOwnProperty("purpose") &&
    meta.hasOwnProperty.purpose === "preprocessing" &&
    !meta.hasOwnProperty("executionMode")
  );
};

/** Returns true if metadata is for sync function and narrows type */
export const isSyncFunctionMetadata = (
  meta: any
): meta is SyncFunctionMetadata => {
  return (
    isPreprocessingFunctionMetadata(meta) ||
    (isGeoprocessingFunctionMetadata(meta) && meta.executionMode === "sync")
  );
};

/** Returns true if metadata is for async function and narrows type */
export const isAsyncFunctionMetadata = (
  meta: any
): meta is AsyncFunctionMetadata => {
  return (
    isGeoprocessingFunctionMetadata(meta) && meta.executionMode === "async"
  );
};
