import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  Polygon,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import { AllGeoJSON, BBox } from "@turf/helpers";
import turfArea from "@turf/area";

export interface CalculateAreaResults {
  /** area of the sketch in square meters */
  area: number;
  bbox: BBox;
}

export async function calculateArea(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<CalculateAreaResults> {
  return {
    area: turfArea(sketch),
    bbox: bbox(sketch as AllGeoJSON),
  };
}

export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Function description",
  timeout: 2, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
