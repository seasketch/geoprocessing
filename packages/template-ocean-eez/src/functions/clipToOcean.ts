import {
  PreprocessingHandler,
  Feature,
  Sketch,
  clipToPolygonFeatures,
  FeatureClipOperation,
  VectorDataSource,
  ensureValidPolygon,
} from "@seasketch/geoprocessing";
import { bbox } from "@turf/turf";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land). If results in multiple polygons then returns the largest.
 */
export async function clipToOcean(feature: Feature | Sketch): Promise<Feature> {
  // throws if not valid with specific message
  ensureValidPolygon(feature, {
    minSize: 1,
    enforceMinSize: false,
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
  });

  // Get land polygons - osm land vector datasource
  const landDatasource = new VectorDataSource(
    "https://d3p1dsef9f0gjr.cloudfront.net/",
  );
  const featureBox = bbox(feature);
  // one gid assigned per country, use to union subdivided pieces back together on fetch, prevents slivers
  const landFC = await landDatasource.fetchUnion(featureBox, "gid");

  const eraseLand: FeatureClipOperation = {
    operation: "difference",
    clipFeatures: landFC.features,
  };

  // Execute one or more clip operations in order against feature
  return clipToPolygonFeatures(feature, [eraseLand], {
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToOcean, {
  title: "clipToOcean",
  description: "Clips feature or sketch to ocean, removing land",
  timeout: 40,
  memory: 1024,
});
