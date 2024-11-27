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
import { clip, intersectInChunksArea, intersectSum } from "./clip.js";
import { createMetric } from "../metrics/index.js";
import { MultiPolygon } from "../types/geojson.js";
import {
  featureCollection,
  featureEach,
  area,
  flatten,
  truncate,
} from "@turf/turf";

interface OverlapFeatureOptions {
  /** Operation to perform, supports area or sum.  Defaults to area */
  operation: "area" | "sum";
  /** Intersection calls are chunked to avoid infinite loop error, defaults to 5000 features */
  chunkSize: number;
  /** If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true */
  includeChildMetrics?: boolean;
  /** Name of feature property to sum */
  sumProperty?: string;
  /** Truncates results to 6 digits, defaults to true */
  truncate?: boolean;
}

/**
 * Calculates overlap between sketch(es) and an array of polygon features.
 * Supports area or sum operation (given sumProperty), defaults to area
 * If sketch collection includes overall and per sketch
 * @param metricId unique metric identifier to assign to each metric
 * @param features to intersect and get overlap stats
 * @param sketch the sketches.  If empty will return 0 result.
 * @param options
 * @returns array of Metric objects
 */
export async function overlapFeatures(
  metricId: string,
  features: Feature<Polygon | MultiPolygon>[],
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | Sketch<Polygon | MultiPolygon>[],
  options?: Partial<OverlapFeatureOptions>,
): Promise<Metric[]> {
  const newOptions: OverlapFeatureOptions = {
    includeChildMetrics: true,
    operation: "area",
    chunkSize: 5000,
    truncate: true,
    ...options,
  };
  const { includeChildMetrics } = newOptions;
  let sumValue: number = 0;
  let isOverlap = false;
  const featureIndices: Set<number> = new Set();
  const sketches = (Array.isArray(sketch) ? sketch : toSketchArray(sketch)).map(
    (s) => truncate(s),
  );
  const finalFeatures = features.map((f) => truncate(f));

  // Create individual sketch metrics
  const sketchMetrics: Metric[] = sketches.map((curSketch) => {
    const intersections = doIntersectOp(
      curSketch as Feature<Polygon | MultiPolygon>,
      finalFeatures as Feature<Polygon | MultiPolygon>[],
      newOptions,
    );

    for (const index of intersections.indices) featureIndices.add(index);

    return createMetric({
      metricId,
      sketchId: curSketch.properties.id,
      value: newOptions.truncate
        ? roundDecimal(intersections.value, 6, { keepSmallValues: true })
        : intersections.value,
      extra: {
        sketchName: curSketch.properties.name,
      },
    });
  });

  // Get overall sum value for collection
  if (sketches.length > 0) {
    const sketchColl = flatten(featureCollection(sketches));
    const sketchArea = area(sketchColl);

    // If sketch overlap, use union
    const sketchUnion = clip(sketchColl, "union");
    // If union is null, then sketch doesn't overlap with features, so set area to 0
    const sketchUnionArea = sketchUnion ? area(sketchUnion) : 0;
    isOverlap = sketchUnionArea < sketchArea;

    const finalSketches =
      sketches.length > 1 && isOverlap && sketchUnion
        ? flatten(sketchUnion)
        : sketchColl;

    if (newOptions.operation === "sum") {
      for (const index of featureIndices) {
        const feature = finalFeatures[index];

        if (
          newOptions.sumProperty &&
          feature.properties![newOptions.sumProperty]
        )
          sumValue += feature.properties![newOptions.sumProperty];
        else sumValue += 1;
      }
    } else {
      featureEach(finalSketches, (feat) => {
        const intersections = doIntersectOp(
          feat,
          finalFeatures as Feature<Polygon | MultiPolygon>[],
          newOptions,
        );
        sumValue += intersections.value;
      });
    }
  }

  // Create collection metric
  const collMetrics: Metric[] = (() => {
    if (isSketchCollection(sketch)) {
      // Push collection with accumulated sumValue
      return [
        createMetric({
          metricId,
          sketchId: sketch.properties.id,
          value: newOptions.truncate
            ? roundDecimal(sumValue, 6, { keepSmallValues: true })
            : sumValue,
          extra: {
            sketchName: sketch.properties.name,
            isCollection: true,
          },
        }),
      ];
    } else {
      return [];
    }
  })();

  return [...(includeChildMetrics ? sketchMetrics : []), ...collMetrics];
}

/**
 * Performs intersect between a feature A and features B and calculates area or sum
 * @private internal function of overlapFeatures
 * @param featureA Single sketch (as a feature)
 * @param featuresB Features to overlap with sketch
 * @param options Includes whether to calculate area or sum, chunk size for area calculation, and property name for sum calculation
 * @returns Value of area/sum and (sum only) array of overlapping features
 */
const doIntersectOp = (
  featureA: Feature<Polygon | MultiPolygon>,
  featuresB: Feature<Polygon | MultiPolygon>[],
  options: OverlapFeatureOptions,
) => {
  const { chunkSize, operation = "area" } = options;
  switch (operation) {
    case "sum": {
      return intersectSum(featureA, featuresB, options.sumProperty);
    }
    default: {
      return intersectInChunksArea(featureA, featuresB, chunkSize);
    }
  }
};
