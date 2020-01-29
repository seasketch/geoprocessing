import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  sketchArea
} from "@seasketch/geoprocessing";

export interface AreaResults {
  /** area of the sketch in square meters */
  area: number;
}

async function area(
  sketch: Sketch | SketchCollection
): Promise<AreaResults> {
  return {
    area: sketchArea(sketch)
  };
}

export default new GeoprocessingHandler(area, {
  title: "area",
  description: "Calculates the area of the given sketch",
  timeout: 2, // seconds
  memory: 256, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: []
});
