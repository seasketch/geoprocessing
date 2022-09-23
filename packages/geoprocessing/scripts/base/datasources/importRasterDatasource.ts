import path from "path";
import { $ } from "zx";
import fs from "fs-extra";
import {
  Histogram,
  Polygon,
  FeatureCollection,
  KeyStats,
  InternalRasterDatasource,
  ImportRasterDatasourceOptions,
  ImportRasterDatasourceConfig,
  ClassStats,
  Datasource,
} from "../../../src/types";
import {
  datasourceConfig,
  getDatasetBucketName,
  getJsonFilename,
  getCogFilename,
  isInternalVectorDatasource,
} from "../../../src/datasources";
import { isPolygonFeature } from "../../../src/helpers";
import { loadCogWindow } from "../../../src/dataproviders/cog";
import { createOrUpdateDatasource } from "./datasources";

import ProjectClientBase from "../../../src/project/ProjectClientBase";

// @ts-ignore
import geoblaze from "geoblaze";

import dissolve from "@turf/dissolve";

export async function importRasterDatasource<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportRasterDatasourceOptions,
  extraOptions: {
    newDatasourcePath?: string;
    newDstPath?: string;
    srcUrl?: string;
  }
) {
  const { newDatasourcePath, newDstPath } = extraOptions;
  const config = await genRasterConfig(projectClient, options, newDstPath);

  // Ensure dstPath is created
  fs.ensureDirSync(config.dstPath);

  await genCog(config);

  const tempPort = 8001;
  const url = `${projectClient.dataBucketUrl(true, tempPort)}${getCogFilename(
    config.datasourceId
  )}`;
  console.log(
    `Fetching raster to calculate stats from temp file server ${url}`
  );
  const raster = await geoblaze.load(url);

  const classStatsByProperty = await genRasterKeyStats(
    config,
    raster,
    config.filterDatasource
      ? projectClient.getDatasourceById(config.filterDatasource)
      : undefined
  );
  console.log("Stats calculated");

  const timestamp = new Date().toISOString();

  const newVectorD: InternalRasterDatasource = {
    src: config.src,
    band: config.band,
    geo_type: "raster",
    datasourceId: config.datasourceId,
    formats: config.formats,
    created: timestamp,
    lastUpdated: timestamp,
    keyStats: classStatsByProperty,
    noDataValue: config.noDataValue,
    measurementType: config.measurementType,
  };

  await createOrUpdateDatasource(newVectorD, newDatasourcePath);
  return newVectorD;
}

/** Takes import options and creates full import config */
export function genRasterConfig<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportRasterDatasourceOptions,
  newDstPath?: string
): ImportRasterDatasourceConfig {
  let {
    geo_type,
    src,
    datasourceId,
    band,
    formats = datasourceConfig.importDefaultRasterFormats,
    noDataValue,
    measurementType,
    filterDatasource,
  } = options;

  if (!band) band = 0;

  const config: ImportRasterDatasourceConfig = {
    geo_type,
    src,
    dstPath: newDstPath || datasourceConfig.defaultDstPath,
    band,
    datasourceId,
    package: projectClient.package,
    gp: projectClient.geoprocessing,
    formats,
    noDataValue,
    measurementType,
    filterDatasource,
  };

  return config;
}

/** Returns classes for datasource.  If classKeys not defined then will return a single class with datasourceID */
export async function genRasterKeyStats(
  options: ImportRasterDatasourceConfig,
  raster: any,
  ds?: Datasource
): Promise<KeyStats> {
  // Optional filter polygon for raster precalc
  const filterPoly = await (async () => {
    if (!ds) return undefined;
    if (isInternalVectorDatasource(ds)) {
      const jsonFilename = path.join("./data/dist", getJsonFilename(ds));
      const polys = fs.readJsonSync(jsonFilename) as FeatureCollection<Polygon>;
      const filterPoly = dissolve(polys).features[0];
      console.log(`Using filterDatasource ${options.filterDatasource}`);
      if (isPolygonFeature(filterPoly)) {
        return filterPoly;
      } else {
        `Expected datasource ${ds.datasourceId} to contain a single polygon feature`;
      }
    } else {
      throw new Error(
        `Expected ${ds.datasourceId} to be an internal vector datasource`
      );
    }
  })();

  // continous - sum
  const sum = (() => {
    if (options.measurementType !== "quantitative") {
      return null;
    }
    console.log("start sum");
    console.log("raster", raster);
    console.log("filterPoly", filterPoly);
    return geoblaze.sum(raster, filterPoly)[0] as number;
  })();

  console.log("sum", sum);

  // categorical - histogram, count by class
  const classStats: ClassStats = (() => {
    console.log("measurementType", options.measurementType);
    if (options.measurementType !== "categorical") return {};

    const histogram = geoblaze.histogram(raster) as Histogram;
    console.log("histogram");
    console.log(histogram);
    if (!histogram) throw new Error("Histogram not returned");
    // convert histogram to classStats
    const classStats = Object.keys(histogram).reduce<ClassStats>(
      (statsSoFar, curClass) => {
        return {
          ...statsSoFar,
          [curClass]: {
            count: histogram[curClass],
          },
        };
      },
      {}
    );
    console.log("classStats", classStats);
    return classStats;
  })();

  console.log("class stats", classStats);

  const totalStats = {
    sum,
    count: null,
    area: null,
  };

  return {
    ...classStats,
    total: {
      total: totalStats,
    },
  };
}

export async function genCog(config: ImportRasterDatasourceConfig) {
  const { src } = config;
  const warpDst = getCogPath(config.dstPath, config.datasourceId, "_4326");
  const dst = getCogPath(config.dstPath, config.datasourceId);
  await $`gdalwarp -t_srs "EPSG:4326" ${src} ${warpDst}`;
  await $`gdal_translate -b ${config.band} -r nearest -of COG -stats ${warpDst} ${dst}`;
  await $`rm ${warpDst}`;
  await $`rm ${warpDst}.aux.xml`;
}

export function getCogPath(
  dstPath: string,
  datasourceId: string,
  postfix?: string
) {
  return path.join(dstPath, datasourceId) + (postfix ? postfix : "") + ".tif";
}
