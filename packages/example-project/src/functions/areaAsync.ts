import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  sketchArea,
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
  let area = sketchArea(sketch);
  let modifiedArea = area * 5.0;
  return {
    area: modifiedArea,
    bbox: bbox(sketch as AllGeoJSON),
  };
}

export default new GeoprocessingHandler(areaAsync, {
  title: "areaAsync",
  description: "Produces the area of the given sketch asynchronously",
  timeout: 2, // seconds
  memory: 512, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
