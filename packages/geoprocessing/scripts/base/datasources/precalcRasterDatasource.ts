import {
  Georaster,
  Metric,
  Geography,
  VectorDatasource,
  RasterDatasource,
} from "../../../src/types/index.js";
import {
  createMetric,
  bboxOverlap,
  BBox,
  ProjectClientBase,
  datasourceConfig,
  getRasterBoxSpherical,
  rasterMetrics,
  loadCog,
} from "../../../src/index.js";
import { bbox } from "@turf/turf";

import geoblaze from "geoblaze";
import { getGeographyFeatures } from "../geographies/helpers.js";

/**
 * Returns Metric array for raster datasource and geography
 * @param datasource InternalRasterDatasource that's been imported
 * @param geography Geography to be calculated for
 * @returns Metric[]
 */
export async function precalcRasterDatasource<C extends ProjectClientBase>(
  projectClient: C,
  datasource: RasterDatasource,
  /** Input geography */
  geography: Geography,
  /** Geography datasource to get geography from */
  geogDs: VectorDatasource,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
    /** Alternative port to fetch data from */
    port?: number;
  } = {},
): Promise<Metric[]> {
  // need 8001 for unit tests
  const url = projectClient.getDatasourceUrl(datasource, {
    local: true,
    subPath: extraOptions.newDstPath,
    port: extraOptions.port || 8001, // use default project port, override such as for tests
  });
  const raster: Georaster = await loadCog(url);

  const rasterMetrics = await precalcRasterMetrics(
    raster,
    datasource,
    geography,
    geogDs,
    extraOptions,
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
export async function precalcRasterMetrics(
  raster: Georaster,
  datasource: RasterDatasource,
  /** Input geography */
  geography: Geography,
  /** Geography datasource to get geography from */
  geogDs: VectorDatasource,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
  },
): Promise<Metric[]> {
  const dstPath = extraOptions.newDstPath || datasourceConfig.defaultDstPath;

  // console.log(
  //   `DATASOURCE: ${datasource.datasourceId}, GEOGRAPHY: ${geography.geographyId}\n`
  // );

  // Reads in geography vector data as FeatureCollection
  if (!geography) throw new Error(`Expected geography`);
  const geographyFeatureColl = await getGeographyFeatures(
    geography,
    geogDs,
    dstPath,
  );
  // console.log("geographyFeatureColl", JSON.stringify(geographyFeatureColl));

  const rasterBbox: BBox = getRasterBoxSpherical(raster);

  // If there's no overlap between geography and raster, return empty metric
  if (!bboxOverlap(bbox(geographyFeatureColl), rasterBbox)) {
    console.log("No overlap -- returning 0 value stats");
    return [
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "valid",
        value: 0,
      }),
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "count",
        value: 0,
      }),
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "sum",
        value: 0,
      }),
      createMetric({
        geographyId: geography.geographyId,
        classId: datasource.datasourceId + "-total",
        metricId: "area",
        value: 0,
      }),
    ];
  }

  // Creates metric for simple continous raster
  if (datasource.measurementType === "quantitative") {
    const metrics = (
      await rasterMetrics(raster, {
        feature: geographyFeatureColl,
        stats: ["valid", "count", "sum", "area"],
        includeChildMetrics: false,
      })
    ).map((m) => ({
      ...m,
      geographyId: geography.geographyId,
      classId: datasource.datasourceId + "-total",
    }));
    return metrics;
  }

  // Creates metrics for categorical raster (histogram, count valid cells by class)
  if (datasource.measurementType === "categorical") {
    const metrics = (
      await rasterMetrics(raster, {
        feature: geographyFeatureColl,
        includeChildMetrics: false,
        categorical: true,
      })
    ).map((m) => ({
      ...m,
      geographyId: geography.geographyId,
      classId: datasource.datasourceId + "-" + m.classId,
    }));
    return metrics;
  }

  throw new Error(
    `Something is malformed, check raster ${datasource.datasourceId} and geography ${geography.datasourceId}]`,
  );
}
