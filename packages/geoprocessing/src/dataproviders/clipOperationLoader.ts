import bbox from "@turf/bbox";
import { Feature, MultiPolygon, Polygon } from "../types";
import {
  getFlatGeobufFilename,
  isExternalVectorDatasource,
  isInternalVectorDatasource,
} from "../datasources";
import { isPolygonFeatureArray } from "../helpers";
import { ProjectClientInterface } from "../project";
import { DatasourceClipOperation } from "../toolbox";
import { getFeatures } from "./getFeatures";

/**
 * Given DatasourceClipOperation's
 * returns a function that given a feature to clip, fetches the features for
 * each datasource that overlap with the bbox of the input feature, and returns
 * fully prepared FeatureClipOperation objects
 */
export const genClipOperationLoader = <P extends ProjectClientInterface>(
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

        const url = (() => {
          if (isInternalVectorDatasource(ds)) {
            return `${project.dataBucketUrl()}${getFlatGeobufFilename(ds)}`;
          }
          return ds.url;
        })();

        const featureBox = bbox(feature);
        const clipFeatures = await getFeatures(ds, url, { bbox: featureBox });
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
