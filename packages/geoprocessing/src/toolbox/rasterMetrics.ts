import { Feature, Metric, StatsObject, MetricDimension } from "../types";
import { isFeatureCollection, isSketch, isSketchCollection } from "../helpers";
import { featureEach } from "@turf/meta";
import { RasterStatsOptions, rasterStats } from "./geoblaze";
import { rasterStatsToMetrics } from "./geoblaze/rasterStatsToMetrics";

// @ts-ignore
import { Georaster } from "geoblaze";

interface OverlapRasterOptions extends RasterStatsOptions {
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
  /** If multi-band raster, metric property name that raster bands are organized by e.g. classID */
  bandMetricProperty?: MetricDimension;
  /** If multi-band raster, object mapping band number (starting with 0 index) to unique ID value eg. { 0: 'mangroves', 1: 'coral' }.  Defaults to 'band 1', 'band 2'  */
  bandMetricValues?: string[];
  includeChildMetrics?: boolean;
}

/**
 * Calculates stats on the provided raster and returns as an array of Metric objects (defaults to sum stat)
 * If sketch, then calculate overlap metrics, sketch collection will calculate metrics for each individual sketch within
 */
export async function rasterMetrics(
  /** Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse() */
  raster: Georaster,
  options: OverlapRasterOptions = {}
): Promise<Metric[]> {
  const {
    feature = options.feature,
    bandMetricProperty,
    bandMetricValues,
    includeChildMetrics = true,
    ...statOptions
  } = options;
  let metrics: Metric[] = [];

  // Feature/Sketch level metrics
  const promises: Promise<StatsObject[]>[] = [];
  const features: Feature[] = [];

  if (feature) {
    if (includeChildMetrics) {
      featureEach(feature, async (curSketch) => {
        // accumulate individual feature/sketch level stat promises
        promises.push(
          rasterStats(raster, {
            feature: options?.feature,
            ...(statOptions ?? {}),
          })
        );
        features.push(curSketch);
      });

      // convert individual feature/sketch level stats to metrics
      (await Promise.all(promises)).forEach((curStats, index) => {
        const curFeature = features[index];
        const metricPartial: Partial<Metric> = (() => {
          if (isSketch(curFeature)) {
            return {
              sketchId: curFeature.properties.id,
              extra: {
                sketchName: curFeature.properties.name,
              },
            };
          } else {
            return {};
          }
        })();
        const curMetrics = rasterStatsToMetrics(curStats, {
          metricPartial,
          bandMetricProperty,
          bandMetricValues,
        });
        metrics = metrics.concat(curMetrics);
      });
    }

    // SketchCollection level metrics
    if (isFeatureCollection(feature)) {
      const collStats = await rasterStats(raster, {
        feature: options?.feature,
        ...(statOptions ?? {}),
      });

      const metricPartial: Partial<Metric> = (() => {
        if (isSketchCollection(feature)) {
          return {
            sketchId: feature.properties.id,
            extra: {
              sketchName: feature.properties.name,
              isCollection: true,
            },
          };
        } else {
          return {};
        }
      })();

      const collMetrics = rasterStatsToMetrics(collStats, {
        metricPartial,
        bandMetricProperty,
        bandMetricValues,
      });
      metrics = metrics.concat(collMetrics);
    }
  } else {
    // Whole raster metrics (no sketch)
    const wholeStats = await rasterStats(raster, {
      ...(statOptions ?? {}),
    });
    const wholeMetrics = rasterStatsToMetrics(wholeStats, {
      bandMetricProperty,
      bandMetricValues,
    });
    metrics = metrics.concat(wholeMetrics);
  }

  return metrics;
}