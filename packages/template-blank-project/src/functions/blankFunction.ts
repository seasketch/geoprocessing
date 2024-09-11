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
import project from "../../project/projectClient.js";
import {
  ReportResult,
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
} from "@seasketch/geoprocessing/client-core";
import { clipToGeography } from "../util/clipToGeography.js";

export async function blankFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
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
  // const sketchBox = clippedSketch.bbox || bbox(clippedSketch);

  // Add functionality here to return in (most common) Metric[] format
  // Or create new type to return to component

  // Return a report result with metrics and a null sketch
  return {
    metrics: sortMetrics(rekeyMetrics([])),
    sketch: toNullSketch(clippedSketch, true),
  };
}

export default new GeoprocessingHandler(blankFunction, {
  title: "blankFunction",
  description: "Function description",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
