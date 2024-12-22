import {
  PreprocessingHandler,
  Feature,
  Sketch,
  ensureValidPolygon,
  Polygon,
  MultiPolygon,
  loadFgb,
  clip,
  clipMultiMerge,
  ValidationError,
  isPolygonFeature,
  biggestPolygon,
} from "@seasketch/geoprocessing";
import { area, bbox, featureCollection } from "@turf/turf";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land) and within one or more EEZ boundaries.
 */
export async function clipToOceanEez(
  feature: Feature | Sketch,
): Promise<Feature> {
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

  // Get features from land and eez datasources
  const landFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-coastline-daylight-v158.fgb",
    featureBox,
  );

  const eezFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    "https://gp-global-datasources-datasets.s3.us-west-1.amazonaws.com/global-eez-land-union-mr-v4.fgb",
    featureBox,
  );

  // Erase portion of sketch over land

  let clipped: Feature<Polygon | MultiPolygon> | null = feature;
  if (clipped !== null && landFeatures.length > 0) {
    clipped = clip(featureCollection([clipped, ...landFeatures]), "difference");
  }

  // Keep portion of sketch within EEZ

  if (eezFeatures.length === 0) {
    clipped = null; // No land to clip to, intersection is empty
  }

  if (clipped !== null) {
    clipped = clipMultiMerge(
      clipped,
      featureCollection(eezFeatures),
      "intersection",
    );
  }

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Feature is outside of EEZ boundary");
  }

  // Assume user wants the largest polygon if multiple remain
  return biggestPolygon(clipped);
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 1024,
});
