import {
  PreprocessingHandler,
  Feature,
  Sketch,
  ensureValidPolygon,
  FeatureClipOperation,
  VectorDataSource,
  clipToPolygonFeatures,
} from "@seasketch/geoprocessing";
import { bbox } from "@turf/turf";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land) and within one or more EEZ boundaries.
 */
export async function clipToOceanEez(
  feature: Feature | Sketch,
): Promise<Feature> {
  // throws if not valid with specific message
  ensureValidPolygon(feature, {
    minSize: 1,
    enforceMinSize: false,
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
  });

  const featureBox = bbox(feature);

  // Erase portion of sketch over land

  const landDatasource = new VectorDataSource(
    "https://d3p1dsef9f0gjr.cloudfront.net/",
  );
  const landFC = await landDatasource.fetchUnion(featureBox, "gid");
  const eraseLand: FeatureClipOperation = {
    operation: "difference",
    clipFeatures: landFC.features,
  };

  // Keep portion of sketch within EEZ

  const eezDatasource = new VectorDataSource(
    "https://d3muy0hbwp5qkl.cloudfront.net",
  );
  const eezFC = await eezDatasource.fetchUnion(featureBox, "UNION");
  // Optionally filter to single EEZ polygon by UNION name
  const keepInsideEez: FeatureClipOperation = {
    operation: "intersection",
    clipFeatures: eezFC.features,
  };

  return clipToPolygonFeatures(feature, [eraseLand, keepInsideEez], {
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 1024,
});
