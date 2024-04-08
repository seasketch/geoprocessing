import {
  Polygon,
  GEOBLAZE_RASTER_STATS,
  Sketch,
  SketchCollection,
  Feature,
  MultiPolygon,
  FeatureCollection,
  MetricDimension
} from "../../types/index.js";
import geoblaze, { Georaster } from "geoblaze";
import { StatsObject, CalcStatsOptions } from "../../types/geoblaze.js";
import { toRasterProjection, defaultStatValues } from "./geoblaze.js";

/**
 * options accepted by rasterStats
 * @extends CalcStatsOptions - options passed on to calcStats and calc-stats package. See See https://github.com/DanielJDufour/calc-stats/tree/main?tab=readme-ov-file#advanced-usage
 */
export interface RasterStatsOptions extends CalcStatsOptions {
  /** single sketch or sketch collection filter to overlap with raster when calculating metrics. */
  feature?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>;
  /** undocumented filter function (how different from filter option above?), for example a => a > 0 will filter out pixels greater than zero such that 'valid' is number of valid pixels greater than 0 */
  filterFn?: (cellValue: number) => boolean;
  /** Optional number of bands in the raster, defaults to 1, used to initialize zero values */
  numBands?: number;
  /** If categorical raster, set to true */
  categorical?: boolean;
  /** If categorical raster, metric property name that categories are organized. Defaults to classId */
  categoryMetricProperty?: MetricDimension;
  /** If categorical raster, array of values to create metrics for */
  categoryMetricValues?: string[];
}

/**
 * Calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.
 * Defaults to calculating only sum stat
 * If no cells found, returns 0 or null value for each stat as appropriate.
 * If categorical raster, only calculates "valid" stat
 */
export const rasterStats = async (
  raster: Georaster,
  options: RasterStatsOptions = {}
) => {
  const {
    numBands = 1,
    stats = ["sum"],
    feature,
    filterFn,
    categorical = false,
    categoryMetricProperty = "classId",
    categoryMetricValues,
    ...restCalcOptions
  } = options;

  let statsToCalculate = [...stats];
  let statsToPublish = [...stats];

  // If area is included in stats list, then also include valid stat which is needed to calculate area later
  if (stats.includes("area")) statsToCalculate.push("valid");
  // If categorical raster, only calculate valid stat
  if (categorical) {
    statsToCalculate = ["histogram"];
    statsToPublish = ["histogram"];
  }

  const projectedFeat = toRasterProjection(raster, feature);
  let statsByBand: StatsObject[] = [];
  let finalStats: StatsObject[] = [];

  // Build array of default stat values, that can be returned if raster can't be accessed or returns nothing
  let defaultStats: StatsObject[] = [];
  for (let i = 0; i < numBands; i++) {
    defaultStats[i] = {};
    for (let j = 0; j < stats.length; j++) {
      if (stats[j] === "area") defaultStats[i][stats[j]] = 0;
      else defaultStats[i][stats[j]] = defaultStatValues[stats[j]];
    }
  }

  try {
    // If categorical raster, use histogram to calculate valid cells
    statsByBand = categorical
      ? (
          await geoblaze.histogram(raster, projectedFeat, {
            scaleType: "nominal",
          })
        ).map((h: any) => {
          let hist = {};
          if (!categoryMetricValues || categoryMetricValues.length === 0) {
            return { histogram: h };
          } else {
            categoryMetricValues.forEach((c) => (hist[c] = h[c] ?? 0));
            return { histogram: hist };
          }
        })
      : ((await geoblaze.stats(
          raster,
          projectedFeat,
          {
            stats: statsToCalculate.filter((stat) =>
              GEOBLAZE_RASTER_STATS.includes(stat)
            ), // filter to only native geoblaze stats
            ...restCalcOptions,
          },
          filterFn
        )) as StatsObject[]);

    statsByBand.forEach((statBand) => {
      // Calculate area
      if (statsToCalculate.includes("area")) {
        statBand.area = statBand.valid
          ? statBand.valid * raster.pixelHeight * raster.pixelWidth
          : 0;
      }
      // Remove valid stat if only added as temp for calculating area
      if (!statsToPublish?.includes("valid")) delete statBand.valid;

      // Transfer stats, falling back to default values if not a number
      const finalStatsBand: StatsObject = statsToPublish.reduce(
        (soFar, curStat) => {
          const rawValue = statBand[curStat];
          const curValue =
            rawValue === undefined ||
            (!categorical && (isNaN(rawValue) || typeof rawValue !== "number"))
              ? defaultStatValues[curStat]
              : rawValue;
          return { ...soFar, [curStat]: curValue };
        },
        {}
      );
      // Transfer calculated stats if valid number
      finalStats.push(finalStatsBand);
    });
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.stats threw, meaning no cells with value were found within the geometry"
    );
    return defaultStats;
  }

  return finalStats;
};
