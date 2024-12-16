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
import { clip } from "./clip.js";
import { createMetric } from "../metrics/index.js";
import { MultiPolygon } from "../types/geojson.js";
import { featureCollection, truncate as truncateGeom } from "@turf/turf";

/**
 * Calculates area overlap between sketch(es) and an array of polygon features.
 * Truncates input geometry coordinates down to 6 decimal places (~1m accuracy) before intersection to avoid floating point precision issues.
 * If sketch collection, then calculates area per sketch and for sketch collection, and does not overcount sketch overlap
 * @param metricId unique metric identifier to assign to each metric
 * @param features to intersect and get overlap metrics
 * @param sketch the sketches.  If empty will return 0 result.
 * @param options.truncate truncate results to 6 digits after decimal point, defaults to true
 * @param options.includeChildMetrics if false and sketch is collection, child sketch metrics will not be included in results, defaults to true
 * @param options.sumProperty Property in features with value to sum, if not defined each feature will count as 1
 * @returns array of Metric objects
 */
export async function overlapPolygonSum(
  metricId: string,
  features: Feature<Polygon | MultiPolygon>[],
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | Sketch<Polygon | MultiPolygon>[],
  options: {
    truncate?: boolean;
    includeChildMetrics?: boolean;
    sumProperty?: string;
  } = {},
): Promise<Metric[]> {
  const { includeChildMetrics = true, truncate = true, sumProperty } = options;

  // Collect indices of features that intersect with sketch(es) for later calculation of collection level sum
  const featureIndices: Set<number> = new Set();

  const truncatedSketches = (
    Array.isArray(sketch) ? sketch : toSketchArray(sketch)
  ).map((s) => truncateGeom(s));
  const truncatedFeatures = features.map((f) => truncateGeom(f));

  // Individual sketch metrics
  const sketchMetrics: Metric[] = truncatedSketches.map((curSketch) => {
    const intersections = intersectSum(
      curSketch,
      truncatedFeatures,
      sumProperty,
    );

    // Accumulate feature indices that intersect with collection
    for (const index of intersections.indices) featureIndices.add(index);

    return createMetric({
      metricId,
      sketchId: curSketch.properties.id,
      value: truncate
        ? roundDecimal(intersections.sum, 6, { keepSmallValues: true })
        : intersections.sum,
      extra: {
        sketchName: curSketch.properties.name,
      },
    });
  });

  const metrics = includeChildMetrics ? sketchMetrics : [];

  // Collection level metrics
  if (isSketchCollection(sketch)) {
    let collValue: number = 0;

    // Iterate through feature indices and accumulate collection level sum value
    for (const index of featureIndices) {
      const feature = features[index];

      if (
        sumProperty &&
        feature.properties &&
        feature.properties[sumProperty]
      ) {
        collValue += feature.properties[sumProperty];
      } else {
        collValue += 1;
      }
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

/**
 * Returns the value of features in B that intersect with featureA.  No support for partial, counts the whole feature
 * @param featureA single feature to intersect with featuresB
 * @param featuresB array of features
 * @param sumProperty Property in featuresB with value to sum, if not defined each feature will count as 1
 * @returns Sum of features/feature property which overlap with the sketch, and a list of
 * indices for features that overlap with the sketch to be used in calculating total sum of
 * the sketch collection
 */
export const intersectSum = (
  featureA: Feature<Polygon | MultiPolygon>,
  featuresB: Feature<Polygon | MultiPolygon>[],
  sumProperty?: string,
) => {
  const indices: number[] = [];
  // intersect and get sum of remainder
  const sketchValue = featuresB
    .map((curFeature, index) => {
      // Optimization: can this be done with turf.booleanIntersects?
      const rem = clip(
        featureCollection([featureA, curFeature]),
        "intersection",
      );

      if (!rem) return 0;

      indices.push(index);

      let featureValue = 1;
      if (sumProperty && curFeature.properties![sumProperty] >= 0)
        featureValue = curFeature.properties![sumProperty];
      return featureValue;
    })
    .reduce((valueSoFar, curValue) => valueSoFar + curValue, 0);
  return { sum: sketchValue, indices: indices };
};
