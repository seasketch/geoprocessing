import bbox from "@turf/bbox";
import { Feature, MultiPolygon, Polygon } from "geojson";
import {
  getFlatGeobufFilename,
  isExternalVectorDatasource,
  isInternalVectorDatasource,
} from "../datasources";
import { isPolygonFeatureArray } from "../helpers";
import { ProjectClientBase } from "../project";
import { ClipOperation, ClipOperations } from "../toolbox";
import { getFeatures } from "./getFeatures";

export interface DatasourceClipOperation {
  datasourceId: string;
  operation: ClipOperations;
}

/**
 * Given feature to clip and parameters for clip operations using datasources, this function
 * fetches the features for each operation and returns a ClipOperation array
 */
export const prepClipOperations = (
  project: ProjectClientBase,
  feature: Feature<Polygon | MultiPolygon>,
  operations: DatasourceClipOperation[]
): Promise<ClipOperation[]> => {
  return Promise.all(
    operations.map(async (o) => {
      const ds = project.getDatasourceById(o.datasourceId);
      if (!isInternalVectorDatasource(ds) && !isExternalVectorDatasource(ds)) {
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
