import {
  Polygon,
  Geography,
  featuresSchema,
  VectorDatasource,
} from "../../../src/types";
import {
  FeatureCollection,
  MultiPolygon,
  isExternalVectorDatasource,
  isInternalVectorDatasource,
} from "../../../src";
import { featureCollection } from "@turf/helpers";
import truncate from "@turf/truncate";
import { readDatasourceGeojsonById } from "../datasources";
import { getFeatures } from "../../../src/dataproviders";

/**
 * Given geography and its datasource, returns geography features with additional filter options
 */
export async function getGeographyFeatures(
  geography: Geography,
  /** Geography datasource */
  datasource: VectorDatasource,
  dstPath: string
): Promise<FeatureCollection<Polygon | MultiPolygon>> {
  if (isInternalVectorDatasource(datasource)) {
    // Read local datasource
    return truncate(
      readDatasourceGeojsonById(geography.datasourceId, dstPath),
      { mutate: true }
    );
  } else if (isExternalVectorDatasource(datasource)) {
    // Fetch external datasource
    if (!geography.bboxFilter)
      throw new Error("Missing geography bboxFilter for external datasource");
    if (!geography.propertyFilter)
      throw new Error(
        "Missing geography propertyFilter for external datasource"
      );
    const feats = await getFeatures(datasource, datasource.url, {
      bbox: geography.bboxFilter,
      propertyFilter: geography.propertyFilter,
    });
    // Make sure only contains polygon or multipolygon in array
    const validFeats = featuresSchema.parse(feats);
    return truncate(featureCollection(validFeats), { mutate: true });
  } else {
    return featureCollection([]);
  }
}
