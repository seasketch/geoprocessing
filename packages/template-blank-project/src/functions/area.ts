import {
  Sketch,
  SketchCollection,
  GeoprocessingHandler,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import { AllGeoJSON, BBox } from "@turf/helpers";
import turfArea from "@turf/area";

/** Optional caller-provided parameters */
interface GeoprocessingParams {
  /** IDs of one or more sub-regions to operate on */
  geographies?: string[];
}

export interface AreaResults {
  /** area of the sketch in square meters */
  area: number;
  bbox: BBox;
}

async function calculateArea(
  sketch: Sketch | SketchCollection,
  extraParams: GeoprocessingParams = {}
): Promise<AreaResults> {
  return {
    area: turfArea(sketch),
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
