import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  sketchArea
} from "@seasketch/geoprocessing";

export interface CalculateAreaResults {
  /** area of the sketch in square meters */
  area: number;
}

async function calculateArea(
  sketch: Sketch | SketchCollection
): Promise<CalculateAreaResults> {
  return {
    area: sketchArea(sketch)
  };
}

export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Function description",
  timeout: 2, // seconds
  memory: 256, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: []
});
