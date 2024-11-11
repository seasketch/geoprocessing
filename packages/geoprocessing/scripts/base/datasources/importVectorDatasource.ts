import { getJsonPath, getFlatGeobufPath } from "./pathUtils.js";
import fs from "fs-extra";
import { $ } from "zx";
import {
  InternalVectorDatasource,
  ImportVectorDatasourceOptions,
  ImportVectorDatasourceConfig,
} from "../../../src/types/index.js";
import { getDatasetBucketName } from "../../../src/datasources/index.js";
import { ProjectClientBase } from "../../../src/index.js";
import { createOrUpdateDatasource } from "./datasources.js";
import { publishDatasource } from "./publishDatasource.js";
import { genVectorConfig } from "./genVectorConfig.js";

$.verbose = true;

export async function importVectorDatasource<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportVectorDatasourceOptions,
  extraOptions: {
    doPublish?: boolean;
    newDatasourcePath?: string;
    newDstPath?: string;
    srcBucketUrl?: string;
  },
) {
  const { newDatasourcePath, newDstPath, doPublish = false } = extraOptions;
  const config = await genVectorConfig(projectClient, options, newDstPath);
  // Ensure dstPath is created
  fs.ensureDirSync(config.dstPath);

  await Promise.all(
    config.formats.map(async (format) => {
      if (format === "json") {
        await genGeojson(config);
      } else if (format === "fgb") {
        await genFlatgeobuf(config);
      }
    }),
  );

  if (doPublish) {
    await Promise.all(
      config.formats.map((format) => {
        return publishDatasource(
          config.dstPath,
          format,
          config.datasourceId,
          getDatasetBucketName(config),
        );
      }),
    );
  }

  const timestamp = new Date().toISOString();

  const newVectorD: InternalVectorDatasource = {
    src: config.src,
    layerName: config.layerName,
    geo_type: "vector",
    datasourceId: config.datasourceId,
    formats: config.formats,
    classKeys: config.classKeys,
    created: timestamp,
    lastUpdated: timestamp,
    propertiesToKeep: config.propertiesToKeep,
    explodeMulti: config.explodeMulti,
    precalc: config.precalc,
    propertyFilter: config.propertyFilter,
    bboxFilter: config.bboxFilter,
  };

  await createOrUpdateDatasource(newVectorD, newDatasourcePath);
  return newVectorD;
}

/** Generate fields for SQL query, each wrapped in double quotes to support non-alphanumeric characters */
export function genFields(fieldNames: string[]) {
  return fieldNames.length > 0
    ? fieldNames.map((p) => `"${p}"`).join(",")
    : "*";
}

/** Convert vector datasource to GeoJSON */
export async function genGeojson(config: ImportVectorDatasourceConfig) {
  const { src, propertiesToKeep, layerName } = config;
  const dst = getJsonPath(config.dstPath, config.datasourceId);
  const query = `SELECT ${genFields(propertiesToKeep)} FROM "${layerName}"`;

  fs.removeSync(dst);
  // explode to Polygon or promote to MultiPolygon, GeoJSON supports mixed geometries but intention is to match what is done for Flatgeobuf for consistency
  if (config.explodeMulti === true) {
    await $`ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -lco RFC7946=YES -explodeCollections -wrapdateline -dialect OGRSQL -sql ${query} ${dst} ${src}`;
  } else {
    await $`ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -lco RFC7946=YES -nlt PROMOTE_TO_MULTI -wrapdateline -dialect OGRSQL -sql ${query} ${dst} ${src}`;
  }
}

/** Convert vector datasource to FlatGeobuf */
export async function genFlatgeobuf(config: ImportVectorDatasourceConfig) {
  const { src, propertiesToKeep, layerName } = config;
  const dst = getFlatGeobufPath(config.dstPath, config.datasourceId);
  const query = `SELECT ${genFields(propertiesToKeep)} FROM "${layerName}"`;

  fs.removeSync(dst);
  // explode to Polygon or promote to MultiPolygon, flatgeobuf does not support mixed geometries
  if (config.explodeMulti === true) {
    await $`ogr2ogr -t_srs "EPSG:4326" -f FlatGeobuf -explodeCollections -wrapdateline -dialect OGRSQL -sql ${query} ${dst} ${src}`;
  } else {
    await $`ogr2ogr -t_srs "EPSG:4326" -f FlatGeobuf -nlt PROMOTE_TO_MULTI -wrapdateline -dialect OGRSQL -sql ${query} ${dst} ${src}`;
  }
}
