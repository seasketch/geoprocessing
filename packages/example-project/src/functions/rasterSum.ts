import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  sketchArea,
  isCollection,
} from "@seasketch/geoprocessing";
import { getRasterSumInSketch } from "./RasterHelper";

const exampleRaster =
  "https://mcclintocklab.s3-us-west-2.amazonaws.com/hab_data_clipped.tif";

export interface RasterSumResults {
  /** area of the sketch in square meters */
  area: number;
}

async function rasterSum(
  sketch: Sketch | SketchCollection
): Promise<RasterSumResults> {
  let rasterSum: number = -3.0;
  let raster: any;
  if (isCollection(sketch)) {
    //await Promise.all((sumTotal += ));
  } else {
    rasterSum = await sumRaster(sketch);
  }
  return {
    area: rasterSum,
  };
}

async function sumRaster(sketch: Sketch): Promise<number> {
  const sum = await getRasterSumInSketch(exampleRaster, sketch);
  return sum;
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
