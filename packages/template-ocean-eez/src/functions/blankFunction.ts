import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  Metric,
  DefaultExtraParams,
  getFirstFromParam,
} from "@seasketch/geoprocessing";
import {
  ReportResult,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";
import { bbox } from "@turf/turf";

/**
 * blankFunction for use with create:report command
 */
export async function blankFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
  // Check for client-provided geography, fallback to first geography assigned as default-boundary in metrics.json
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  // Clip portion of sketch outside geography features
  const clippedSketch = await clipToGeography(sketch, curGeography);
  const sketchBox = clippedSketch.bbox || bbox(clippedSketch);

  // Fetch data and run analysis. Or if it's time consuming, start a worker to do it in a separate process

  // Return ReportResult with Metric[] or create your own return type
  const metrics: Metric[] = [];

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)), // sort and rekey for consistent ordering of output
  };
}

export default new GeoprocessingHandler(blankFunction, {
  title: "blankFunction",
  description: "Function description",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
});
