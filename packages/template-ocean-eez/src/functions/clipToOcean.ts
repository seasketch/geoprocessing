import {
  PreprocessingHandler,
  Feature,
  Sketch,
  isPolygonFeature,
  ValidationError,
  clipToPolygonFeatures,
  DatasourceClipOperation,
} from "@seasketch/geoprocessing";
import project from "../../project";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";

interface ExtraParams {
  /** Array of EEZ's to clip to  */
  eezNames?: string[];
}

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land) and within one or more EEZ boundaries.
 * If results in multiple polygons then returns the largest.
 */
export async function clipToOcean(
  feature: Feature | Sketch,
  extraParams: ExtraParams = {}
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  /**
   * Subtract parts of feature/sketch that overlap with land. Uses global OSM land polygons
   * unionProperty is specific to subdivided datasets.  When defined, it will fetch
   * and rebuild all subdivided land features overlapping with the feature/sketch
   * with the same gid property (assigned one per country) into one feature before clipping
   */
  const removeLand: DatasourceClipOperation = {
    datasourceId: "global-clipping-osm-land",
    operation: "difference",
    options: {
      unionProperty: "gid", // gid is assigned per country
    },
  };

  // Create a function that will perform the clip operations in order
  const clipLoader = genClipLoader(project, [removeLand]);

  // Wrap clip function into preprocessing function with additional clip options
  return clipToPolygonFeatures(feature, clipLoader, {
    maxSize: 500000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToOcean, {
  title: "clipToOcean",
  description: "Clips feature or sketch to ocean, removing land",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
