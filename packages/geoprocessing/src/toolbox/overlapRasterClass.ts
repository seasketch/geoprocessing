import {
  Polygon,
  Sketch,
  SketchCollection,
  Georaster,
  Metric,
  MetricDimension,
  MultiPolygon,
} from "../types/index.js";
import { isSketchCollection } from "../helpers/index.js";
import { createMetric } from "../metrics/index.js";
import { Histogram } from "../types/geoblaze.js";
import { getHistogram } from "./geoblaze/index.js";
import { featureEach } from "@turf/turf";

/**
 * Calculates sum of overlap between sketches and a categorical raster with numeric values representing feature classes
 * If sketch collection, then calculate overlap for all child sketches also
 * @deprecated use rasterMetrics instead
 */
export async function overlapRasterClass(
  /** metricId value to assign to each measurement */
  metricId: string,
  /** Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse(), representing categorical data (multiple classes) */
  raster: Georaster,
  /**
   * single sketch or collection.  If undefined will return sum by feature class for the whole raster.
   * Supports polygon or multipolygon.  Will remove overlap between sketches, but will not remove overlap within Multipolygon sketch
   */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | undefined,
  /** Object mapping numeric category IDs (as strings e.g. "1") in the raster to their string names for display e.g. "Coral Reef" */
  mapping: Record<string, string>,
  /** Dimension to assign category name when creating metrics, defaults to classId */
  metricCategoryDimension: MetricDimension = "classId",
): Promise<Metric[]> {
  if (!mapping) throw new Error("Missing category mapping");

  // Get histogram for each feature, whether sketch or sketch collection
  const histoPromises: Promise<Histogram>[] = [];
  const histoFeatures: Sketch[] = [];
  // await results and create metrics for each sketch
  const sketchMetrics: Metric[] = [];

  if (sketch) {
    featureEach(sketch, async (feat) => {
      // accumulate geoblaze promises and features so we can create metrics later
      histoPromises.push(getHistogram(raster, feat));
      histoFeatures.push(feat);
    });

    for (const [index, curHisto] of (
      await Promise.all(histoPromises)
    ).entries()) {
      const histoMetrics = histoToMetrics(
        metricId,
        histoFeatures[index],
        curHisto,
        mapping,
      );
      sketchMetrics.push(...histoMetrics);
    }
  }

  // Calculate overall if sketch collection or no sketch
  if (!sketch || isSketchCollection(sketch)) {
    const overallHisto = await getHistogram(raster, sketch);
    const overallHistoMetrics = histoToMetrics(
      metricId,
      sketch,
      overallHisto,
      mapping,
      metricCategoryDimension,
    );
    sketchMetrics.push(...overallHistoMetrics);
  }

  return sketchMetrics;
}

/** Returns metrics given histogram and sketch */
const histoToMetrics = (
  metricId: string,
  sketch: Sketch | SketchCollection | undefined,
  histo: Histogram,
  /** Object mapping numeric category IDs to their string counterpart */
  mapping: Record<string, string>,
  /** Dimension to assign category name when creating metrics, defaults to classId */
  metricCategoryDimension: MetricDimension = "classId",
): Metric[] => {
  const metrics: Metric[] = [];
  const categoryIds = Object.keys(mapping);
  // Initialize complete histogram with zeros
  const finalHisto = Object.keys(mapping).reduce(
    (histoSoFar, curCategory) => ({ ...histoSoFar, [curCategory]: 0 }),
    {},
  );
  // Merge in calculated histogram which will only include non-zero
  if (histo) {
    for (const categoryId of Object.keys(histo)) {
      finalHisto[categoryId] = histo[categoryId];
    }
  }

  // Create one metric record per class
  for (const categoryId of categoryIds) {
    metrics.push(
      createMetric({
        metricId,
        [metricCategoryDimension]: mapping[categoryId], // resolve category name and assign to metric
        sketchId: sketch ? sketch.properties.id : null,
        value: histo[categoryId] || 0, // should never be undefined but default to 0 anyway
        extra: sketch
          ? {
              sketchName: sketch.properties.name,
              ...(isSketchCollection(sketch) ? { isCollection: true } : {}),
            }
          : {},
      }),
    );
  }
  return metrics;
};
