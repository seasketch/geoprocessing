import { Sketch, SketchCollection, Polygon, Metric, Histogram } from "../types";
import { isSketchCollection } from "../helpers";
import { createMetric } from "../metrics";
import { featureEach } from "@turf/meta";
import { Feature, MultiPolygon, FeatureCollection } from "@turf/helpers";

// @ts-ignore
import geoblaze, { Georaster } from "geoblaze";

/**
 * Measure .  If sketch parameter provided, sum overlap is also calculated for each sketch polygon.
 * For sketch collections, dissolve is used when calculating total sketch value to prevent double counting
 * Holes are removed by default from sketch polygons to prevent an apparent bug with Geoblaze overcounting when present.
 * Make sure that raster data is already clipped to land for example, to ensure it does not overcount.
 */
export async function overlapRaster(
  /** metricId value to assign to each measurement */
  metricId: string,
  raster: Georaster,
  /** single sketch or collection to calculate metrics for. */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
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
        value: curSum,
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
        value: collSumValue,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      })
    );
  }

  return sketchMetrics;
}

/**
 * Returns sum of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getSum = async (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>
) => {
  let sum = 0;
  try {
    const result = await geoblaze.sum(raster, feat);
    sum = result[0];
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.sum threw, meaning no cells with value were found within the geometry"
    );
  }
  return sum;
};

/**
 * Returns histogram of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getHistogram = async (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>,
  options: {
    scaleType?: "nominal" | "ratio";
    numClasses?: number;
    classType?: "equal-interval" | "quantile";
  } = {
    scaleType: "nominal",
  }
): Promise<Histogram> => {
  let histogram = {};
  try {
    histogram = await geoblaze.histogram(raster, feat, options)[0];
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.histogram threw, there must not be any cells with value overlapping the geometry"
    );
  }
  return histogram;
};
