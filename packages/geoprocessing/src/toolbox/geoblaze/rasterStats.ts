import {
  Polygon,
  GEOBLAZE_RASTER_STATS,
  Sketch,
  SketchCollection,
} from "../../types";
import { Feature, MultiPolygon, FeatureCollection } from "@turf/helpers";
import geoblaze, { Georaster } from "geoblaze";
import { StatsObject, CalcStatsOptions } from "../../types/geoblaze";
import { toRasterProjection, defaultStatValues } from "./geoblaze";
import cloneDeep from "lodash/cloneDeep";

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
}

/**
 * Calculates over 10 different raster stats, optionally constrains to raster cells overlapping with feature.
 * Defaults to calculating only sum stat
 * If no cells found, returns 0 or null value for each stat as appropriate.
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
    ...restCalcOptions
  } = options;
  // If area is included in stats list, then also include valid stat which is needed to calculate area later
  const finalStatNames = [...stats];
  if (stats.includes("area")) finalStatNames.push("valid");

  const projectedFeat = toRasterProjection(raster, feature);
  let statsByBand: StatsObject[] = [];
  let finalStats: StatsObject[] = [];

  // Build array of default stat values, that can be returned if raster can't be accessed or returns nothing
  let defaultStats: StatsObject[] = [];
  for (let i = 0; i < numBands; i++) {
    defaultStats[i] = {};
    for (let j = 0; j < stats.length; j++) {
      defaultStats[i][stats[j]] = defaultStatValues[stats[j]];
    }
  }

  try {
    statsByBand = (await geoblaze.stats(
      raster,
      projectedFeat,
      {
        stats: finalStatNames.filter((stat) =>
          GEOBLAZE_RASTER_STATS.includes(stat)
        ), // filter to only native geoblaze stats
        ...restCalcOptions,
      },
      filterFn
    )) as StatsObject[];

    statsByBand.forEach((statBand) => {
      // Calculate area
      if (finalStatNames.includes("area")) {
        statBand.area = statBand.valid
          ? statBand.valid * raster.pixelHeight * raster.pixelWidth
          : 0;
      }
      // Remove valid stat if only added as temp for calculating area
      if (stats?.includes("valid") === false) {
        delete statBand.valid;
      }

      // Tranfser stats, falling back to default values if not a number
      const finalStatsBand: StatsObject = stats.reduce((soFar, curStat) => {
        const rawValue = statBand[curStat];
        const curValue =
          rawValue !== undefined &&
          isNaN(rawValue) === false &&
          typeof rawValue === "number"
            ? rawValue
            : defaultStatValues[curStat];
        return { ...soFar, [curStat]: curValue };
      }, {});

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
