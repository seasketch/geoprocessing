import { Metric, StatsObject } from "../../types";
import { roundDecimal } from "../../helpers";
import { createMetric } from "../../metrics";

/**
 * Converts an array of geoblaze raster StatsObjects to an array of Metrics
 * @param statsObject
 * @param sketchId
 * @param extra
 */
export const rasterStatsToMetrics = (
  statsObject: StatsObject[],
  options: {
    metricExtra?: Partial<Metric>;
    truncate?: boolean;
  } = {}
): Metric[] => {
  const { metricExtra = {}, truncate = false } = options;
  let metrics: Metric[] = [];
  statsObject.forEach((curStats) => {
    const statNames = Object.keys(curStats);
    statNames.forEach((statName) => {
      const metricId = statName; // ToDo - use override
      const value = curStats[statName];
      metrics.push(
        createMetric({
          metricId,
          value: truncate
            ? roundDecimal(value, 6, { keepSmallValues: true })
            : value,
          ...metricExtra,
        })
      );
    });
  });
  return metrics;
};
