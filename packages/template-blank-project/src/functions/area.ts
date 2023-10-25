import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
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
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  const clippedSketch = await clipToGeography(sketch, curGeography);
  return {
    area: turfArea(clippedSketch),
    bbox: bbox(clippedSketch),
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
