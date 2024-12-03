import { Metric, MetricDimension, StatsObject } from "../../types/index.js";
import { roundDecimal } from "../../helpers/index.js";
import { createMetric } from "../../metrics/index.js";

/**
 * Converts an array of geoblaze raster StatsObject to an array of Metrics
 * @param statsObjects
 * @param sketchId
 * @param extra
 */
export const rasterStatsToMetrics = (
  statsObjects: StatsObject[],
  options: {
    /** Optional metricId to be assigned.  Don't use if you are calculating more than one stat because you won't be able to tell them apart */
    metricId?: string;
    /** Optional caller-provided prefix to add to metricId in addition to stat name e.g. 'coral' with metrics of 'sum', 'count', 'area' will generate metric IDs of 'coral-sum', 'coral-count', 'coral-area' */
    metricIdPrefix?: string;
    /** Properties to append to metric extra */
    metricPartial?: Partial<Metric>;
    truncate?: boolean;
    /** If multi-band raster, metric property name that raster bands are organized. Defaults to groupId */
    bandMetricProperty?: MetricDimension;
    /** If multi-band raster, array of indexed by band number to assign to bandMetricsProperty ['mangroves','coral']. ['band 1','band 2]  */
    bandMetricValues?: string[];
    /** If categorical raster, set to true */
    categorical?: boolean;
    /** If categorical raster, metric property name that categories are organized. Defaults to classId */
    categoryMetricProperty?: MetricDimension;
    /** If categorical raster, array of values to create metrics for */
    categoryMetricValues?: string[];
  } = {},
): Metric[] => {
  const {
    metricId,
    metricIdPrefix = "",
    metricPartial = {},
    truncate = true,
    bandMetricProperty = "groupId",
    bandMetricValues = [
      ...Array.from({ length: statsObjects.length }).keys(),
    ].map((x) => `band-${x}`),
    categorical = false,
    categoryMetricProperty = "classId",
    categoryMetricValues,
  } = options;
  const metrics: Metric[] = [];
  if (bandMetricProperty === categoryMetricProperty)
    throw new Error(
      "bandMetricProperty and categoryMetricProperty cannot be the same",
    );

  for (const [band, curStats] of statsObjects.entries()) {
    const statNames = Object.keys(curStats);
    for (const statName of statNames) {
      const value = curStats[statName];

      if (categorical) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        categoryMetricValues
          ? categoryMetricValues.forEach((category) => {
              metrics.push(
                createMetric({
                  metricId: metricId ?? `${metricIdPrefix}valid`,
                  value: truncate
                    ? roundDecimal(value[category], 6, {
                        keepSmallValues: true,
                      })
                    : value[category],
                  ...metricPartial,
                  [bandMetricProperty]: bandMetricValues[band],
                  [categoryMetricProperty]: category,
                }),
              );
            })
          : Object.keys(value).forEach((category) => {
              metrics.push(
                createMetric({
                  metricId: metricId ?? `${metricIdPrefix}valid`,
                  value: truncate
                    ? roundDecimal(value[category], 6, {
                        keepSmallValues: true,
                      })
                    : value[category],
                  ...metricPartial,
                  [bandMetricProperty]: bandMetricValues[band],
                  [categoryMetricProperty]: category,
                }),
              );
            });
      } else {
        metrics.push(
          createMetric({
            metricId: metricId ?? `${metricIdPrefix}${statName}`,
            value: truncate
              ? roundDecimal(value, 6, { keepSmallValues: true })
              : value,
            ...metricPartial,
            [bandMetricProperty]: bandMetricValues[band],
          }),
        );
      }
    }
  }
  return metrics;
};
