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
    if (isOverlap) {
      featureEach(sketchUnion as Feature<Polygon>, (feat) => {
        sumValue += getSum(raster, feat);
      });
    }
  }

  // Get raster sum for each feature
  // If there was no overlap found above, accumulate collection sumValue here instead
  let sketchMetrics: Metric[] = [];
  featureEach(sketch, (feat) => {
    const remSketch = options.removeSketchHoles
      ? removeSketchPolygonHoles(feat)
      : feat;

    const sketchValue = getSum(raster, remSketch);

    if (!isOverlap) {
      sumValue += sketchValue;
    }
    sketchMetrics.push(
      createMetric({
        metricId,
        sketchId: feat.properties.id,
        value: sketchValue,
        extra: {
          sketchName: feat.properties.name,
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
export const getSum = (
  raster: Georaster,
  feat?: Feature<Polygon | MultiPolygon>
): number => {
  let sum = 0;
  try {
    sum = geoblaze.sum(raster, feat)[0];
  } catch (err) {
    console.log(
      "overlapRaster raster sum threw, must not be any overlapping cells with value"
    );
  }
  return sum;
};

/**
 * Returns histogram of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getHistogram = (
  raster: Georaster,
  feat?: Feature<Polygon | MultiPolygon>
) => {
  let histogram = {};
  try {
    histogram = geoblaze.histogram(raster, feat)[0];
  } catch (err) {
    console.log(
      "overlapRaster raster histogram threw, must not be any overlapping cells with value"
    );
  }
  return histogram;
};
