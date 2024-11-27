import {
  Sketch,
  Feature,
  Polygon,
  MultiPolygon,
  SketchCollection,
  Metric,
  Georaster,
} from "../types/index.js";
import {
  genSampleSketchCollection,
  keyBy,
  toSketchArray,
  isSketchCollection,
  groupBy,
  isPolygonFeatureArray,
} from "../helpers/index.js";
import { clip } from "./clip.js";
import { createMetric, firstMatchingMetric } from "../metrics/index.js";
import { overlapFeatures } from "./overlapFeatures.js";
import { overlapArea } from "./overlapArea.js";
import { featureCollection, flatten } from "@turf/turf";
import cloneDeep from "lodash/cloneDeep.js";
import { rasterMetrics } from "./rasterMetrics.js";

type OverlapGroupOperation = (
  metricId: string,
  features: Feature<Polygon>[] | Georaster,
  sc: SketchCollection<Polygon>,
) => Promise<number>;

/**
 * Generate overlap group metrics using rasterMetrics operation
 */
export async function overlapRasterGroupMetrics(options: {
  /** Caller-provided metric ID */
  metricId: string;
  /** Group identifiers - will generate group metric for each, even if result in zero value, so pre-filter if want to limit */
  groupIds: string[];
  /** Sketch - single or collection */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>;
  /** Function that given sketch metric and group name, returns true if sketch is in the group, otherwise false */
  metricToGroup: (sketchMetric: Metric) => string;
  /** The metrics to group */
  metrics: Metric[];
  /** Raster to overlap, keyed by class ID */
  featuresByClass: Record<string, Georaster>;
  /** only generate metrics for groups that sketches match to, rather than all */
  onlyPresentGroups?: boolean;
}): Promise<Metric[]> {
  return overlapGroupMetrics({
    ...options,
    operation: async (
      metricId: string,
      features: Georaster | Feature<Polygon>[],
      sc: SketchCollection<Polygon>,
    ) => {
      if (isPolygonFeatureArray(features)) throw new Error(`Expected raster`);
      const overallGroupMetrics = await rasterMetrics(features, {
        metricId: metricId,
        feature: sc,
      });
      return firstMatchingMetric(
        overallGroupMetrics,
        (m) => !!m.extra?.isCollection,
      ).value;
    },
  });
}

/**
 * Generate overlap group metrics using overlapFeatures operation
 */
export async function overlapFeaturesGroupMetrics(options: {
  /** Caller-provided metric ID */
  metricId: string;
  /** Group identifiers - will generate group metric for each, even if result in zero value, so pre-filter if want to limit */
  groupIds: string[];
  /** Sketch - single or collection */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>;
  /** Function that given sketch metric and group name, returns true if sketch is in the group, otherwise false */
  metricToGroup: (sketchMetric: Metric) => string;
  /** The metrics to group */
  metrics: Metric[];
  /** features to overlap, keyed by class ID, use empty array if overlapArea operation */
  featuresByClass: Record<string, Feature<Polygon>[]>;
  /** only generate metrics for groups that sketches match to, rather than all */
  onlyPresentGroups?: boolean;
}): Promise<Metric[]> {
  return overlapGroupMetrics({
    ...options,
    operation: async (
      metricId: string,
      features: Feature<Polygon>[] | Georaster,
      sc: SketchCollection<Polygon>,
    ) => {
      if (!isPolygonFeatureArray(features))
        throw new Error(`Expected feature array`);

      const overallGroupMetrics = await overlapFeatures(
        metricId,
        features,
        sc,
        {
          includeChildMetrics: false,
        },
      );
      return overallGroupMetrics[0].value;
    },
  });
}

/**
 * Generate overlap group metrics using overlapArea operation
 */
export async function overlapAreaGroupMetrics(options: {
  /** Caller-provided metric ID */
  metricId: string;
  /** Group identifiers */
  groupIds: string[];
  /** Sketch - single or collection */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>;
  /** Function that given sketch metric and group name, returns true if sketch is in the group, otherwise false */
  metricToGroup: (sketchMetric: Metric) => string;
  /** The metrics to group */
  metrics: Metric[];
  classId: string;
  /** area of outer boundary (typically EEZ or planning area) */
  outerArea: number;
  /** only generate metrics for groups that sketches match to, rather than all */
  onlyPresentGroups?: boolean;
}): Promise<Metric[]> {
  return overlapGroupMetrics({
    ...options,
    featuresByClass: { [options.classId]: [] },
    operation: async (
      metricId: string,
      features: Feature<Polygon>[] | Georaster,
      sc: SketchCollection<Polygon>,
    ) => {
      // Calculate just the overall area sum for group
      const overallGroupMetrics = await overlapArea(
        metricId,
        sc,
        options.outerArea,
        {
          includePercMetric: false,
          includeChildMetrics: false,
        },
      );
      return overallGroupMetrics[0].value;
    },
  });
}

/**
 * Given overlap metrics stratified by class and sketch, returns new metrics also stratified by group
 * Assumes a sketch is member of only one group, determined by caller-provided metricToGroup
 * For each group+class, calculates area of overlap between sketches in group and featuresByClass (with overlap between group sketches removed first)
 * Types of metrics returned:
 *  sketch metrics: copy of caller-provided sketch metrics with addition of group ID
 *  overall metric for each group+class: takes sketches in group, subtracts overlap between them and overlap with higher group sketches, and runs operation
 * If a group has no sketches in it, then no group metrics will be included for that group, and group+class metric will be 0
 */
export async function overlapGroupMetrics(options: {
  /** Caller-provided metric ID */
  metricId: string;
  /** Group identifiers */
  groupIds: string[];
  /** Sketch - single or collection */
  sketch: Sketch<Polygon> | SketchCollection<Polygon>;
  /** Function that given sketch metric returns the group ID */
  metricToGroup: (sketchMetric: Metric) => string;
  /** The metrics to group */
  metrics: Metric[];
  /** features to overlap, keyed by class ID, use empty array if overlapArea operation */
  featuresByClass:
    | Record<string, Feature<Polygon>[]>
    | Record<string, Georaster>;
  /** overlap operation, defaults to overlapFeatures */
  operation: OverlapGroupOperation;
  /** only generate metrics for groups that sketches match to, rather than all groupIds */
  onlyPresentGroups?: boolean;
}): Promise<Metric[]> {
  const {
    metricId,
    groupIds,
    sketch,
    metricToGroup,
    metrics,
    featuresByClass,
    operation,
    onlyPresentGroups = false,
  } = options;
  const classes = Object.keys(featuresByClass);

  // Filter to individual sketch metrics and clone as base for group metrics
  const sketchMetrics = isSketchCollection(sketch)
    ? cloneDeep(metrics).filter((sm) => sm.sketchId !== sketch.properties.id)
    : cloneDeep(metrics).filter((sm) => sm.sketchId === sketch.properties.id);

  // Lookup and add group
  const groupSketchMetrics: Metric[] = sketchMetrics.map((m) => ({
    ...m,
    groupId: metricToGroup(m),
  }));

  // For each group
  const groupMetricsPromises = groupIds.reduce<Promise<Metric[]>[]>(
    (groupMetricsPromisesSoFar, curGroup) => {
      // For each class
      const groupMetricsPromise = classes.reduce<Promise<Metric[]>[]>(
        (classMetricsPromisesSoFar, curClass) => {
          // async iife to wrap in new promise
          const curClassMetricsPromise = (async () => {
            // Filter to cur class metrics
            const curGroupSketchMetrics = groupSketchMetrics.filter(
              (sm) => sm.classId === curClass && sm.metricId === metricId,
            );

            // Optionally, skip this group if not present in metrics
            const curClassGroupIds = onlyPresentGroups
              ? Object.keys(groupBy(curGroupSketchMetrics, (m) => m.groupId!))
              : groupIds;
            if (onlyPresentGroups && !curClassGroupIds.includes(curGroup)) {
              return [];
            }

            const classGroupMetrics = await getClassGroupMetrics({
              sketch,
              groupSketchMetrics: curGroupSketchMetrics,
              groups: groupIds,
              groupId: curGroup,
              metricId,
              features: featuresByClass[curClass],
              operation,
            });

            return classGroupMetrics.map(
              (metric): Metric => ({
                ...metric,
                classId: curClass,
              }),
            );
          })();

          return [...classMetricsPromisesSoFar, curClassMetricsPromise];
        },
        [],
      );
      return [...groupMetricsPromisesSoFar, ...groupMetricsPromise];
    },
    [],
  );

  // Await and unroll result
  const groupMetrics = (await Promise.all(groupMetricsPromises)).flat();

  return groupMetrics;
}

/**
 * Given groupId, returns area of overlap between features and sketches in the group
 * Assumes that groupSketchMetrics and features are pre-filtered to a single class
 */
const getClassGroupMetrics = async (options: {
  sketch: Sketch<Polygon> | SketchCollection<Polygon>;
  groupSketchMetrics: Metric[];
  groups: string[];
  groupId: string;
  metricId: string;
  features: Feature<Polygon>[] | Georaster;
  operation: OverlapGroupOperation;
}): Promise<Metric[]> => {
  const {
    sketch,
    groupSketchMetrics,
    groups,
    groupId,
    metricId,
    features,
    operation,
  } = options;
  const sketches = toSketchArray(sketch);
  const sketchMap = keyBy(sketches, (item) => item.properties.id);

  // Filter to group.  May result in empty list
  const curGroupSketchMetrics: Metric[] = groupSketchMetrics.filter(
    (m) => m.groupId === groupId,
  );
  const results: Metric[] = curGroupSketchMetrics;

  // If collection account for overlap
  if (isSketchCollection(sketch)) {
    // Get IDs of all sketches (non-collection) with current group and collection, from metrics
    const curGroupSketches = curGroupSketchMetrics
      .filter((gm) => gm.groupId === groupId)
      .map((gm) => sketchMap[gm.sketchId!]) // sketchMap will be undefined for collection metrics
      .filter((gm) => !!gm); // so remove undefined

    // Get sketch metrics from higher groups (lower index value) and convert to sketches
    const higherGroupSketchMetrics = groups.reduce<Metric[]>(
      (otherSoFar, otherGroupName) => {
        // Append if lower index than current group
        const groupIndex = groups.indexOf(groupId);
        const otherIndex = groups.indexOf(otherGroupName);

        const otherGroupMetrics = groupSketchMetrics.filter(
          (gm) => gm.groupId === otherGroupName,
        );
        return otherIndex < groupIndex
          ? otherSoFar.concat(otherGroupMetrics)
          : otherSoFar;
      },
      [],
    );
    const higherGroupSketches = Object.values(
      keyBy(higherGroupSketchMetrics, (m) => m.sketchId!),
    ).map((ogm) => sketchMap[ogm.sketchId!]);

    let groupValue: number = 0;
    if (curGroupSketches.length > 1 || higherGroupSketches.length > 0) {
      groupValue = await getReducedGroupAreaOverlap({
        metricId,
        groupSketches: curGroupSketches,
        higherGroupSketches: higherGroupSketches,
        features,
        operation,
      });
    } else {
      groupValue = curGroupSketchMetrics.reduce(
        (sumSoFar, sm) => sm.value + sumSoFar,
        0,
      );
    }

    results.push(
      createMetric({
        groupId: groupId,
        metricId: metricId,
        sketchId: sketch.properties.id,
        value: groupValue,
        extra: {
          sketchName: sketch.properties.name,
          isCollection: true,
        },
      }),
    );
  }

  // If no single sketch metrics for group, add a zero for group
  if (curGroupSketchMetrics.length === 0) {
    results.push(
      createMetric({
        groupId: groupId,
        metricId: metricId,
        sketchId: sketch.properties.id,
        value: 0,
        extra: {
          sketchName: sketch.properties.name,
        },
      }),
    );
  }

  return results;
};

/**
 * Calculates area of overlap between groupSketches and features
 * Removes overlap with higherGroupSketches first
 * If either sketch array is empty it will do the right thing
 */
const getReducedGroupAreaOverlap = async (options: {
  /** metric identifier */
  metricId: string;
  /** sketches in group. */
  groupSketches: Sketch<Polygon>[];
  /** sketches in other groups that take precedence and overlap must be removed.  */
  higherGroupSketches: Sketch<Polygon>[];
  /** polygon features to overlap with */
  features: Feature<Polygon>[] | Georaster;
  operation: OverlapGroupOperation;
}) => {
  const { metricId, groupSketches, higherGroupSketches, features, operation } =
    options;
  // Given current group sketches, subtract area of sketches in higher groups
  const otherOverlap = groupSketches
    .map((groupSketch) =>
      clip(
        featureCollection([groupSketch, ...higherGroupSketches]),
        "difference",
      ),
    )
    .reduce<
      Feature<Polygon | MultiPolygon>[]
    >((rem, diff) => (diff ? rem.concat(diff) : rem), []);
  const otherRemSketches = genSampleSketchCollection(
    featureCollection<Polygon>(
      flatten(featureCollection(otherOverlap)).features,
    ),
  ).features;

  const finalFC = featureCollection(
    higherGroupSketches.length > 0 ? otherRemSketches : groupSketches,
  );
  const finalSC = genSampleSketchCollection(finalFC);

  // Calc just the one overall metric for this group+class
  if (finalSC.features.length === 0) return 0;
  const overallValue = await operation(metricId, features, finalSC);
  return overallValue;
};
