import {
  GeoprocessingProject,
  GeoprocessingServiceMetadata,
  PreprocessingServiceMetadata,
} from "../src/types";
import { VectorDataSourceDetails } from "../src/VectorDataSource";
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

export interface Manifest extends GeoprocessingProject {
  preprocessingFunctions: PreprocessingFunctionMetadata[];
  geoprocessingFunctions: GeoprocessingFunctionMetadata[];
  region: string;
  version: string;
}

export function getHandlerFilename(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename.replace(/\.js$/, "")}.handler`;
}
