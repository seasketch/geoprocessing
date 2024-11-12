import {
  PreprocessingHandler,
  Feature,
  Sketch,
  isPolygonFeature,
  ValidationError,
  VectorDataSource,
  FeatureClipOperation,
  clipToPolygonFeatures,
} from "@seasketch/geoprocessing";
import { bbox } from "@turf/turf";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is on land.
 */
export async function clipToLand(feature: Feature | Sketch): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  const featureBox = bbox(feature);

  // Get land polygons - osm land vector datasource
  const landDatasource = new VectorDataSource(
    "https://d3p1dsef9f0gjr.cloudfront.net/",
  );
  // one gid assigned per country, use to union subdivided pieces back together on fetch, prevents slivers
  const landFC = await landDatasource.fetchUnion(featureBox, "gid");

  const keepLand: FeatureClipOperation = {
    operation: "intersection",
    clipFeatures: landFC.features,
  };

  return clipToPolygonFeatures(feature, [keepLand], {
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToLand, {
  title: "clipToLand",
  description: "Clips portion of feature or sketch not overlapping land",
  timeout: 40,
  memory: 4096,
});
