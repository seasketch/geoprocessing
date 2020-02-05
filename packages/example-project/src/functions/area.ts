import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
  sketchArea,
  isCollection
} from "@seasketch/geoprocessing";
import centroid from "@turf/centroid";

export interface AreaResults {
  /** area of the sketch in square meters */
  area: number;
  centroid?: any;
}

async function area(sketch: Sketch | SketchCollection): Promise<AreaResults> {
  return {
    area: sketchArea(sketch),
    // @ts-ignore
    centroid: isCollection(sketch) ? null : centroid(sketch)
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
