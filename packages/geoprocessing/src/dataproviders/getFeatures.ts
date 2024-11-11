import {
  isExternalVectorDatasource,
  isInternalVectorDatasource,
  VectorDataSource,
} from "../datasources/index.js";
import { loadFgb } from "./flatgeobuf.js";
import {
  ExternalVectorDatasource,
  InternalVectorDatasource,
  Feature,
  Geometry,
  VectorDatasource,
} from "../types/index.js";
import { DatasourceOptions } from "../types/dataProcessor.js";

/**
 * Returns features for a variety of vector datasources and formats, with additional filter options
 */
export async function getFeatures<F extends Feature<Geometry>>(
  datasource:
    | InternalVectorDatasource
    | ExternalVectorDatasource
    | VectorDatasource,
  /** url of datasource */
  url: string,
  options: DatasourceOptions = {},
): Promise<F[]> {
  const propertyFilter = datasource.propertyFilter || options.propertyFilter;
  const bboxFilter = datasource.bboxFilter || options.bbox;

  let features: F[] = [];
  if (isInternalVectorDatasource(datasource)) {
    features = await loadFgb<F>(url, bboxFilter);
  } else if (
    isExternalVectorDatasource(datasource) &&
    datasource.formats &&
    datasource.formats.includes("subdivided")
  ) {
    // prefer subdivided if external
    if (!bboxFilter) {
      throw new Error(
        `bbox option expected for ExternalVectorDatasource ${datasource.datasourceId}`,
      );
    }
    const vectorDs = new VectorDataSource(url);
    if (options.unionProperty) {
      const fc = await vectorDs.fetchUnion(bboxFilter, options.unionProperty);
      features = fc.features as F[];
    } else {
      features = (await vectorDs.fetch(bboxFilter)) as F[];
    }
  } else if (
    isExternalVectorDatasource(datasource) &&
    datasource.formats &&
    datasource.formats.includes("fgb")
  ) {
    // fallback to flatgeobuf
    features = await loadFgb<F>(url, bboxFilter);
  }

  // filter by property value
  if (propertyFilter) {
    features = features.filter((curFeat) => {
      if (!curFeat.properties) return false;
      return propertyFilter?.values.includes(
        curFeat.properties[propertyFilter.property],
      );
    });
  }

  return features;
}
