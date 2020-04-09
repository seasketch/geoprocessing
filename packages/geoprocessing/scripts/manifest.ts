import {
  GeoprocessingProject,
  GeoprocessingServiceMetadata,
  PreprocessingService,
} from "../src/types";

export interface FunctionMetadata extends GeoprocessingServiceMetadata {
  purpose: "geoprocessing" | "preprocessing";
}

export interface Manifest extends GeoprocessingProject {
  functions: FunctionMetadata[];
  region: string;
}
