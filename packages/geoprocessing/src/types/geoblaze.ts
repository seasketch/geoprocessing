import { Point, Polygon, Feature, BBox } from "geojson";
import { Georaster } from "./georaster.js";
import { Nullable } from "./base.js";

type GeoblazeBBox = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

/** Stats supported by geoblaze.stats() function */
export const GEOBLAZE_RASTER_STATS: ReadonlyArray<string> = [
  "valid",
  "invalid",
  "count",
  "min",
  "max",
  "mean",
  "median",
  "mode",
  "range",
  "sum",
  "std",
  "variance",
];
export type GEOBLAZE_RASTER_STAT = (typeof GEOBLAZE_RASTER_STATS)[number];

/** Additional raster stats calculated by geoprocessing library */
export const EXTRA_RASTER_STATS: ReadonlyArray<string> = ["area", "histogram"];
export type EXTRA_RASTER_STAT = (typeof EXTRA_RASTER_STATS)[number];

/** Combined raster stats supported by geoprocessing library */
export const SUPPORTED_RASTER_STATS: ReadonlyArray<string> = [
  ...GEOBLAZE_RASTER_STATS,
  ...EXTRA_RASTER_STATS,
];
export type SUPPORTED_RASTER_STAT = (typeof SUPPORTED_RASTER_STATS)[number];

export interface StatsObject {
  /** Number of cells that are not nodata */
  valid?: number;
  /** Number of nodata cells in raster */
  invalid?: number;
  /** Total number of cells in raster, valid or invalid */
  count?: number;
  /** Area of valid cells in raster in square meters */
  area?: number;
  /** Minimum value of valid cells in raster */
  min?: Nullable<number>;
  /** Maximum value of any one valid cell in raster */
  max?: Nullable<number>;
  /** Mean average value of valid cells in raster */
  mean?: Nullable<number>;
  /** Median average value of valid cells in raster */
  median?: Nullable<number>;
  /** Mode of valid cells in raster */
  mode?: Nullable<number>;
  /** Different between min and max value */
  range?: Nullable<number>;
  /** Sum of all valid cennls in raster */
  sum?: number;
  /** Standard deviation of valid cells in raster */
  std?: Nullable<number>;
  /** Statistical measurement of spread between values in raster */
  variance?: Nullable<number>;
  /** Histogram object, for categorical raster, mapping category IDs to cell count */
  histogram?: Nullable<{}>;
}

/**
 * options accepted by geoblaze.stats() to calc-stats library
 * See https://github.com/DanielJDufour/calc-stats/tree/main?tab=readme-ov-file#advanced-usage
 */
export interface CalcStatsOptions {
  /** Stats to calculate */
  stats?: SUPPORTED_RASTER_STAT[];
  /** Override nodata value, which is ignored in calculations */
  noData?: number;
  /** Whether or not to chunk calculations */
  chunked?: boolean;
  /** Filter function to ignore raster values in stat calc */
  filter?: (index: number, value: number) => boolean;
}

export interface HistogramOptions {
  scaleType: "nominal" | "ratio";
  /** required for ratio scaleType */
  numClasses?: number;
  /** required for ratio scaleType */
  classType?: "equal-interval" | "quantile";
}

export interface Histogram {
  [binKey: string]: number;
}

// Some geoblaze methods accept a geometry, and its accepted in a variety of
// forms.  These types group them for easy reuse
type InputPolygon = number[][][] | Polygon | Feature<Polygon>;
type InputPoint = number[] | Point | Feature<Point>;
type InputBBox = BBox | GeoblazeBBox;

export type bandArithmetic = (
  raster: Georaster,
  operation: string,
) => Promise<Georaster>;

export type get = (
  raster: Georaster,
  geom: InputBBox | null | undefined,
  flat: boolean,
) => number[][] | number[][][];

export type histogram = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
  options: HistogramOptions,
) => Histogram[];

export type identify = (
  raster: Georaster,
  geom: string | InputPoint | null | undefined,
) => number[];

export type load = (urlOrFile: object | string) => Promise<Georaster>;

export type max = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
) => number[];

export type mean = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
) => number[];

export type median = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
) => number[];

export type min = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
) => number[];

export type mode = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
) => number[];

export type rasterCalculator = (
  raster: Georaster,
  operation: ((...cellValuesPerBand: number[]) => number) | string,
) => Promise<Georaster>;

export type sum = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
  test?: (cellValue: number) => boolean,
  debug?: boolean,
) => number[];

export type stats = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
  test?: (cellValue: number) => boolean,
  debug?: boolean,
) => StatsObject[];
