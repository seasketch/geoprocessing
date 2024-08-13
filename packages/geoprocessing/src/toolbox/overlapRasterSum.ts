import {
  Sketch,
  SketchCollection,
  Polygon,
  Metric,
  MultiPolygon,
} from "../types/index.js";
import { isSketchCollection, roundDecimal } from "../helpers/index.js";
import { createMetric } from "../metrics/index.js";
import { featureEach } from "@turf/turf";
import { getSum } from "./geoblaze/index.js";

// @ts-ignore
import { Georaster } from "geoblaze";

interface OverlapRasterOptions {
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
}

/**
 * Returns sum of cells overlapping sketch with raster as a metric object
 * If sketch collection, then calculate overlap for all child sketches also
 */
export async function overlapRasterSum(
  /** metricId value to assign to each measurement */
  metricId: string,
  /** Cloud-optimized geotiff to calculate overlap with, loaded via loadCog or geoblaze.parse() */
  raster: Georaster,
  /** single sketch or collection to calculate metrics for. */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  options?: Partial<OverlapRasterOptions>
): Promise<Metric[]> {
  const newOptions: OverlapRasterOptions = {
    truncate: true,
    ...(options || {}),
  };

  // Get raster sum for each feature
  const sumPromises: Promise<number>[] = [];
  const sumFeatures: Sketch[] = [];

  featureEach(sketch, async (feat) => {
    // accumulate geoblaze sum promises and features so we can create metrics later
    sumPromises.push(getSum(raster, feat));
    sumFeatures.push(feat);
  });

  // await results and create metrics
  let sketchMetrics: Metric[] = [];
  (await Promise.all(sumPromises)).forEach((curSum, index) => {
    sketchMetrics.push(
      createMetric({
        metricId,
        sketchId: sumFeatures[index].properties.id,
        value: newOptions.truncate
          ? roundDecimal(curSum, 6, { keepSmallValues: true })
          : curSum,
        extra: {
          sketchName: sumFeatures[index].properties.name,
        },
      })
    );
  });

  if (isSketchCollection(sketch)) {
    // Push collection with accumulated sumValue
    const collSumValue = await getSum(raster, sketch);
    sketchMetrics.push(
      createMetric({
        metricId,
        sketchId: sketch.properties.id,
        value: newOptions.truncate
          ? roundDecimal(collSumValue, 6, { keepSmallValues: true })
          : collSumValue,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      })
    );
  }

  return sketchMetrics;
}
