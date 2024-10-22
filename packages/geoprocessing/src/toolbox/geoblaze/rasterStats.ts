import {
  Polygon,
  GEOBLAZE_RASTER_STATS,
  Sketch,
  SketchCollection,
  Feature,
  MultiPolygon,
  FeatureCollection,
  MetricDimension,
} from "../../types/index.js";
import geoblaze, { Georaster } from "geoblaze";
import {
  StatsObject,
  CalcStatsOptions,
  Histogram,
} from "../../types/geoblaze.js";
import { toRasterProjection, geoblazeDefaultStatValues } from "./geoblaze.js";
import cloneDeep from "lodash/cloneDeep.js";

// default values for all supported raster stats, beyond just geoblaze.stats
export const defaultStatValues = {
  ...cloneDeep(geoblazeDefaultStatValues),
  area: 0,
  histogram: {},
};

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
  /** If categorical raster, array of values to create metrics for.  Any values not provided won't be counted */
  categoryMetricValues?: string[];
}

/**
 * Calculates over 10 different raster statistics, optionally constrains to raster cells overlapping with feature (zonal statistics).
 * Defaults to calculating only sum stat
 * If no cells found, returns 0 or null value for each stat as appropriate.
 */
export const rasterStats = async (
  raster: Georaster,
  options: RasterStatsOptions = {},
) => {
  const {
    numBands = 1,
    stats = ["sum"],
    feature,
    filterFn,
    categorical = false,
    categoryMetricValues,
    ...restCalcOptions
  } = options;

  let statsToCalculate = [...stats];
  let statsToPublish = [...stats];

  // If area is included in stats list, then also include valid stat which is needed to calculate area later
  if (stats.includes("area")) statsToCalculate.push("valid");

  // if categorical, override stats to only include histogram
  if (categorical) {
    statsToCalculate = ["histogram"];
    statsToPublish = ["histogram"];
  }

  const projectedFeat = toRasterProjection(raster, feature);
  const finalStats: StatsObject[] = [];
  let statsByBand: StatsObject[] = [];

  // Package default values for only published stats. Enhance histogram default with categories if provided
  const defaultStats: StatsObject[] = [];
  for (let i = 0; i < numBands; i++) {
    defaultStats[i] = {};
    for (const element of statsToPublish) {
      if (element === "histogram" && categorical && categoryMetricValues) {
        const hist = {};
        for (const c of categoryMetricValues) hist[c] = 0; // load zero for each histogram category
        defaultStats[i][element] = hist;
      } else {
        defaultStats[i][element] = defaultStatValues[element];
      }
    }
  }

  try {
    if (categorical) {
      const histogram = (await geoblaze.histogram(raster, projectedFeat, {
        scaleType: "nominal",
      })) as Histogram[];

      // If no overlap, return default values
      if (
        histogram.length === 0 ||
        (histogram.length === 1 && Object.keys(histogram[0]).length === 0)
      ) {
        return defaultStats;
      } else {
        statsByBand = histogram.map((h) => {
          const hist = {};
          if (!categoryMetricValues || categoryMetricValues.length === 0) {
            return { histogram: h };
          } else {
            for (const c of categoryMetricValues) hist[c] = h[c] ?? 0;
            return { histogram: hist };
          }
        });
      }
    } else {
      statsByBand = await geoblaze.stats(
        raster,
        projectedFeat,
        {
          stats: statsToCalculate.filter((stat) =>
            GEOBLAZE_RASTER_STATS.includes(stat),
          ), // filter to only native geoblaze stats
          ...restCalcOptions,
        },
        filterFn,
      );
    }

    for (const statBand of statsByBand) {
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
            (!categorical &&
              (Number.isNaN(rawValue) || typeof rawValue !== "number"))
              ? defaultStatValues[curStat]
              : rawValue;
          return { ...soFar, [curStat]: curValue };
        },
        {},
      );
      // Transfer calculated stats if valid number
      finalStats.push(finalStatsBand);
    }
  } catch {
    if (process.env.NODE_ENV !== "test")
      console.log(
        "overlapRaster geoblaze.stats threw, meaning no cells with value were found within the geometry",
      );
    return defaultStats;
  }

  return finalStats;
};
