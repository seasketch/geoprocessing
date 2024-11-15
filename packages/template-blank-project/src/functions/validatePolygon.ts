import {
  PreprocessingHandler,
  Feature,
  Sketch,
  isPolygonFeature,
  ValidationError,
  ensureValidPolygon,
} from "@seasketch/geoprocessing";

/**
 * Preprocessor takes a Polygon feature/sketch and throws an error if it's invalid.
 * Otherwise returns the feature without modification to the geometry.
 */
export async function validatePolygon(
  feature: Feature | Sketch,
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  ensureValidPolygon(feature, {
    allowSelfCrossing: false,
    minSize: 0.0001, // square kilometers, 100 square meters
    enforceMinSize: true,
    maxSize: 1_000_000, // square kilometers
    enforceMaxSize: true,
  });

  return feature;
}

export default new PreprocessingHandler(validatePolygon, {
  title: "validatePolygon",
  description:
    "Verifies that input is a valid polygon and within size guidelines",
  timeout: 40,
  memory: 1024,
});
