import {
  Sketch,
  SketchCollection,
  Polygon,
  Feature,
  Metric,
} from "../types/index.js";
import { MultiPolygon } from "../types/geojson.js";
import { overlapPolygonArea } from "./overlapPolygonArea.js";
import { overlapPolygonSum } from "./overlapPolygonSum.js";

interface OverlapFeatureOptions {
  /** Operation to perform, supports area or sum.  Defaults to area */
  operation: "area" | "sum";
  /** Intersection calls are chunked to avoid infinite loop error, defaults to 5000 features */
  chunkSize: number;
  /** If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true */
  includeChildMetrics?: boolean;
  /** Name of feature property to sum */
  sumProperty?: string;
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
}

/**
 * Calculates overlap between sketch(es) and an array of polygon features.
 * Supports area or sum operation (given sumProperty), defaults to area
 * If sketch collection includes overall and per sketch
 * @param metricId unique metric identifier to assign to each metric
 * @param features to intersect and get overlap stats
 * @param sketch the sketches.  If empty will return 0 result.
 * @param options
 * @returns array of Metric objects
 * @deprecated use overlapPolygonArea or overlapPolygonSum directly, this function now just calls them
 */
export async function overlapFeatures(
  metricId: string,
  features: Feature<Polygon | MultiPolygon>[],
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | Sketch<Polygon | MultiPolygon>[],
  options?: Partial<OverlapFeatureOptions>,
): Promise<Metric[]> {
  const newOptions: OverlapFeatureOptions = {
    includeChildMetrics: true,
    operation: "area",
    chunkSize: 5000,
    truncate: true,
    ...options,
  };
  const { operation } = newOptions;

  if (operation === "area") {
    return overlapPolygonArea(metricId, features, sketch, newOptions);
  } else {
    return overlapPolygonSum(metricId, features, sketch, newOptions);
  }
}
