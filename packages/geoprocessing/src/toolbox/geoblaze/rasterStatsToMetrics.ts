import { Metric, MetricDimension, StatsObject } from "../../types";
import { roundDecimal } from "../../helpers";
import { createMetric } from "../../metrics";

/**
 * Converts an array of geoblaze raster StatsObjects to an array of Metrics
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
    /** If multi-band raster, metric property name that raster bands are organized.  defaults to classID */
    bandMetricProperty?: MetricDimension;
    /** If multi-band raster, array of indexed by band number to assign to bandMetricsProperty ['mangroves','coral']. ['band 1','band 2]  */
    bandMetricValues?: string[];
  } = {}
): Metric[] => {
  const {
    metricId,
    metricIdPrefix = "",
    metricPartial = {},
    truncate = true,
    bandMetricProperty = "classId",
    bandMetricValues = [...Array(statsObjects.length).keys()].map(
      (x) => `band-${x}`
    ),
  } = options;
  let metrics: Metric[] = [];
  statsObjects.forEach((curStats, band) => {
    const statNames = Object.keys(curStats);
    statNames.forEach((statName) => {
      const value = curStats[statName];
      metrics.push(
        createMetric({
          metricId: metricId ?? `${metricIdPrefix}${statName}`,
          value: truncate
            ? roundDecimal(value, 6, { keepSmallValues: true })
            : value,
          ...metricPartial,
          [bandMetricProperty]: bandMetricValues[band],
        })
      );
    });
  });
  return metrics;
};
