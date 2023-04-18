import {
  Sketch,
  Feature,
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  SketchCollection,
  toNullSketch,
  overlapFeatures,
  rekeyMetrics,
  sortMetrics,
  getFlatGeobufFilename,
  isInternalVectorDatasource,
  isExternalVectorDatasource,
  isPolygonFeatureArray,
} from "@seasketch/geoprocessing";
import {
  fgbFetchAll,
  getFeatures,
} from "@seasketch/geoprocessing/dataproviders";
import bbox from "@turf/bbox";
import project from "../../project";

const metricGroup = project.getMetricGroup("boundaryAreaOverlap");

export async function boundaryAreaOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const sketchBox = sketch.bbox || bbox(sketch);

  // Fetch boundary features indexed by classId
  const polysByBoundary = (
    await Promise.all(
      metricGroup.classes.map(async (curClass) => {
        if (!curClass.datasourceId) {
          throw new Error(`Missing datasourceId ${curClass.classId}`);
        }
        const ds = project.getDatasourceById(curClass.datasourceId);
        if (
          !isInternalVectorDatasource(ds) &&
          !isExternalVectorDatasource(ds)
        ) {
          throw new Error(`Expected vector datasource for ${ds.datasourceId}`);
        }

        // Fetch only the features that overlap the bounding box of the sketch
        const url = project.getVectorDatasourceUrl(ds);
        const polys = await getFeatures(ds, url, {
          propertyFilter: {
            property: "UNION",
            values: [project.basic.planningAreaId],
          },
          bbox: sketchBox,
        });
        if (!isPolygonFeatureArray(polys)) {
          throw new Error("Expected array of Polygon features");
        }
        return polys;
      })
    )
  ).reduce<Record<string, Feature<Polygon>[]>>((acc, polys, classIndex) => {
    return {
      ...acc,
      [metricGroup.classes[classIndex].classId]: polys,
    };
  }, {});

  const metrics: Metric[] = // calculate area overlap metrics for each class
    (
      await Promise.all(
        metricGroup.classes.map(async (curClass) => {
          const overlapResult = await overlapFeatures(
            metricGroup.metricId,
            polysByBoundary[curClass.classId],
            sketch
          );
          return overlapResult.map(
            (metric): Metric => ({
              ...metric,
              classId: curClass.classId,
            })
          );
        })
      )
    ).reduce(
      // merge
      (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
      []
    );
  console.log("the  metrics", metrics);

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(boundaryAreaOverlap, {
  title: "boundaryAreaOverlap",
  description: "Calculate sketch overlap with boundary polygons",
  executionMode: "async",
  timeout: 40,
  requiresProperties: [],
  memory: 10240,
});
