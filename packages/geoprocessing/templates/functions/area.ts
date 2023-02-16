import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import { AllGeoJSON, BBox } from "@turf/helpers";
import area from "@turf/area";

export interface CalculateAreaResults {
  /** area of the sketch in square meters */
  area: number;
  bbox: BBox;
}

async function calculateArea(
  sketch: Sketch | SketchCollection
): Promise<CalculateAreaResults> {
  return {
    area: area(sketch),
    bbox: bbox(sketch as AllGeoJSON),
  };
}

export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Function description",
  timeout: 2, // seconds
  memory: 256, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
