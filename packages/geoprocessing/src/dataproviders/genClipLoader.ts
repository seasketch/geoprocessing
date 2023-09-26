import bbox from "@turf/bbox";
import { Feature, MultiPolygon, Polygon } from "../types";
import {
  isExternalVectorDatasource,
  isInternalVectorDatasource,
} from "../datasources";
import { isPolygonFeatureArray } from "../helpers";
import { ProjectClientInterface } from "../project";
import { getFeatures } from "./getFeatures";
import { DatasourceClipOperation } from "../types/dataProcessor";

/**
 * Given a project client and 1 or more clip operations, returns a function that when called
 * loads clip features from their datasources that overlap with the feature polygon to clip.
 * Pass this function to genPreprocessor() and it will take care of the rest.
 */
export const genClipLoader = <P extends ProjectClientInterface>(
  project: P,
  operations: DatasourceClipOperation[]
) => {
  return (feature: Feature<Polygon | MultiPolygon>) => {
    return Promise.all(
      operations.map(async (o) => {
        const ds = project.getDatasourceById(o.datasourceId);
        if (
          !isInternalVectorDatasource(ds) &&
          !isExternalVectorDatasource(ds)
        ) {
          throw new Error(`Expected vector datasource for ${ds.datasourceId}`);
        }

        const url = project.getDatasourceUrl(ds);

        const featureBox = bbox(feature);
        const clipFeatures = await getFeatures(ds, url, {
          ...o.options,
          bbox: featureBox,
        });
        if (!isPolygonFeatureArray(clipFeatures)) {
          throw new Error("Expected array of Polygon features");
        }
        return {
          clipFeatures,
          operation: o.operation,
        };
      })
    );
  };
};
