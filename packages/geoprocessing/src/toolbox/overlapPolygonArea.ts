import {
  Sketch,
  SketchCollection,
  Polygon,
  Feature,
  Metric,
} from "../types/index.js";
import {
  toSketchArray,
  isSketchCollection,
  roundDecimal,
} from "../helpers/index.js";
import { intersectInChunks } from "./clip.js";
import { createMetric } from "../metrics/index.js";
import { MultiPolygon } from "../types/geojson.js";
import { featureCollection, area, truncate as truncateGeom } from "@turf/turf";
import { removeOverlap } from "../helpers/removeOverlap.js";

/**
 * Calculates area of overlap between sketch(es) and an array of polygon features.
 * Truncates input geometry coordinates down to 6 decimal places (~1m accuracy) before intersection to avoid floating point precision issues.
 * If sketch collection, then calculates area for each child sketch and the whole collection, without overcounting sketch overlap
 * @param metricId unique metric identifier to assign to each metric
 * @param features to intersect and get overlap metrics
 * @param sketch the sketches.  If empty will return 0 result.
 * @param options.chunkSize number of features to intersect at a time, to avoid infinite loop error, defaults to 5000 features
 * @param options.truncate truncate results to 6 digits after decimal point, defaults to true
 * @param options.includeChildMetrics if false and sketch is collection, child sketch metrics will not be included in results, defaults to true
 * @param options.solveOverlap if true and sketch is collection, remove overlap between child sketches (using union) before calculating collection level metric, setting to false will be faster but will overcount any sketch overlap
 * @returns array of Metric objects
 */
export async function overlapPolygonArea(
  metricId: string,
  features: Feature<Polygon | MultiPolygon>[],
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | Sketch<Polygon | MultiPolygon>[],
  options: {
    chunkSize?: number;
    truncate?: boolean;
    includeChildMetrics?: boolean;
    solveOverlap?: boolean;
  } = {},
): Promise<Metric[]> {
  const {
    includeChildMetrics = true,
    chunkSize = 5000,
    truncate = true,
    solveOverlap = true,
  } = options;

  // If sketch collection, used to accumulate collection level value
  let collValue: number = 0;

  const truncatedSketches = (
    Array.isArray(sketch) ? sketch : toSketchArray(sketch)
  ).map((s) => truncateGeom(s));
  const truncatedFeatures = features.map((f) => truncateGeom(f));

  // Individual sketch metrics
  const sketchMetrics: Metric[] = truncatedSketches.map((curSketch) => {
    const sketchValue = intersectInChunks(
      curSketch,
      truncatedFeatures,
      chunkSize,
    ).reduce(
      (valueSoFar, rem) => (rem ? area(rem) + valueSoFar : valueSoFar),
      0,
    );

    // Accumulate collection level value from children. Does not solve for overlap
    if (solveOverlap === false) collValue += sketchValue;

    return createMetric({
      metricId,
      sketchId: curSketch.properties.id,
      value: truncate
        ? roundDecimal(sketchValue, 6, { keepSmallValues: true })
        : sketchValue,
      extra: {
        sketchName: curSketch.properties.name,
      },
    });
  });

  const metrics = includeChildMetrics ? sketchMetrics : [];

  // Collection level metrics
  if (isSketchCollection(sketch)) {
    // Slower method but solves for overlap
    if (solveOverlap === true) {
      // Remove overlap between sketches then calculate collection level area
      const noOverlapPolygons = removeOverlap(
        featureCollection(truncatedSketches),
      );
      collValue = intersectInChunks(
        noOverlapPolygons,
        truncatedFeatures,
        chunkSize,
      ).reduce(
        (valueSoFar, rem) => (rem ? area(rem) + valueSoFar : valueSoFar),
        0,
      );
    }

    metrics.push(
      createMetric({
        metricId,
        sketchId: sketch.properties.id,
        value: truncate
          ? roundDecimal(collValue, 6, { keepSmallValues: true })
          : collValue,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      }),
    );
  }

  return metrics;
}
