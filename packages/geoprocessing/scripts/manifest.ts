import {
  GeoprocessingProject,
  GeoprocessingServiceMetadata
} from "../src/types";

export interface Manifest extends GeoprocessingProject {
  functions: GeoprocessingServiceMetadata[];
  region: string;
}
