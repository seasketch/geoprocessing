import { Polygon, Histogram } from "../../types";
import { Feature, MultiPolygon, FeatureCollection } from "@turf/helpers";
import geoblaze, { Georaster } from "geoblaze";

/**
 * Returns sum of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getSum = async (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>
) => {
  let sum = 0;
  try {
    const result = await geoblaze.sum(raster, feat);
    sum = result[0];
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.sum threw, meaning no cells with value were found within the geometry"
    );
  }
  return sum;
};

/**
 * Returns histogram of value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getHistogram = async (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>,
  options: {
    scaleType?: "nominal" | "ratio";
    numClasses?: number;
    classType?: "equal-interval" | "quantile";
  } = {
    scaleType: "nominal",
  }
): Promise<Histogram> => {
  let histogram = {};
  try {
    histogram = await geoblaze.histogram(raster, feat, options)[0];
  } catch (err) {
    console.log(
      "overlapRaster geoblaze.histogram threw, there must not be any cells with value overlapping the geometry"
    );
  }
  return histogram;
};
