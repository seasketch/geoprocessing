import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  VectorDataSource,
  sketchArea,
  isCollection,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import { AllGeoJSON, BBox } from "@turf/helpers";

export interface AsyncAreaResults {
  /** area of the sketch in square meters */
  area: number;
  bbox: BBox;
}

async function areaAsync(
  sketch: Sketch | SketchCollection
): Promise<AsyncAreaResults> {
  console.log("running area async...");
  return {
    area: sketchArea(sketch),
    bbox: bbox(sketch as AllGeoJSON),
  };
}

export default new GeoprocessingHandler(areaAsync, {
  title: "areaAsync",
  description: "Produces the area of the given sketch asynchronously",
  timeout: 2, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
