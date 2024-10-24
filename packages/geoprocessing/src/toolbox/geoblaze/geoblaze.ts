import {
  Polygon,
  Histogram,
  Feature,
  MultiPolygon,
  FeatureCollection,
  BBox,
} from "../../types/index.js";
import geoblaze, { Georaster } from "geoblaze";
import reprojectGeoJSONPlugable from "reproject-geojson/pluggable.js";
import proj4 from "../proj4.js";
import bboxFns from "bbox-fns";

// default values for stats calculated by geoblaze.stats
export const geoblazeDefaultStatValues = {
  count: 0,
  invalid: 0,
  max: null,
  mean: null,
  median: null,
  min: null,
  mode: null,
  product: null,
  range: null,
  sum: 0,
  std: null,
  valid: 0,
  variance: null,
};

/**
 * Returns sum of raster value overlap with geometry.  If no cells with a value are found within the geometry overlap, returns 0.
 */
export const getSum = async (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>,
) => {
  let sum = 0;
  const finalFeat = toRasterProjection(raster, feat);
  try {
    const result = await geoblaze.sum(raster, finalFeat);
    sum = result[0];
  } catch {
    console.log(
      "overlapRaster geoblaze.sum threw, meaning no cells with value were found within the geometry",
    );
  }
  return sum;
};

/**
 * Returns area of valid raster cells (not nodata) overlapping with feature.  If no valid cells found, returns 0.
 */
export const getArea = async (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>,
) => {
  let area = 0;
  const finalFeat = toRasterProjection(raster, feat);
  try {
    // undocumented shortcut lets you pass a test/filter function to stats
    const result = await geoblaze.stats(raster, finalFeat, {
      stats: ["valid"],
    });
    area =
      Number.parseInt(result[0].valid) * raster.pixelHeight * raster.pixelWidth;
  } catch {
    if (process.env.NODE_ENV !== "test")
      console.log(
        "overlapRaster geoblaze.stats threw, meaning no cells with value were found within the geometry",
      );
  }
  return area;
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
  },
): Promise<Histogram> => {
  let histogram = {};
  try {
    histogram = (await geoblaze.histogram(raster, feat, options))[0];
  } catch {
    console.log(
      "overlapRaster geoblaze.histogram threw, there must not be any cells with value overlapping the geometry",
    );
  }
  return histogram;
};

/**
 * Reprojects a feature to the same projection as the raster.
 * @param raster
 * @param feat
 * @returns feature in projection of raster
 * @throws if raster projection is not 4326 (backwards-compatibility) or 6933 (new equal area)
 */
export const toRasterProjection = (
  raster: Georaster,
  feat?:
    | Feature<Polygon | MultiPolygon>
    | FeatureCollection<Polygon | MultiPolygon>,
) => {
  if (raster.projection === 4326) {
    return feat;
  } else if (raster.projection === 6933) {
    const { forward } = proj4("EPSG:4326", "EPSG:6933");
    return reprojectGeoJSONPlugable(feat, {
      reproject: forward,
    });
  } else {
    throw new Error(
      `Unexpected projection for raster: ${raster.projection}. Expected 6933 or 4326`,
    );
  }
};

/**
 * @param raster
 * @returns the bounding box of the raster in WGS84 lat/lon coordinates
 */
export const getRasterBoxSpherical = (raster: Georaster) => {
  if (raster.projection === 4326) {
    const bbox: BBox = [raster.xmin, raster.ymin, raster.xmax, raster.ymax];
    return bbox;
  } else if (raster.projection === 6933) {
    // Reproject back to spherical coordinates
    const { inverse } = proj4("EPSG:4326", "EPSG:6933");
    const rasterBbox: BBox = bboxFns.reproject(
      [raster.xmin, raster.ymin, raster.xmax, raster.ymax],
      inverse,
    );
    return rasterBbox;
  } else {
    throw new Error(
      `Unexpected projection for raster: ${raster.projection}. Expected 6933 or 4326`,
    );
  }
};
