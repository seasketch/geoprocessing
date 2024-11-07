import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
} from "@seasketch/geoprocessing";
import { area as turfArea } from "@turf/turf";

export interface SimpleResults {
  /** area of sketch within geography in square meters */
  area: number;
}

/**
 *  Simple function with a bespoke result payload
 * @param sketch
 * @param extraParams
 * @returns
 */
async function simpleFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
): Promise<SimpleResults> {
  // Add analysis code
  const area = turfArea(sketch);

  // Custom return type
  return {
    area,
  };
}

export default new GeoprocessingHandler(simpleFunction, {
  title: "simpleFunction",
  description: "Function description",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
});
