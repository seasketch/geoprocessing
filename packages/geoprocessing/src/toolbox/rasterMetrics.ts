import {
  Sketch,
  SketchCollection,
  Polygon,
  Metric,
  StatsObject,
  MetricDimension,
} from "../types";
import { isSketchCollection } from "../helpers";
import { featureEach } from "@turf/meta";
import { MultiPolygon } from "@turf/helpers";
import { RasterStatsOptions, rasterStats } from "./geoblaze";
import { rasterStatsToMetrics } from "./geoblaze/rasterStatsToMetrics";

// @ts-ignore
import { Georaster } from "geoblaze";

interface OverlapRasterOptions extends RasterStatsOptions {
  /** single sketch or sketch collection filter to overlap with raster when calculating metrics. */
  sketch?:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>;
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
  /** If multi-band raster, metric property name that raster bands are organized by e.g. classID */
  bandMetricProperty?: MetricDimension;
  /** If multi-band raster, object mapping band number (starting with 0 index) to unique ID value eg. { 0: 'mangroves', 1: 'coral' }.  Defaults to 'band 1', 'band 2'  */
  bandMetricValues?: string[];
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
    sketch = options.sketch,
    bandMetricProperty,
    bandMetricValues,
    ...statOptions
  } = options;
  let metrics: Metric[] = [];

  // Sketch level metrics
  const promises: Promise<StatsObject[]>[] = [];
  const sketches: Sketch[] = [];
  if (sketch) {
    featureEach(sketch, async (curSketch) => {
      // accumulate sketches and sketch level stat promises
      promises.push(
        rasterStats(raster, {
          feature: options?.feature,
          ...(statOptions ?? {}),
        })
      );
      sketches.push(curSketch);
    });

    // convert sketch level stats to metrics
    (await Promise.all(promises)).forEach((curStats, index) => {
      const curMetrics = rasterStatsToMetrics(curStats, {
        bandMetricProperty,
        bandMetricValues,
        metricExtra: {
          sketchId: sketches[index].properties.id,
          extra: {
            sketchName: sketches[index].properties.name,
          },
        },
      });
      metrics = metrics.concat(curMetrics);
    });

    // SketchCollection level metrics
    if (isSketchCollection(sketch)) {
      const collStats = await rasterStats(raster, {
        feature: options?.feature,
        ...(statOptions ?? {}),
      });
      const collMetrics = rasterStatsToMetrics(collStats, {
        bandMetricProperty,
        bandMetricValues,
        metricExtra: {
          sketchId: sketch.properties.id,
          extra: {
            sketchName: sketch.properties.name,
          },
        },
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
