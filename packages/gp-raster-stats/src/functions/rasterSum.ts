import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  isSketchCollection,
} from "@seasketch/geoprocessing";
//@ts-ignore
import geoblaze from "geoblaze";

const rasterUrl =
  "https://mcclintocklab.s3-us-west-2.amazonaws.com/hab_data_clipped.tif";

export interface RasterSumResults {
  /** area of the sketch in square meters */
  sum: number;
}

export async function rasterSum(
  sketch: Sketch | SketchCollection
): Promise<RasterSumResults> {
  const raster = await loadRaster(rasterUrl);
  let rasterSum = 0;
  if (isSketchCollection(sketch)) {
    const sums = await Promise.all(
      sketch.features.map(async (f) => {
        const sum = (await geoblaze.sum(raster, f))[0];
        return sum;
      })
    );
    return {
      sum: sums.reduce((totalSum, sketchSum) => {
        return totalSum + sketchSum;
      }, 0),
    };
  } else {
    return {
      sum: (await geoblaze.sum(raster, sketch))[0],
    };
  }
}

function loadRaster(url: string): Promise<object> {
  return geoblaze.load(rasterUrl);
}

export default new GeoprocessingHandler(rasterSum, {
  title: "rasterSum",
  description: "calculates the sum of a raster",
  timeout: 2, // seconds
  memory: 2048, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
