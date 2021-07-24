import { Point, Polygon, Feature, BBox } from "geojson";
import { Georaster } from "./georaster";

type GeoblazeBBox = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
};

interface HistogramOptions {
  scaleType: "nominal" | "ratio";
  /** required for ratio scaleType */
  numClasses?: number;
  /** required for ratio scaleType */
  classType?: "equal-interval" | "quantile";
}

interface Histogram {
  [binKey: string]: number;
}

// Some geoblaze methods accept a geometry, and its accepted in a variety of
// forms.  These types group them for easy reuse
type InputPolygon = number[][][] | Polygon | Feature<Polygon>;
type InputPoint = number[] | Point | Feature<Point>;
type InputBBox = BBox | GeoblazeBBox;

export type bandArithmetic = (
  raster: Georaster,
  operation: string
) => Promise<Georaster>;

export type get = (
  raster: Georaster,
  geom: InputBBox | null | undefined,
  flat: boolean
) => number[][] | number[][][];

export type histogram = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
  options: HistogramOptions
) => Histogram[];

export type identify = (
  raster: Georaster,
  geom: string | InputPoint | null | undefined
) => number[];

export type load = (urlOrFile: object | string) => Promise<Georaster>;

export type max = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined
) => number[];

export type mean = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined
) => number[];

export type median = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined
) => number[];

export type min = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined
) => number[];

export type mode = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined
) => number[];

export type rasterCalculator = (
  raster: Georaster,
  operation: ((...cellValuesPerBand: number[]) => number) | string
) => Promise<Georaster>;

export type sum = (
  raster: Georaster,
  geom: string | InputPolygon | null | undefined,
  test?: (cellValue: number) => boolean,
  debug?: boolean
) => number[];
