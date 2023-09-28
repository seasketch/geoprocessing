import {
  isExternalVectorDatasource,
  isInternalVectorDatasource,
  VectorDataSource,
} from "../datasources";
import { fgbFetchAll } from "./flatgeobuf";
import {
  ExternalVectorDatasource,
  InternalVectorDatasource,
  Feature,
} from "../types";
import { DatasourceOptions } from "../types/dataProcessor";

/**
 * Returns features for a variety of vector datasources and formats, with additional filter options
 */
export async function getFeatures(
  datasource: InternalVectorDatasource | ExternalVectorDatasource,
  /** url of datasource */
  url: string,
  options: DatasourceOptions = {}
): Promise<Feature[]> {
  const propertyFilter = datasource.propertyFilter || options.propertyFilter;
  const bboxFilter = datasource.bboxFilter || options.bbox;

  let features: Feature[] = [];
  if (isInternalVectorDatasource(datasource)) {
    features = await fgbFetchAll<Feature>(url, bboxFilter);
  } else if (
    isExternalVectorDatasource(datasource) &&
    datasource.formats.includes("subdivided")
  ) {
    // prefer subdivided if external
    if (!bboxFilter) {
      throw new Error(
        `bbox option expected for ExternalVectorDatasource ${datasource.datasourceId}`
      );
    }
    const vectorDs = new VectorDataSource(url);
    if (options.unionProperty) {
      features = (await vectorDs.fetchUnion(bboxFilter, options.unionProperty))
        .features;
    } else {
      features = await vectorDs.fetch(bboxFilter);
    }
  } else if (
    isExternalVectorDatasource(datasource) &&
    datasource.formats.includes("fgb")
  ) {
    // fallback to flatgeobuf
    features = await fgbFetchAll<Feature>(url, bboxFilter);
  }

  // filter by property value
  if (propertyFilter) {
    features = features.filter((curFeat) => {
      if (!curFeat.properties) return false;
      return propertyFilter?.values.includes(
        curFeat.properties[propertyFilter.property]
      );
    });
  }

  return features;
}
