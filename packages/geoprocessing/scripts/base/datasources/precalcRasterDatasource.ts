import {
  Histogram,
  Georaster,
  Metric,
  Geography,
  VectorDatasource,
  RasterDatasource,
} from "../../../src/types";
import {
  createMetric,
  InternalRasterDatasource,
  ImportRasterDatasourceConfig,
  getSum,
  getHistogram,
  bboxOverlap,
  BBox,
  ProjectClientBase,
  datasourceConfig,
} from "../../../src";
import { genRasterConfig } from "./genRasterConfig";
import bbox from "@turf/bbox";

// @ts-ignore
import geoblaze from "geoblaze";
import { readDatasourceGeojsonById } from "./datasources";
import { getGeographyFeatures } from "../geographies/helpers";

/**
 * Returns Metric array for raster datasource and geography
 * @param datasource InternalRasterDatasource that's been imported
 * @param geography Geography to be calculated for
 * @returns Metric[]
 */
export async function precalcRasterDatasource<C extends ProjectClientBase>(
  projectClient: C,
  datasource: InternalRasterDatasource,
  /** Input geography */
  geography: Geography,
  /** Geography datasource to get geography from */
  geogDs: VectorDatasource,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
  } = {}
): Promise<Metric[]> {
  // Creates vector config from datasources.json
  const rasterConfig = genRasterConfig(
    projectClient,
    datasource,
    extraOptions.newDstPath
  );

  // const tempPort = 8080;
  const url = projectClient.getDatasourceUrl(rasterConfig, {
    local: true,
    subPath: extraOptions.newDstPath,
  });
  const raster: Georaster = await geoblaze.parse(url);

  const rasterMetrics = await genRasterMetrics(
    raster,
    datasource,
    geography,
    geogDs,
    extraOptions
  );

  return rasterMetrics;
}

/**
 * Returns Metric array for raster datasource and geography
 * @param raster Georaster parsed with geoblaze
 * @param rasterConfig ImportRasterDatasourceConfig, datasource to calculate metrics for
 * @param geography Geography to calculate metrics for
 * @returns Metric[]
 */
export async function genRasterMetrics(
  raster: Georaster,
  datasource: RasterDatasource,
  /** Input geography */
  geography: Geography,
  /** Geography datasource to get geography from */
  geogDs: VectorDatasource,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
  }
): Promise<Metric[]> {
  const dstPath = extraOptions.newDstPath || datasourceConfig.defaultDstPath;

  // Reads in geography vector data as FeatureCollection
  if (!geography) throw new Error(`Expected geography`);
  const geographyFeatureColl = await getGeographyFeatures(
    geography,
    geogDs,
    dstPath
  );

  const rasterBbox: BBox = [raster.xmin, raster.ymin, raster.xmax, raster.ymax];

  // If there's no overlap between geography and raster, return empty metric
  if (!bboxOverlap(bbox(geographyFeatureColl), rasterBbox)) {
    console.log("No overlap -- returning 0 sum");
    return [
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "sum",
        value: 0,
      }),
    ];
  }

  // Creates metric for simple continous raster
  if (datasource.measurementType === "quantitative") {
    return [
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "sum",
        value: await getSum(raster, geographyFeatureColl),
      }),
    ];
  }

  // Creates metrics for categorical raster (histogram, count by class)
  if (datasource.measurementType === "categorical") {
    const metrics: Metric[] = [];
    const histogram = (await getHistogram(raster)) as Histogram;
    if (!histogram) throw new Error("Histogram not returned");

    Object.keys(histogram).forEach((curClass) => {
      metrics.push(
        createMetric({
          geographyId: geography.geographyId,
          classId: datasource.datasourceId + "-" + curClass,
          metricId: "count",
          value: histogram[curClass],
        })
      );
    });

    return metrics;
  }

  throw new Error(
    `Something is malformed, check raster ${datasource.datasourceId} and geography ${geography.datasourceId}]`
  );
}
