import {
  GeoprocessingProject,
  GeoprocessingServiceMetadata,
  PreprocessingServiceMetadata,
  PreprocessingService,
} from "../src/types";
import { VectorDataSourceDetails } from "../src/VectorDataSource";

export interface GeoprocessingFunctionMetadata
  extends Omit<
    GeoprocessingServiceMetadata,
    "restrictedAccess" | "uri" | "endpoint"
  > {
  purpose: "geoprocessing" | "preprocessing";
  vectorDataSources: VectorDataSourceDetails[];
  uri?: string; // Add back to override as optional.  Type smell
  endpoint?: string; // Add back to override as optional.  Type smell
}

export interface PreprocessingFunctionMetadata
  extends Omit<
    PreprocessingServiceMetadata,
    "restrictedAccess" | "uri" | "endpoint"
  > {
  purpose: "geoprocessing" | "preprocessing";
  uri?: string; // Add back to override as optional.  Type smell
  endpoint?: string; // Add back to override as optional.  Type smell
}

export interface Manifest extends GeoprocessingProject {
  preprocessingFunctions: PreprocessingFunctionMetadata[];
  geoprocessingFunctions: GeoprocessingFunctionMetadata[];
  region: string;
  version: string;
}
