import { Feature, BBox } from "geojson";
import { isInternalVectorDatasource, VectorDataSource } from "../datasources";
import { fgbFetchAll } from "./flatgeobuf";
import { ExternalVectorDatasource, InternalVectorDatasource } from "../types";

interface VectorPropertyFilter {
  property: string;
  values: (string | number)[];
}

/**
 * Returns features for a variety of datasources, with additional filter options
 */
export async function getFeatures(
  datasource: InternalVectorDatasource | ExternalVectorDatasource,
  url: string,
  options: {
    bbox?: BBox;
    /** Filters features to those having one or more properties with one or more specific values. */
    propertyFilters: VectorPropertyFilter[];
    /** Used for subdivided datasources to rebuild features again */
    unionProperty: string;
  }
): Promise<Feature[]> {
  let features: Feature[];
  if (isInternalVectorDatasource(datasource)) {
    console.log("url", url);
    features = await fgbFetchAll<Feature>(url, options.bbox);
  } else {
    throw new Error(
      `Expected vector datasource for ${datasource.datasourceId}`
    );
  }
  return features;
}
