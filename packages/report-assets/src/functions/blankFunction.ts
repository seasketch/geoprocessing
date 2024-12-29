import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  Metric,
  DefaultExtraParams,
} from "@seasketch/geoprocessing";
import {
  ReportResult,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";

/**
 * blankFunction for use with create:report command
 */
export async function blankFunction(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
  // Check EXTRA PARAMETERS if you setup report client to pass additional parameters

  // Use PROJECT CLIENT to access project datasources and metric groups if you have them

  // Do DATA FETCHING using bbox of sketch or import a geojson file up top and use directly

  // Run analysis using SPATIAL TOOLBOX or run a WORKER FUNCTION and do it in a separate process

  // Return default ReportResult with a Metric array or change to your own custom return type
  const metrics: Metric[] = [
    {
      metricId: "blankMetric",
      value: 0,
      sketchId: sketch.properties.id,
      classId: null,
      geographyId: null,
      groupId: null,
    },
  ];

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
