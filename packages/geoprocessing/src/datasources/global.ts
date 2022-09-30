import {
  Feature,
  Polygon,
  Geometry,
  GeometryCollection,
  Properties,
} from "../types";
import { Datasources } from "../types";
import { VectorDataSource } from "./VectorDataSource";
import { getExternalVectorDatasourceById } from "./helpers";

export type OsmLandFeature = Feature<Polygon, { gid: number }>;
export type EezLandUnion = Feature<Polygon, { gid: number; UNION: string }>;

/** Given datasourceId, returns an instantiated VectorDatasource object for it.  Throws Error if datasource does not exist
 * It is up to the caller to pass the specific <Feature> type this datasource contains
 * and to ensure that this datasource has a published VectorDatasource
 */
export function getGlobalVectorDatasourceById<
  T extends Feature<Geometry | GeometryCollection, Properties>
>(datasourceId: string, datasources: Datasources): VectorDataSource<T> {
  switch (datasourceId) {
    case "global-clipping-osm-land":
      return new VectorDataSource<T>(
        getExternalVectorDatasourceById(
          "global-clipping-osm-land",
          datasources
        ).url
      );
    case "global-clipping-eez-land-union":
      return new VectorDataSource<T>(
        getExternalVectorDatasourceById(
          "global-clipping-eez-land-union",
          datasources
        ).url
      );
    default:
      throw new Error(`Global datasource ${datasourceId} not found`);
  }
}

export const getLandVectorDatasource = (
  datasources: Datasources
): VectorDataSource<OsmLandFeature> => {
  return new VectorDataSource<OsmLandFeature>(
    getExternalVectorDatasourceById("global-clipping-osm-land", datasources).url
  );
};

export const getEezVectorDatasource = (datasources: Datasources) => {
  return new VectorDataSource<EezLandUnion>(
    getExternalVectorDatasourceById(
      "global-clipping-eez-land-union",
      datasources
    ).url
  );
};
