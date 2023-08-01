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
  /** Array of EEZ ID's to clip to  */
  eezs?: string[];
}

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land) and within one or more EEZ boundaries.
 */
export async function clipToOceanEez(
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
   * with the same gid property (assigned one per country) into one feature before clipping.
   * This is useful for preventing slivers from forming and possible for performance.
   */
  const removeLand: DatasourceClipOperation = {
    datasourceId: "global-clipping-osm-land",
    operation: "difference",
    options: {
      unionProperty: "gid", // gid is assigned per country
    },
  };

  // Optionally, subtract parts of feature/sketch that are outside of one
  // or more EEZ's.  Using a runtime-provided list of EEZ's via extraParams.eezFilterByNames
  // allows this preprocessor to work for any set of EEZ's.  Using a project-configured
  // planningAreaId allows this preprocessor to work for a specific EEZ.
  const removeOutsideEez: DatasourceClipOperation = {
    datasourceId: "global-clipping-eez-land-union",
    operation: "intersection",
    options: {
      propertyFilter: {
        property: "UNION",
        values: extraParams?.eezs || [project.basic.planningAreaId] || [],
      },
    },
  };

  // Create a function that will perform the clip operations in order
  const clipLoader = genClipLoader(project, [removeLand, removeOutsideEez]);

  // Wrap clip function into preprocessing function with additional clip options
  return clipToPolygonFeatures(feature, clipLoader, {
    maxSize: 500000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false, // throws error if feature is larger than maxSize
    ensurePolygon: true, // don't allow multipolygon result, returns largest if multiple
  });
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
