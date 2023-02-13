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
import { DatasourceClipOperation } from "../types/dataProcessor";

/**
 * Returns features for a variety of vector datasources and formats, with additional filter options
 * Currently only supports internal flatgeobuf and external subdivided datasources
 */
export async function getFeatures(
  datasource: InternalVectorDatasource | ExternalVectorDatasource,
  /** url of datasource */
  url: string,
  options: DatasourceClipOperation["options"] = {}
): Promise<Feature[]> {
  let features: Feature[] = [];
  if (isInternalVectorDatasource(datasource)) {
    // internal
    features = await fgbFetchAll<Feature>(url, options.bbox);
  } else if (isExternalVectorDatasource(datasource)) {
    // external
    if (!options.bbox) {
      throw new Error(
        `bbox option expected for ExternalVectorDatasource ${datasource.datasourceId}`
      );
    }
    const vectorDs = new VectorDataSource(url);

    // union subdivided polygons
    if (datasource.formats.includes("subdivided")) {
      if (options.unionProperty) {
        features = (
          await vectorDs.fetchUnion(options.bbox, options.unionProperty)
        ).features;
      } else {
        features = await vectorDs.fetch(options.bbox);
      }
    } else {
      throw new Error("Only external subdivided datasources supported");
    }
  }

  // filter by property value
  if (options.propertyFilter) {
    features = features.filter((curFeat) => {
      if (!curFeat.properties) return false;
      return options.propertyFilter?.values.includes(
        curFeat.properties[options.propertyFilter.property]
      );
    });
  }

  return features;
}
