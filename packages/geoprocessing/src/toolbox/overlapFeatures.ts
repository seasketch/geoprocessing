import { Sketch, SketchCollection, Polygon, Feature, Metric } from "../types";
import {
  toSketchArray,
  isSketchCollection,
  chunk,
  clip,
  clipMultiMerge,
  roundDecimal,
} from "../helpers";
import { createMetric } from "../metrics";
import { featureCollection, MultiPolygon } from "@turf/helpers";
import { featureEach } from "@turf/meta";
import area from "@turf/area";
import flatten from "@turf/flatten";
import truncate from "@turf/truncate";

interface OverlapFeatureOptions {
  /** Operation to perform, supports area or sum.  Defaults to area */
  operation: "area" | "sum";
  /** Intersection calls are chunked to avoid infinite loop error, defaults to 5000 features */
  chunkSize: number;
  /** If sketch collection, will include its child sketch metrics in addition to collection metrics, defaults to true */
  includeChildMetrics?: boolean;
  sumProperty?: string;
  /** Truncates results to 6 digits, defaults to false */
  truncate?: boolean;
}

// ToDo: support
// point - sum of points
// linestring - sum of length
// polygon - sum of area

/**
 * Calculates overlap between sketch(es) and an array of polygon features.
 * Supports area or sum operation (given sumProperty), defaults to area
 * If sketch collection includes overall and per sketch
 */
export async function overlapFeatures(
  metricId: string,
  /** features to intersect and get overlap stats */
  features: Feature<Polygon | MultiPolygon>[],
  /** the sketches.  If empty will return 0 result. */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
    | Sketch<Polygon | MultiPolygon>[],
  options?: Partial<OverlapFeatureOptions>
): Promise<Metric[]> {
  const newOptions: OverlapFeatureOptions = {
    includeChildMetrics: true,
    operation: "area",
    chunkSize: 5000,
    ...(options || {}),
  };
  const { includeChildMetrics } = newOptions;
  let sumValue: number = 0;
  let isOverlap = false;
  const sketches = (Array.isArray(sketch) ? sketch : toSketchArray(sketch)).map(
    (s) => truncate(s)
  );
  const finalFeatures = features.map((f) => truncate(f));

  if (sketches.length > 0) {
    const sketchColl = flatten(featureCollection(sketches));
    const sketchArea = area(sketchColl);

    // If sketch overlap, use union
    const sketchUnion = clip(sketchColl, "union");
    if (!sketchUnion) throw new Error("overlapFeatures - something went wrong");
    const sketchUnionArea = area(sketchUnion);
    isOverlap = sketchUnionArea < sketchArea;

    const finalSketches =
      sketches.length > 1 && isOverlap ? flatten(sketchUnion) : sketchColl;

    if (isOverlap) {
      featureEach(finalSketches, (feat) => {
        const curSum = doIntersect(
          feat,
          finalFeatures as Feature<Polygon | MultiPolygon>[],
          newOptions
        );
        sumValue += curSum;
      });
    }
  }

  let sketchMetrics: Metric[] = sketches.map((curSketch) => {
    let sketchValue: number = doIntersect(
      curSketch as Feature<Polygon | MultiPolygon>,
      finalFeatures as Feature<Polygon | MultiPolygon>[],
      newOptions
    );
    return createMetric({
      metricId,
      sketchId: curSketch.properties.id,
      value: roundDecimal(sketchValue, 6, { keepSmallValues: true }),
      extra: {
        sketchName: curSketch.properties.name,
      },
    });
  });

  if (!isOverlap) {
    sumValue = sketchMetrics.reduce((sumSoFar, sm) => sumSoFar + sm.value, 0);
  }

  const collMetrics: Metric[] = (() => {
    if (isSketchCollection(sketch)) {
      // Push collection with accumulated sumValue
      return [
        createMetric({
          metricId,
          sketchId: sketch.properties.id,
          value: roundDecimal(sumValue, 6, { keepSmallValues: true }),
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
const doIntersect = (
  featureA: Feature<Polygon | MultiPolygon>,
  featuresB: Feature<Polygon | MultiPolygon>[],
  options: OverlapFeatureOptions
) => {
  const { chunkSize, operation = "area" } = options;
  switch (operation) {
    case "sum":
      return getSketchPolygonIntersectSumValue(
        featureA,
        featuresB,
        options.sumProperty
      );
    default:
      return getSketchPolygonIntersectArea(featureA, featuresB, chunkSize);
  }
};

const getSketchPolygonIntersectArea = (
  featureA: Feature<Polygon | MultiPolygon>,
  featuresB: Feature<Polygon | MultiPolygon>[],
  chunkSize: number
) => {
  // chunk to avoid blowing up intersect
  const chunks = chunk(featuresB, chunkSize || 5000);
  // intersect and get area of remainder
  const sketchValue = chunks
    .map((curChunk) => {
      const rem = clipMultiMerge(
        featureA,
        featureCollection(curChunk),
        "intersection"
      );
      return rem;
    })
    .reduce((sumSoFar, rem) => (rem ? area(rem) + sumSoFar : sumSoFar), 0);
  return sketchValue;
};

/**
 * Sums the value of intersecting features.  No support for partial, counts the whole feature
 * @param featureA
 * @param featuresB
 * @param sumProperty
 * @returns
 */
const getSketchPolygonIntersectSumValue = (
  featureA: Feature<Polygon | MultiPolygon>,
  featuresB: Feature<Polygon | MultiPolygon>[],
  /** Property with value to sum, if not defined each feature will count as 1 */
  sumProperty?: string
) => {
  // intersect and get sum of remainder
  const sketchValue = featuresB
    .map((curFeature) => {
      const rem = clip(
        featureCollection([featureA, curFeature]),
        "intersection"
      );
      let count: number = 0;
      if (!rem) {
        count = 0;
      } else if (!sumProperty) {
        count = 1;
      } else if (curFeature.properties![sumProperty] >= 0) {
        count = curFeature.properties![sumProperty];
      } else {
        count = 1;
      }
      return {
        count,
      };
    })
    .reduce((sumSoFar, { count }) => sumSoFar + count, 0);
  return sketchValue;
};
