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
          metricId: statName,
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
