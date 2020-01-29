import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  sketchArea
} from "@seasketch/geoprocessing";

export interface TestResults {
  /** area of the sketch in square meters */
  area: number;
}

async function test(
  sketch: Sketch | SketchCollection
): Promise<TestResults> {
  return {
    area: sketchArea(sketch)
  };
}

export default new GeoprocessingHandler(test, {
  title: "test",
  description: "Test function creation",
  timeout: 2, // seconds
  memory: 256, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: []
});
