import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  splitSketchAntimeridian,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import { BBox } from "@turf/helpers";
import turfArea from "@turf/area";
import project from "../../project";
import { clipToGeography } from "../util/clipToGeography";

export interface AreaResults {
  /** area of the sketch in square meters */
  area: number;
  bbox: BBox;
}

async function calculateArea(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<AreaResults> {
  // Use caller-provided geographyId if provided
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  // Get geography features, falling back to geography assigned to default-boundary group
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  // Support sketches crossing antimeridian
  const splitSketch = splitSketchAntimeridian(sketch);
  // Clip to portion of sketch within current geography
  const clippedSketch = await clipToGeography(splitSketch, curGeography);
  // Get bounding box of sketch remainder
  const clippedSketchBox = clippedSketch.bbox || bbox(clippedSketch);
  return {
    area: turfArea(clippedSketch),
    bbox: clippedSketchBox,
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
