import {
  PreprocessingHandler,
  Feature,
  Sketch,
  isPolygonFeature,
  ValidationError,
  clipToPolygonFeatures,
  DatasourceClipOperation,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";

interface ExtraParams {
  /** Array of country ID's to clip to  */
  countryIds?: string[];
}

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * overlaps with land. Optionally accepts array of country IDs to further filter
 * feature/sketch to.
 */
export async function clipToLand(
  feature: Feature | Sketch,
  extraParams: ExtraParams = {},
): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  /**
   * Subtract parts of feature/sketch that don't overlap with land. Uses global OSM land polygons
   * unionProperty is specific to subdivided datasets.  When defined, it will fetch
   * and rebuild all subdivided land features overlapping with the feature/sketch
   * with the same gid property (assigned one per country) into one feature before clipping.
   * This is useful for preventing slivers from forming and possible for performance.
   * unionProperty will optionally filter the land features by one or more country ID so you can
   * constrain it to a specific country.
   */
  const keepLand: DatasourceClipOperation = {
    datasourceId: "global-clipping-osm-land",
    operation: "intersection",
    options: {
      unionProperty: "gid", // gid is assigned per country
      propertyFilter: {
        property: "gid",
        values: extraParams?.countryIds || [project.basic.planningAreaId] || [],
      },
    },
  };

  // Create a function that will perform the clip operations in order
  const clipLoader = genClipLoader(project, [keepLand]);

  // Wrap clip function into preprocessing function with additional clip options
  return clipToPolygonFeatures(feature, clipLoader, {
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToLand, {
  title: "clipToLand",
  description: "Clips portion of feature or sketch not overlapping land",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
