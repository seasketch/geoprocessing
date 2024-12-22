import {
  PreprocessingHandler,
  Feature,
  Sketch,
  ensureValidPolygon,
  Polygon,
  MultiPolygon,
  loadFgb,
  isPolygonFeature,
  ValidationError,
  clip,
  biggestPolygon,
} from "@seasketch/geoprocessing";
import { area, bbox, featureCollection } from "@turf/turf";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land). If results in multiple polygons then returns the largest.
 */
export async function clipToOcean(feature: Feature | Sketch): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  // throws if not valid with specific message
  ensureValidPolygon(feature, {
    minSize: 1,
    enforceMinSize: false,
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
  });

  const featureBox = bbox(feature);

  // Get land polygons - daylight osm land vector datasource
  const landFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-coastline-daylight-v158.fgb",
    featureBox,
  );

  // Erase portion of sketch over land

  let clipped: Feature<Polygon | MultiPolygon> | null = feature;
  if (clipped !== null && landFeatures.length > 0) {
    clipped = clip(featureCollection([clipped, ...landFeatures]), "difference");
  }

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Feature is not in the ocean");
  }

  // Assume user wants the largest polygon if multiple remain
  return biggestPolygon(clipped);
}

export default new PreprocessingHandler(clipToOcean, {
  title: "clipToOcean",
  description: "Clips feature or sketch to ocean, removing land",
  timeout: 40,
  memory: 1024,
});
