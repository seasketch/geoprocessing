import {
  Sketch,
  SketchCollection,
  NullSketch,
  NullSketchCollection,
  Metric,
  MetricPack,
  MetricDimension,
  MetricProperty,
  DataClass,
  MetricIdTypes,
  GroupMetricSketchAgg,
  MetricDimensions,
  SketchProperties,
} from "../types/index.js";

import {
  groupBy,
  keyBy,
  isSketch,
  isSketchCollection,
  isNullSketch,
  isNullSketchCollection,
  hasOwnProperty,
} from "../helpers/index.js";

import reduce from "lodash/reduce.js";
import cloneDeep from "lodash/cloneDeep.js";

/** Properties used in Metric */
export const MetricProperties = [
  "geographyId",
  "metricId",
  "classId",
  "sketchId",
  "groupId",
  "value",
  "extra",
] as const;

/**
 * Creates a new metric.  Defaults to ID values of null and then copies in passed metric properties
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
    ...cloneDeep(metric),
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
 * Reorders metrics (by mutation) to a consistent key order for readability
 */
export const rekeyMetrics = (
  metrics: Metric[],
  idOrder: MetricProperty[] = [...MetricProperties],
) => {
  return metrics.map((curMetric) => {
    const newMetric: Record<string, any> = {};
    for (const id of idOrder) {
      if (hasOwnProperty(curMetric, id)) newMetric[id] = curMetric[id];
    }
    return newMetric;
  }) as Metric[];
};

/**
 * Converts Metric array to a new MetricPack.
 * Assumes metric dimensions are consistent for each element in the array, and null values are used
 */
export const packMetrics = (inMetrics: Metric[]): MetricPack => {
  const metrics = cloneDeep(inMetrics);
  const pack: MetricPack = { dimensions: [], data: [] };
  if (metrics.length === 0) return pack;

  const keys = Object.keys(metrics[0]).sort();
  pack.dimensions = keys;

  const packData: MetricPack["data"] = [];
  // Pack data values, for-loop for speed
  for (let a = 0, ml = metrics.length; a < ml; ++a) {
    const curMetric = metrics[a];
    const curRow: MetricPack["data"][0] = [];
    for (let b = 0, kl = keys.length; b < kl; ++b) {
      const curKey = keys[b];
      curRow.push(curMetric[curKey]);
    }
    packData.push(curRow);
  }
  pack.data = packData;
  return pack;
};

/**
 * Converts MetricPack to a new Metric array.
 * @param metricPack
 * @returns
 */
export const unpackMetrics = (inMetricPack: MetricPack): Metric[] => {
  const metricPack = cloneDeep(inMetricPack);
  const metrics: Metric[] = [];

  for (let a = 0, ml = metricPack.data.length; a < ml; ++a) {
    const curRow = metricPack.data[a];
    const curMetric = createMetric({});
    for (let b = 0, kl = metricPack.dimensions.length; b < kl; ++b) {
      const curDimension = metricPack.dimensions[b];
      curMetric[curDimension] = curRow[b];
    }
    metrics.push(curMetric);
  }

  return metrics;
};

/**
 * Checks if object is a MetricPack.  Any code inside a block guarded by a conditional call to this function will have type narrowed to MetricPack
 */
export const isMetricPack = (json: any): json is MetricPack => {
  return (
    json &&
    hasOwnProperty(json, "dimensions") &&
    Array.isArray(json.dimensions) &&
    hasOwnProperty(json, "data") &&
    Array.isArray(json.data)
  );
};

/**
 * Checks if object is a Metric array and returns narrowed type
 */
export const isMetricArray = (metrics: any): metrics is Metric[] => {
  return (
    metrics &&
    Array.isArray(metrics) &&
    metrics.length > 0 &&
    isMetric(metrics[0])
  );
};

/**
 * Checks if object is a Metric and returns narrowed type
 */
export const isMetric = (metric: any): metric is Metric => {
  return (
    metric &&
    MetricDimensions.reduce(
      (soFar, curDim) =>
        soFar &&
        hasOwnProperty(metric, curDim) &&
        (metric[curDim] === null || !!metric[curDim]),
      true,
    ) &&
    hasOwnProperty(metric, "value")
  );
};

/**
 * Sorts metrics to a consistent order for readability
 * Defaults to [metricId, classId, sketchId]
 */
export const sortMetrics = (
  metrics: Metric[],
  sortIds: MetricDimension[] = [
    "geographyId",
    "metricId",
    "classId",
    "sketchId",
  ],
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
 * Sorts metrics by ID given a user-defined metric dimension (sortId) and array of ID
 * values in the order they should be sorted
 * Useful for applying a "display order" to metrics
 * Example - sortId = classId, displayOrder = ['sand','gravel','coral']
 * @param metrics
 * @param sortId
 * @param displayOrder
 * @returns new array of sorted metrics
 */
export const sortMetricsDisplayOrder = (
  metrics: Metric[],
  sortId: MetricDimension = "classId",
  displayOrder: string[],
) => {
  return metrics.sort((a, b) => {
    const aVal = a[sortId];
    const bVal = b[sortId];
    if (!aVal || !bVal) return 0;

    const aOrder = displayOrder.indexOf(aVal);
    const bOrder = displayOrder.indexOf(bVal);
    if (aOrder >= 0 && bOrder >= 0) return aOrder - bOrder;
    return 0;
  });
};

/**
 * Returns new sketchMetrics array with first sketchMetric matched set with new value.
 * If no match, returns copy of sketchMetrics.  Does not mutate array in place.
 */
export const findAndUpdateMetricValue = <T extends Metric>(
  sketchMetrics: T[],
  matcher: (sk: T) => boolean,
  value: number,
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
  metricFilter: (metric: M) => boolean,
) => {
  const metric = metrics.find((m) => metricFilter(m));
  if (!metric) throw new Error(`firstMatchingMetrics: metric not found`);
  return metric;
};

/**
 * Given sketch(es), returns ID(s)
 */
export const sketchToId = (
  sketch: Sketch | NullSketch | Sketch[] | NullSketch[],
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
  sketchId: string | string[],
) =>
  metrics.filter((m) =>
    Array.isArray(sketchId)
      ? m.sketchId && sketchId.includes(m.sketchId)
      : sketchId === m.sketchId,
  );

/**
 * Returns metrics with matching sketchId (can be an array of sketchids)
 */
export const metricsWithClassId = <M extends Metric>(
  metrics: M[],
  classId: string | string[],
) =>
  metrics.filter((m) =>
    Array.isArray(classId)
      ? classId.includes(m.classId || "undefined")
      : classId === m.classId,
  );

/**
 * Returns metrics for given sketch (can be an array of sketches)
 */
export const metricsForSketch = <M extends Metric>(
  metrics: M[],
  sketch: Sketch | NullSketch | Sketch[] | NullSketch[],
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
 * Matches numerator metrics with denominator metrics and divides their value,
 * returning a new array of percent metrics.
 * Matches on the optional idProperty given, otherwise defaulting to classId
 * Deep copies and maintains all other properties from the numerator metric
 * If denominator metric has value of 0, returns NaN
 *   NaN allows downstream consumers to understand this isn't just any 0.
 *   It's an opportunity to tell the user that no matter where they put their sketch, there is no way for the value to be more than zero.
 *   For example, the ClassTable component looks for `NaN` metric values and will automatically display 0%,
 *   along with an informative popover explaining that no data class features are within the current geography.
 * @param numerators array of metrics, to be used as numerators (often sketch metrics)
 * @param denominators array of metrics, to be used as denominators (often planning region metrics)
 * @param metricIdOverride optional metricId value to assign to outputted metrics
 * @param idProperty optional id property to match metric with total metric, defaults to classId
 * @returns Metric[] of percent values or NaN if denominator was 0
 */
export const toPercentMetric = (
  numerators: Metric[],
  denominators: Metric[],
  options: {
    metricIdOverride?: string;
    idProperty?: string;
    debug?: boolean;
  } = {},
): Metric[] => {
  const { metricIdOverride, idProperty = "classId", debug = true } = options;

  // Index denominators into precalc totals using idProperty
  const totalsByKey = (() => {
    return keyBy(denominators, (total) => String(total[idProperty]));
  })();

  // For each metric in metric group
  return numerators.map((numerMetric) => {
    if (!numerMetric || numerMetric.value === undefined)
      throw new Error(
        `Malformed numerator metric: ${JSON.stringify(numerMetric)}`,
      );

    const idValue = numerMetric[idProperty];

    if (idValue === null || idValue === undefined)
      throw new Error(
        `Invalid ${idProperty} found in numerator metric: ${JSON.stringify(
          numerMetric,
        )}`,
      );

    const denomMetric = totalsByKey[idValue];
    if (!denomMetric) {
      throw new Error(
        `Missing matching denominator metric with ${idProperty} of ${idValue} for numerator: ${JSON.stringify(
          numerMetric,
        )}`,
      );
    }
    if (denomMetric.value === null || denomMetric.value === undefined) {
      throw new Error(
        `Malformed denominator metric: ${JSON.stringify(numerMetric)}`,
      );
    }

    const value = (() => {
      // Catch 0 or malformed denominator value and return percent metric with 0 value
      if (denomMetric.value === 0) {
        if (debug)
          console.log(
            `Denominator metric with ${idProperty} of ${idValue} has 0 value, returning 0 percent metric`,
          );
        return Number.NaN;
      } else {
        return numerMetric.value / denomMetric.value;
      }
    })();

    // Create percent metric
    return {
      ...cloneDeep(numerMetric),
      value,
      ...(metricIdOverride ? { metricId: metricIdOverride } : {}),
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
  ids: MetricDimension[],
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
    {},
  );
};

/**
 * Flattens class sketch metrics into array of objects, one for each sketch,
 * where each object contains sketch id, sketch name, and all metric values for each class
 * @param metrics List of metrics, expects one metric per sketch and class combination
 * @param classes Data classes represented in metrics
 * @param sketchProperties SketchProperties of sketches represented in metrics
 * @param sortFn Function to sort class configs using Array.sort (defaults to alphabetical by display name)
 * @returns An array of objects with flattened sketch metrics
 */
export const flattenBySketchAllClass = (
  metrics: Metric[],
  classes: DataClass[],
  sketchProperties: SketchProperties[],
  sortFn?: (a: DataClass, b: DataClass) => number,
): Record<string, string | number>[] => {
  const metricsByClassId = groupBy(
    metrics,
    (metric) => metric.classId || "error",
  );

  const sketchRows: Record<string, string | number>[] = [];

  for (const curSketchProperties of sketchProperties) {
    // For current sketch, transform classes into an object mapping classId to its one metric value
    const classMetricAgg = classes
      .sort(sortFn || classSortAlphaDisplay)
      .reduce<Record<string, number>>((aggSoFar, curClass) => {
        // Transform current class metrics into an object mapping each sketchId to its one class Metric
        const sketchMetricsById = metricsByClassId[curClass.classId].reduce<
          Record<string, Metric>
        >((soFar, sm) => {
          soFar[sm.sketchId || "undefined"] = sm;
          return soFar;
        }, {});

        // Map current classId to extracted metric value
        aggSoFar[curClass.classId] =
          sketchMetricsById[curSketchProperties.id].value;

        return aggSoFar;
      }, {});

    sketchRows.push({
      sketchId: curSketchProperties.id,
      sketchName: curSketchProperties.name,
      ...classMetricAgg,
    });
  }

  return sketchRows;
};

/**
 * Aggregates metrics by group
 * @param collection sketch collection metrics are for
 * @param groupMetrics metrics with assigned groupId (except group total metric) and sketchIds for collection
 * @param totalMetrics totals by class
 * @returns one aggregate object for every groupId present in metrics.  Each object includes:
 * [numSketches] - count of child sketches in the group
 * [classId] - a percValue for each classId present in metrics for group
 * [value] - sum of value across all classIds present in metrics for group
 * [percValue] - given sum value across all classIds, contains ratio of total sum across all class IDs
 */
export const flattenByGroupAllClass = (
  collection: SketchCollection | NullSketchCollection,
  groupMetrics: Metric[],
  totalMetrics: Metric[],
): {
  value: number;
  groupId: string;
  percValue: number;
}[] => {
  // Stratify in order by Group -> Collection -> Class. Then flatten
  const metricsByGroup = groupBy(groupMetrics, (m) => m.groupId || "undefined");

  return Object.keys(metricsByGroup).map((curGroupId) => {
    const collGroupMetrics = metricsByGroup[curGroupId].filter(
      (m) =>
        m.sketchId === collection.properties.id && m.groupId === curGroupId,
    );
    const collGroupMetricsByClass = keyBy(
      collGroupMetrics,
      (m) => m.classId || "undefined",
    );

    const classAgg = Object.keys(collGroupMetricsByClass).reduce(
      (rowsSoFar, curClassId) => {
        const groupClassSketchMetrics = groupMetrics.filter(
          (m) =>
            m.sketchId !== collection.properties.id &&
            m.groupId === curGroupId &&
            m.classId === curClassId,
        );

        const curValue = collGroupMetricsByClass[curClassId]?.value;

        const classTotal = firstMatchingMetric(
          totalMetrics,
          (totalMetric) => totalMetric.classId === curClassId,
        ).value;

        return {
          ...rowsSoFar,
          [curClassId]: curValue / classTotal,
          numSketches: groupClassSketchMetrics.length,
          value: rowsSoFar.value + curValue,
        };
      },
      { value: 0 },
    );

    const groupTotal = firstMatchingMetric(
      totalMetrics,
      (m) => !m.groupId, // null groupId identifies group total metric
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
  totals: Metric[],
): GroupMetricSketchAgg[] => {
  const sketchIds = new Set(sketches.map((sk) => sk.properties.id));
  const sketchRows: GroupMetricSketchAgg[] = [];

  // Stratify in order by Group -> Sketch -> Class. Then flatten

  const metricsByGroup = groupBy(groupMetrics, (m) => m.groupId || "undefined");

  for (const curGroupId of Object.keys(metricsByGroup)) {
    const groupSketchMetrics = metricsByGroup[curGroupId].filter(
      (m) => m.sketchId && sketchIds.has(m.sketchId),
    );
    const groupSketchMetricsByClass = groupBy(
      groupSketchMetrics,
      (m) => m.classId || "undefined",
    );
    const groupSketchMetricIds = Object.keys(
      groupBy(groupSketchMetrics, (m) => m.sketchId || "missing"),
    );

    for (const curSketchId of groupSketchMetricIds) {
      const classAgg = Object.keys(groupSketchMetricsByClass).reduce<
        Record<string, number>
      >(
        (classAggSoFar, curClassId) => {
          const classMetric = firstMatchingMetric(
            groupSketchMetricsByClass[curClassId],
            (m) => m.sketchId === curSketchId,
          );
          const classTotal = firstMatchingMetric(
            totals,
            (totalMetric) => totalMetric.classId === curClassId,
          ).value;

          return {
            ...classAggSoFar,
            value: classAggSoFar.value + classMetric.value,
            [curClassId]: classMetric.value / classTotal,
          };
        },
        { value: 0 },
      );

      const groupTotal = firstMatchingMetric(totals, (m) => !m.classId).value;
      sketchRows.push({
        groupId: curGroupId,
        sketchId: curSketchId,
        value: classAgg.value,
        percValue: classAgg.value / groupTotal,
        ...classAgg,
      });
    }
  }
  return sketchRows;
};

/**
 * Given sketch collection, returns IDs of sketches in the collection
 * @deprecated
 */
export const getSketchCollectionChildIds = (
  collection: SketchCollection | NullSketchCollection,
) => collection.features.map((sk) => sk.properties.id);

/**
 * Returns an array of shorthand sketches (id + name) given a Sketch or SketchCollection.
 * Includes a shorthand of parent collection also
 * @deprecated
 */
export const toShortSketches = (
  input: Sketch | SketchCollection | NullSketch | NullSketchCollection,
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
 * Returns one aggregate object for every sketch ID present in metrics,
 * with additional property for each unique value for idProperty present for sketch.
 * Example - idProperty of 'classId', and two classes are present in metrics of 'classA', and 'classB'
 * then each flattened object will have two extra properties per sketch, .classA and .classB, each with the first metric value for that sketch/idProperty found
 * @param metrics - metrics with assigned sketch
 * @param extraIdProperty - optional second id property to cross flatten with idProperty.  Properties will be keyed extraId_idProperty
 * @deprecated
 */
export const flattenSketchAllId = (
  metrics: Metric[],
  idProperty: MetricDimension,
  options: {
    extraIdProperty?: MetricDimension;
  } = {},
): Record<MetricProperty | string, MetricIdTypes>[] => {
  const { extraIdProperty } = options;
  const flatMetrics = groupBy(metrics, (m) => {
    if (m[idProperty]) {
      return m[idProperty] as MetricIdTypes;
    }
    throw new Error(
      `Metric is missing idProperty ${idProperty}: ${JSON.stringify(m)}`,
    );
  });

  const metricsBySketchId = groupBy(
    metrics,
    (metric) => metric.sketchId || "missing",
  );

  const sketchRows = Object.keys(metricsBySketchId).reduce<
    Record<string, MetricIdTypes>[]
  >((rowsSoFar, curSketchId) => {
    const metricAgg = Object.keys(flatMetrics).reduce<
      Record<string, string | number>
    >((aggSoFar, curIdValue) => {
      const curMetric = metricsBySketchId[curSketchId].find(
        (m) => m[idProperty] === curIdValue,
      );

      if (curMetric === undefined) return aggSoFar;
      const prop = extraIdProperty
        ? `${curMetric[extraIdProperty]}_${curMetric[idProperty]}`
        : curMetric[idProperty];

      return {
        ...aggSoFar,

        [prop!]: curMetric?.value || 0,
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
