import {
  Sketch,
  SketchCollection,
  NullSketch,
  NullSketchCollection,
} from "../types/sketch";
import {
  Metric,
  MetricDimension,
  MetricProperty,
  DataClass,
  MetricIdTypes,
  GroupMetricSketchAgg,
} from "../types/metrics";

import { groupBy, keyBy } from "../helpers";
import {
  isSketch,
  isSketchCollection,
  isNullSketch,
  isNullSketchCollection,
} from "../helpers/sketch";

import reduce from "lodash/reduce";
import cloneDeep from "lodash/cloneDeep";

/** Properties used in Metric */
export const MetricProperties = [
  "metricId",
  "sketchId",
  "classId",
  "groupId",
  "geographyId",
  "value",
  "extra",
] as const;

/**
 * Create a fully defined metric from a partial.  Metric values not provided are initialized to null
 * @param metric - partial metric
 * @returns metric
 */
export const createMetric = (metric: Partial<Metric>): Metric => {
  return {
    metricId: "metric",
    value: 0,
    classId: null,
    groupId: null,
    geographyId: null,
    sketchId: null,
    ...metric,
  };
};

/**
 * Creates fully defined metrics from partial.  Metric values not provided are initialized to null
 * @param metric - partial metrics
 * @returns metrics
 */
export const createMetrics = (metrics: Partial<Metric>[]): Metric[] =>
  metrics.map((m) => createMetric(m));

/**
 * Reorders metrics to a consistent key order for readability
 */
export const rekeyMetrics = (
  metrics: Metric[],
  idOrder: MetricProperty[] = [...MetricProperties]
) => {
  return metrics.map((curMetric) => {
    var newMetric: Record<string, any> = {};
    idOrder.forEach((id) => {
      newMetric[id] = curMetric[id];
    });
    return newMetric;
  }) as Metric[];
};

/**
 * Sorts metrics to a consistent order for readability
 * Defaults to [metricId, classId, sketchId]
 */
export const sortMetrics = (
  metrics: Metric[],
  sortIds: MetricDimension[] = ["metricId", "classId", "sketchId"]
) => {
  return metrics.sort((a, b) => {
    return sortIds.reduce((sortResult, idName) => {
      // if sort result alread found then skip
      if (sortResult !== 0) return sortResult;
      const aVal = a[idName];
      const bVal = b[idName];
      if (aVal && bVal) return aVal.localeCompare(bVal);
      return 0;
    }, 0);
  });
};

/**
 * Returns new sketchMetrics array with first sketchMetric matched set with new value.
 * If no match, returns copy of sketchMetrics.  Does not mutate array in place.
 */
export const findAndUpdateMetricValue = <T extends Metric>(
  sketchMetrics: T[],
  matcher: (sk: T) => boolean,
  value: number
) => {
  const index = sketchMetrics.findIndex(matcher);
  if (index === -1) {
    return [...sketchMetrics];
  } else {
    return [
      ...sketchMetrics.slice(0, index),
      {
        ...sketchMetrics[index],
        value,
      },
      ...sketchMetrics.slice(index + 1),
    ];
  }
};

/**
 * Returns the first metric that returns true for metricFilter
 * @returns
 */
export const firstMatchingMetric = <M extends Metric>(
  metrics: M[],
  metricFilter: (metric: M) => boolean
) => {
  const metric = metrics.find((m) => metricFilter(m));
  if (!metric) throw new Error(`firstMatchingMetrics: metric not found`);
  return metric;
};

/**
 * Given sketch(es), returns ID(s)
 */
export const sketchToId = (
  sketch: Sketch | NullSketch | Sketch[] | NullSketch[]
) =>
  Array.isArray(sketch)
    ? sketch.map((sk) => sk.properties.id)
    : sketch.properties.id;

/**
 * Returns metrics with matching sketchId (can be an array of sketchids)
 */
export const metricsSketchIds = <M extends Metric>(metrics: M[]) =>
  Object.keys(groupBy(metrics, (m) => m.sketchId || "missing"));

/**
 * Returns metrics with matching sketchId (can be an array of sketchids)
 */
export const metricsWithSketchId = <M extends Metric>(
  metrics: M[],
  sketchId: string | string[]
) =>
  metrics.filter((m) =>
    Array.isArray(sketchId)
      ? m.sketchId && sketchId.includes(m.sketchId)
      : sketchId === m.sketchId
  );

/**
 * Returns metrics with matching sketchId (can be an array of sketchids)
 */
export const metricsWithClassId = <M extends Metric>(
  metrics: M[],
  classId: string | string[]
) =>
  metrics.filter((m) =>
    Array.isArray(classId)
      ? classId.includes(m.classId || "undefined")
      : classId === m.classId
  );

/**
 * Returns metrics for given sketch (can be an array of sketches)
 */
export const metricsForSketch = <M extends Metric>(
  metrics: M[],
  sketch: Sketch | NullSketch | Sketch[] | NullSketch[]
) => metricsWithSketchId(metrics, sketchToId(sketch));

/**
 * Sort function to sort report data classes alphabetically by display name
 * @param a
 * @param b
 * @returns
 */
const classSortAlphaDisplay = (a: DataClass, b: DataClass) => {
  const aName = a.display;
  const bName = b.display;
  return aName.localeCompare(bName);
};

/**
 * Returns new metrics with their values transformed to percentage of corresponding totals
 * metrics are paired with total based on classId if present, falling back to metricId
 * Deep copies and maintains all other properties from the original metric
 */
export const toPercentMetric = (
  metrics: Metric[],
  totals: Metric[],
  /** Set percent metrics with new metricId.  Defaults to leaving the same */
  percMetricId?: string
): Metric[] => {
  const totalsByKey = (() => {
    return keyBy(totals, (total) =>
      total.classId ? total.classId : total.metricId
    );
  })();
  return metrics.map((curMetric) => {
    if (!curMetric || curMetric.value === undefined)
      throw new Error(`Malformed metrics: ${JSON.stringify(curMetric)}`);

    const idProperty = curMetric.classId ? "classId" : "metricId";

    const idValue = curMetric[idProperty];
    if (!idValue) throw new Error(`Missing total index: ${idValue}`);

    const value = curMetric[idProperty];
    if (!value)
      throw new Error(
        `Missing metric id property ${idProperty}, ${JSON.stringify(curMetric)}`
      );
    const totalMetric = totalsByKey[idValue];
    if (!totalMetric) {
      throw new Error(
        `Missing total: ${idProperty}: ${JSON.stringify(curMetric)}`
      );
    }
    return {
      ...cloneDeep(curMetric),
      value: curMetric.value / totalMetric.value,
      ...(percMetricId ? { metricId: percMetricId } : {}),
    };
  });
};

/**
 * Recursively groups metrics by ID in order of ids specified to create arbitrary nested hierarchy for fast lookup.
 * Caller responsible for all metrics having the ID properties defined
 * If an id property is not defined on a metric, then 'undefined' will be used for the key
 */
export const nestMetrics = (
  metrics: Metric[],
  ids: MetricDimension[]
): Record<string, any> => {
  const grouped = groupBy(metrics, (curMetric) => curMetric[ids[0]]!);
  if (ids.length === 1) {
    return grouped;
  }
  return reduce(
    grouped,
    (result, groupMetrics, curId) => {
      return {
        ...result,
        [curId]: nestMetrics(groupMetrics, ids.slice(1)),
      };
    },
    {}
  );
};

/**
 * Flattens class sketch metrics into array of objects, one for each sketch,
 * where each object contains sketch id, sketch name, and all metric value for each class
 * @param classMetrics - metric data by class and sketch
 * @param classes - data classes represented in metrics
 * @param sketches - the sketches contained in metrics
 * @returns
 */
export const flattenBySketchAllClass = (
  metrics: Metric[],
  classes: DataClass[],
  sketches: Sketch[] | NullSketch[],
  /** function to sort class configs using Array.sort, defaults to alphabetical by display name */
  sortFn?: (a: DataClass, b: DataClass) => number
): Record<string, string | number>[] => {
  const metricsByClass = groupBy(
    metrics,
    (metric) => metric.classId || "error"
  );
  let sketchRows: Record<string, string | number>[] = [];
  sketches.forEach((curSketch) => {
    const classMetricAgg = classes
      .sort(sortFn || classSortAlphaDisplay)
      .reduce<Record<string, number>>((aggSoFar, curClass) => {
        const sketchMetricsById = metricsByClass[curClass.classId].reduce<
          Record<string, Metric>
        >((soFar, sm) => ({ ...soFar, [sm.sketchId || "undefined"]: sm }), {});
        return {
          ...aggSoFar,
          ...{
            [curClass.classId]:
              sketchMetricsById[curSketch.properties.id].value,
          },
        };
      }, {});
    sketchRows.push({
      sketchId: curSketch.properties.id,
      sketchName: curSketch.properties.name,
      ...classMetricAgg,
    });
  });
  return sketchRows;
};

/**
 * Returns one aggregate object for every groupId present in metrics
 * Each object includes following properties:
 * numSketches - count of child sketches in the group
 * [classId] - a percValue for each classId present in metrics for group
 * value - sum of value across all classIds present in metrics for group
 * percValue - given sum value across all classIds, contains ratio of total sum across all class IDs
 */
export const flattenByGroupAllClass = (
  collection: SketchCollection | NullSketchCollection,
  /** Group metrics for collection and its child sketches */
  groupMetrics: Metric[],
  /** Totals by class */
  totalMetrics: Metric[]
): {
  value: number;
  groupId: string;
  percValue: number;
}[] => {
  // Stratify in order by Group -> Collection -> Class. Then flatten
  const metricsByGroup = groupBy(groupMetrics, (m) => m.groupId || "undefined");

  return Object.keys(metricsByGroup).map((curGroupId) => {
    const collGroupMetrics = metricsByGroup[curGroupId].filter(
      (m) => m.sketchId === collection.properties.id && m.groupId === curGroupId
    );
    const collGroupMetricsByClass = keyBy(
      collGroupMetrics,
      (m) => m.classId || "undefined"
    );

    const classAgg = Object.keys(collGroupMetricsByClass).reduce(
      (rowsSoFar, curClassId) => {
        const groupClassSketchMetrics = groupMetrics.filter(
          (m) =>
            m.sketchId !== collection.properties.id &&
            m.groupId === curGroupId &&
            m.classId === curClassId
        );

        const curValue = collGroupMetricsByClass[curClassId]?.value;

        const classTotal = firstMatchingMetric(
          totalMetrics,
          (totalMetric) => totalMetric.classId === curClassId
        ).value;

        return {
          ...rowsSoFar,
          [curClassId]: curValue / classTotal,
          numSketches: groupClassSketchMetrics.length,
          value: rowsSoFar.value + curValue,
        };
      },
      { value: 0 }
    );

    const groupTotal = firstMatchingMetric(
      totalMetrics,
      (m) => !m.classId
    ).value;
    return {
      groupId: curGroupId,
      percValue: classAgg.value / groupTotal,
      ...classAgg,
    };
  });
};

/**
 * Flattens group class metrics, one for each group and sketch.
 * Each object includes the percValue for each class, and the total percValue with classes combined
 * groupId, sketchId, class1, class2, ..., total
 * @param groupMetrics - group metric data
 * @param totalValue - total value with classes combined
 * @param classes - class config
 */
export const flattenByGroupSketchAllClass = (
  /** ToDo: is this needed? can the caller just pre-filter groupMetrics? */
  sketches: Sketch[] | NullSketch[],
  /** Group metrics for collection and its child sketches */
  groupMetrics: Metric[],
  /** Totals by class */
  totals: Metric[]
): GroupMetricSketchAgg[] => {
  const sketchIds = sketches.map((sk) => sk.properties.id);
  let sketchRows: GroupMetricSketchAgg[] = [];

  // Stratify in order by Group -> Sketch -> Class. Then flatten

  const metricsByGroup = groupBy(groupMetrics, (m) => m.groupId || "undefined");

  Object.keys(metricsByGroup).forEach((curGroupId) => {
    const groupSketchMetrics = metricsByGroup[curGroupId].filter(
      (m) => m.sketchId && sketchIds.includes(m.sketchId)
    );
    const groupSketchMetricsByClass = groupBy(
      groupSketchMetrics,
      (m) => m.classId || "undefined"
    );
    const groupSketchMetricIds = Object.keys(
      groupBy(groupSketchMetrics, (m) => m.sketchId || "missing")
    );

    groupSketchMetricIds.forEach((curSketchId) => {
      const classAgg = Object.keys(groupSketchMetricsByClass).reduce<
        Record<string, number>
      >(
        (classAggSoFar, curClassId) => {
          const classMetric = firstMatchingMetric(
            groupSketchMetricsByClass[curClassId],
            (m) => m.sketchId === curSketchId
          );
          const classTotal = firstMatchingMetric(
            totals,
            (totalMetric) => totalMetric.classId === curClassId
          ).value;

          return {
            ...classAggSoFar,
            value: classAggSoFar.value + classMetric.value,
            [curClassId]: classMetric.value / classTotal,
          };
        },
        { value: 0 }
      );

      const groupTotal = firstMatchingMetric(totals, (m) => !m.classId).value;
      sketchRows.push({
        groupId: curGroupId,
        sketchId: curSketchId,
        value: classAgg.value,
        percValue: classAgg.value / groupTotal,
        ...classAgg,
      });
    });
  });
  return sketchRows;
};

//// DEPRECATED

/**
 * UNUSED
 * Given sketch collection, returns IDs of sketches in the collection
 */
export const getSketchCollectionChildIds = (
  collection: SketchCollection | NullSketchCollection
) => collection.features.map((sk) => sk.properties.id);

/**
 * UNUSED
 * Returns an array of shorthand sketches (id + name) given a Sketch or SketchCollection.
 * Includes a shorthand of parent collection also
 */
export const toShortSketches = (
  input: Sketch | SketchCollection | NullSketch | NullSketchCollection
): { id: string; name: string }[] => {
  if (isSketch(input) || isNullSketch(input)) {
    return [{ id: input.properties.id, name: input.properties.name }];
  } else if (isSketchCollection(input) || isNullSketchCollection(input)) {
    return [
      { id: input.properties.id, name: input.properties.name },
      ...input.features.map((sk) => ({
        id: sk.properties.id,
        name: sk.properties.name,
      })),
    ];
  }
  throw new Error("invalid input, must be Sketch or SketchCollection");
};

/**
 * UNUSED
 * Returns one aggregate object for every sketch ID present in metrics,
 * with additional property for each unique value for idProperty present for sketch.
 * Example - idProperty of 'classId', and two classes are present in metrics of 'classA', and 'classB'
 * then each flattened object will have two extra properties per sketch, .classA and .classB, each with the first metric value for that sketch/idProperty found
 * @param metrics - metrics with assigned sketch
 * @param extraIdProperty - optional second id property to cross flatten with idProperty.  Properties will be keyed extraId_idProperty
 */
export const flattenSketchAllId = (
  metrics: Metric[],
  idProperty: MetricDimension,
  options: {
    extraIdProperty?: MetricDimension;
  } = {}
): Record<MetricProperty | string, MetricIdTypes>[] => {
  const { extraIdProperty } = options;
  const flatMetrics = groupBy(metrics, (m) => {
    if (m[idProperty]) {
      return m[idProperty] as MetricIdTypes;
    }
    throw new Error(
      `Metric is missing idProperty ${idProperty}: ${JSON.stringify(m)}`
    );
  });

  const metricsBySketchId = groupBy(
    metrics,
    (metric) => metric.sketchId || "missing"
  );

  const sketchRows = Object.keys(metricsBySketchId).reduce<
    Record<string, MetricIdTypes>[]
  >((rowsSoFar, curSketchId) => {
    const metricAgg = Object.keys(flatMetrics).reduce<
      Record<string, string | number>
    >((aggSoFar, curIdValue) => {
      const curMetric = metricsBySketchId[curSketchId].find(
        (m) => m[idProperty] === curIdValue
      );

      if (curMetric === undefined) return aggSoFar;
      const prop = extraIdProperty
        ? `${curMetric[extraIdProperty]}_${curMetric[idProperty]}`
        : curMetric[idProperty];

      return {
        ...aggSoFar,
        ...{
          [prop!]: curMetric?.value || 0,
        },
      };
    }, {});

    return [
      ...rowsSoFar,
      {
        sketchId: curSketchId,
        ...metricAgg,
      },
    ];
  }, []);
  return sketchRows;
};
