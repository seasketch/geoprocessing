import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  VectorDataSource,
  sketchArea,
  isCollection
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import { AllGeoJSON, BBox } from "@turf/helpers";

export interface AreaResults {
  /** area of the sketch in square meters */
  area: number;
  bbox: BBox;
}

async function area(sketch: Sketch | SketchCollection): Promise<AreaResults> {
  return {
    area: sketchArea(sketch),
    bbox: bbox(sketch as AllGeoJSON)
  };
}

export default new GeoprocessingHandler(area, {
  title: "area",
  description: "Produces the area of the given sketch",
  timeout: 2, // seconds
  memory: 256, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: []
});
