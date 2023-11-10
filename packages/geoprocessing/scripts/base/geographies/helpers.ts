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
    let featureColl = truncate(
      readDatasourceGeojsonById(geography.datasourceId, dstPath),
      { mutate: true }
    );
    if (geography.propertyFilter) {
      featureColl = featureCollection(
        featureColl.features.filter((curFeat) => {
          if (!curFeat.properties) return false;
          return geography.propertyFilter?.values.includes(
            curFeat.properties[geography.propertyFilter.property]
          );
        })
      );
    }
    return featureColl;
  } else if (isExternalVectorDatasource(datasource)) {
    // Fetch external datasource
    const feats = await getFeatures(datasource, datasource.url, {
      bbox: geography.bboxFilter,
      propertyFilter: geography.propertyFilter,
    });
    // Make sure only contains polygon or multipolygon in array
    const validFeats = featuresSchema.parse(feats);
    return truncate(featureCollection(validFeats), { mutate: true });
  }

  return featureCollection([]);
}
