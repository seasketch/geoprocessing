import {
  Feature,
  Metric,
  StatsObject,
  MetricDimension,
} from "../types/index.js";
import {
  isFeatureCollection,
  isSketch,
  isSketchCollection,
} from "../helpers/index.js";
import { featureEach } from "@turf/turf";
import { RasterStatsOptions, rasterStats } from "./geoblaze/index.js";
import { rasterStatsToMetrics } from "./geoblaze/rasterStatsToMetrics.js";
import { Georaster } from "geoblaze";

export interface OverlapRasterOptions extends RasterStatsOptions {
  /** Optional metricId to be assigned.  Don't use if you are calculating more than one stat because you won't be able to tell them apart */
  metricId?: string;
  /** Optional caller-provided prefix to add to metricId in addition to stat name e.g. 'coral' with metrics of 'sum', 'count', 'area' will generate metric IDs of 'coral-sum', 'coral-count', 'coral-area' */
  metricIdPrefix?: string;
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
  /** If multi-band raster, metric property name that raster bands are organized by e.g. classID */
  bandMetricProperty?: MetricDimension;
  /** If multi-band raster, object mapping band number (starting with 0 index) to unique ID value eg. ( 0: 'mangroves', 1: 'coral' ).  Defaults to 'band 1', 'band 2'  */
  bandMetricValues?: string[];
  includeChildMetrics?: boolean;
  /** If categorical raster, set to true */
  categorical?: boolean;
  /** If categorical raster, metric property name that categories are organized. Defaults to classId */
  categoryMetricProperty?: MetricDimension;
  /** If categorical raster, array of values to create metrics for */
  categoryMetricValues?: string[];
}

/**
 * Calculates summary metrics (stats/area) on given raster, optionally intersecting raster with provided feature (zonal statistics).
 * If feature is a collection, then calculate metrics for each individual feature as well as the collection as a whole.
 * This can be disabled with includeChildMetrics: false.  Defaults to assuming a continuous raster but also supports categorical option
 */
export async function rasterMetrics(
  /** Cloud-optimized geotiff, loaded via loadCog or geoblaze.parse() */
  raster: Georaster,
  options: OverlapRasterOptions = {},
): Promise<Metric[]> {
  const {
    metricId,
    metricIdPrefix,
    feature = options.feature,
    bandMetricProperty,
    bandMetricValues,
    includeChildMetrics = true,
    categorical = false,
    categoryMetricProperty = "classId",
    categoryMetricValues,
    ...statOptions
  } = options;
  let metrics: Metric[] = [];

  // Feature/Sketch level metrics
  const promises: Promise<StatsObject[]>[] = [];
  const features: Feature[] = [];

  const numBands = bandMetricValues ? Object.keys(bandMetricValues).length : 1;

  if (feature) {
    if (includeChildMetrics) {
      featureEach(feature, async (curSketch) => {
        // accumulate individual feature/sketch level stat promises
        promises.push(
          rasterStats(raster, {
            feature: curSketch,
            numBands,
            categorical,
            categoryMetricProperty,
            categoryMetricValues,
            ...statOptions,
          }),
        );
        features.push(curSketch);
      });

      // convert individual feature/sketch level stats to metrics
      for (const [index, curStats] of (await Promise.all(promises)).entries()) {
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
          metricId,
          metricIdPrefix,
          metricPartial,
          bandMetricProperty,
          bandMetricValues,
          categorical,
          categoryMetricProperty,
          categoryMetricValues,
        });
        metrics = metrics.concat(curMetrics);
      }
    }

    // SketchCollection level metrics
    if (isFeatureCollection(feature)) {
      const collStats = await rasterStats(raster, {
        feature: options?.feature,
        numBands,
        categorical,
        categoryMetricProperty,
        categoryMetricValues,
        ...statOptions,
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
        metricId,
        metricIdPrefix,
        metricPartial,
        bandMetricProperty,
        bandMetricValues,
        categorical,
        categoryMetricProperty,
        categoryMetricValues,
      });
      metrics = metrics.concat(collMetrics);
    }
  } else {
    // Whole raster metrics (no sketch)
    const wholeStats = await rasterStats(raster, {
      numBands,
      categorical,
      categoryMetricProperty,
      categoryMetricValues,
      ...statOptions,
    });

    const wholeMetrics = rasterStatsToMetrics(wholeStats, {
      metricId,
      metricIdPrefix,
      bandMetricProperty,
      bandMetricValues,
      categorical,
      categoryMetricProperty,
      categoryMetricValues,
    });
    metrics = metrics.concat(wholeMetrics);
  }

  return metrics;
}
