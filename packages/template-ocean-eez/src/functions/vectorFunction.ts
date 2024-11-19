import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  Feature,
  isVectorDatasource,
  overlapFeatures,
  getFeatures,
} from "@seasketch/geoprocessing";
import bbox from "@turf/bbox";
import project from "../../project/projectClient.js";
import {
  Metric,
  ReportResult,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing/client-core";
import { clipToGeography } from "../util/clipToGeography.js";

/**
 * vectorFunction: A geoprocessing function that calculates overlap metrics for vector datasources
 * @param sketch - A sketch or collection of sketches
 * @param extraParams
 * @returns Calculated metrics and a null sketch
 */
export async function vectorFunction(
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

  const featuresByDatasource: Record<
    string,
    Feature<Polygon | MultiPolygon>[]
  > = {};

  // Calculate overlap metrics for each class in metric group
  const metricGroup = project.getMetricGroup("vectorFunction");
  const metrics = (
    await Promise.all(
      metricGroup.classes.map(async (curClass) => {
        if (!curClass.datasourceId)
          throw new Error(`Expected datasourceId for ${curClass.classId}`);

        const ds = project.getDatasourceById(curClass.datasourceId);
        if (!isVectorDatasource(ds))
          throw new Error(`Expected vector datasource for ${ds.datasourceId}`);

        const url = project.getDatasourceUrl(ds);

        // Fetch features overlapping with sketch, pull from cache if already fetched
        const features =
          featuresByDatasource[curClass.datasourceId] ||
          (await getFeatures<Feature<Polygon | MultiPolygon>>(ds, url, {
            bbox: sketchBox,
          }));
        featuresByDatasource[curClass.datasourceId] = features;

        // If this is a sub-class, filter by class name
        const finalFeatures =
          curClass.classKey && curClass.classId !== `${ds.datasourceId}_all`
            ? features.filter((feat) => {
                return (
                  feat.geometry &&
                  feat.properties![ds.classKeys[0]] === curClass.classId
                );
              })
            : features;

        // Calculate overlap metrics
        const overlapResult = await overlapFeatures(
          metricGroup.metricId,
          finalFeatures,
          clippedSketch,
        );

        return overlapResult.map(
          (metric): Metric => ({
            ...metric,
            classId: curClass.classId,
            geographyId: curGeography.geographyId,
          }),
        );
      }),
    )
  ).flat();

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
  };
}

export default new GeoprocessingHandler(vectorFunction, {
  title: "vectorFunction",
  description: "Function description",
  timeout: 500, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
});
