import { Sketch, SketchCollection, Polygon, Metric } from "../types";
import { isSketchCollection } from "../helpers";
import { createMetric } from "../metrics";
import { featureEach } from "@turf/meta";
import { MultiPolygon } from "@turf/helpers";
import { getSum } from "./geoblaze";

// @ts-ignore
import { Georaster } from "geoblaze";

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
  /** Simplifies results to 6 significant digits to avoid floating pt arithmetric differences, defaults to false */
  simplifyPrecision?: boolean
): Promise<Metric[]> {
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
        value: simplifyPrecision ? parseFloat(curSum.toPrecision(6)) : curSum,
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
        value: simplifyPrecision
          ? parseFloat(collSumValue.toPrecision(6))
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
