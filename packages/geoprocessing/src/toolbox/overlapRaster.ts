import { Sketch, SketchCollection, Polygon, Metric } from "../types";
import {
  isSketchCollection,
  clip,
  removeSketchPolygonHoles,
  removeSketchCollPolygonHoles,
} from "../helpers";
import { createMetric } from "../metrics";
import { featureEach } from "@turf/meta";
import area from "@turf/area";
import { Feature, featureCollection, MultiPolygon } from "@turf/helpers";

// @ts-ignore
import geoblaze, { Georaster } from "geoblaze";

/**
 * Returns sum metric for raster.  If sketch parameter provided, sum overlap is also calculated for each sketch polygon.
 * For sketch collections, dissolve is used when calculating total sketch value to prevent double counting
 * Holes are removed by default from sketch polygons to prevent an apparent bug with Geoblaze overcounting when present.
 * Make sure that raster data is already clipped to land for example, to ensure it does not overcount.
 */
export async function overlapRaster(
  metricId: string,
  raster: Georaster,
  /** single sketch or collection. */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  options: {
    /** Remove holes from sketch polygons before calculating overlap. Geoblaze doesn't handle them correctly and overcounts.  Default to true.  Just make sure raster has e.g. lang clipped out already */
    removeSketchHoles: boolean;
  } = { removeSketchHoles: true }
): Promise<Metric[]> {
  let isOverlap = false;
  let sumValue = 0;

  // If sketch collection and they overlap, accumulate collection total value using union
  if (isSketchCollection(sketch)) {
    const sketchArea = area(sketch);
    // Remove polygon holes (geoblaze polygon hole bug)
    const remSketches = options.removeSketchHoles
      ? removeSketchCollPolygonHoles(sketch)
      : sketch.features;
    // Remove overlap
    const sketchUnion = clip(featureCollection(remSketches), "union");
    if (!sketchUnion) throw new Error("overlapRaster - something went wrong");
    const sketchUnionArea = area(sketchUnion);
    // If there was overlap, use the union for accumulating sumValue
    isOverlap = sketchUnionArea < sketchArea;
    const sumPromises: Promise<number>[] = [];
    if (isOverlap) {
      featureEach(sketchUnion as Feature<Polygon>, (feat) => {
        // accumulate geoblaze sum promises
        sumPromises.push(getSum(raster, feat));
      });
    }
    // await promises and accumulate sumValue
    (await Promise.all(sumPromises)).forEach((curSum) => {
      sumValue += curSum;
    });
  }

  // Get raster sum for each feature
  // If there was no overlap found above, accumulate collection sumValue here instead
  const sumPromises: Promise<number>[] = [];
  const sumFeatures: Sketch[] = [];
  featureEach(sketch, async (feat) => {
    const remSketch = options.removeSketchHoles
      ? removeSketchPolygonHoles(feat)
      : feat;

    // accumulate geoblaze sum promises and features so we can create metrics later
    sumPromises.push(getSum(raster, remSketch));
    sumFeatures.push(feat);
  });

  // await promises and create metrics, also accumulate sumValue if no overlap
  let sketchMetrics: Metric[] = [];
  (await Promise.all(sumPromises)).forEach((curSum, index) => {
    if (!isOverlap) {
      sumValue += curSum;
    }
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
    sketchMetrics.push(
      createMetric({
        metricId,
        sketchId: sketch.properties.id,
        value: sumValue,
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
  feat?: Feature<Polygon | MultiPolygon>
) => {
  let sum = 0;
  try {
    const result = await geoblaze.sum(raster, feat);
    sum = result[0];
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.sum threw, there must not be any cells with value overlapping the geometry"
    );
  }
  return sum;
};

/**
 * Returns histogram of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getHistogram = async (
  raster: Georaster,
  feat?: Feature<Polygon | MultiPolygon>
) => {
  let histogram = {};
  try {
    histogram = await geoblaze.histogram(raster, feat)[0];
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.histogram threw, there must not be any cells with value overlapping the geometry"
    );
  }
  return histogram;
};
