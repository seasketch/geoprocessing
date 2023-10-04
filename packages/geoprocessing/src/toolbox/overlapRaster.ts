import { Sketch, SketchCollection, Polygon, Metric } from "../types";
import { isSketchCollection, roundDecimal } from "../helpers";
import { createMetric } from "../metrics";
import { featureEach } from "@turf/meta";
import { MultiPolygon } from "@turf/helpers";
import { getSum } from "./geoblaze";

// @ts-ignore
import { Georaster } from "geoblaze";

interface OverlapRasterOptions {
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
}

/**
 * Returns metrics representing sketch overlap with raster.
 * If sketch collection, then calculate overlap for all child sketches also
 */
export async function overlapRaster(
  /** metricId value to assign to each measurement */
  metricId: string,
  /** Cloud-optimized geotiff to calculate overlap with, loaded via geoblaze.parse() */
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
