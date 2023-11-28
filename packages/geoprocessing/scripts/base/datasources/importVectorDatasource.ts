import {
  getJsonPath,
  getFlatGeobufPath,
  getGeopackagePath,
} from "../../../src/datasources";
import fs from "fs-extra";
import { $ } from "zx";
import {
  InternalVectorDatasource,
  ImportVectorDatasourceOptions,
  ImportVectorDatasourceConfig,
} from "../../../src/types";
import { getDatasetBucketName } from "../../../src/datasources";
import { ProjectClientBase } from "../../../src";
import { createOrUpdateDatasource } from "./datasources";
import { publishDatasource } from "./publishDatasource";
import { genVectorConfig } from "./genVectorConfig";

export async function importVectorDatasource<C extends ProjectClientBase>(
  projectClient: C,
  options: ImportVectorDatasourceOptions,
  extraOptions: {
    doPublish?: boolean;
    newDatasourcePath?: string;
    newDstPath?: string;
    srcBucketUrl?: string;
  }
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
    })
  );

  if (doPublish) {
    await Promise.all(
      config.formats.map((format) => {
        return publishDatasource(
          config.dstPath,
          format,
          config.datasourceId,
          getDatasetBucketName(config)
        );
      })
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
  let { src, propertiesToKeep, layerName } = config;
  const dst = getJsonPath(config.dstPath, config.datasourceId);
  const query = `SELECT ${genFields(propertiesToKeep)} FROM "${layerName}"`;
  const explodeOption =
    config.explodeMulti === true ? "-explodecollections" : "";
  fs.removeSync(dst);
  await $`ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -wrapdateline ${explodeOption} -dialect OGRSQL -sql ${query} ${dst} ${src}`;
}

/** Convert vector datasource to FlatGeobuf */
export async function genFlatgeobuf(config: ImportVectorDatasourceConfig) {
  const { src, propertiesToKeep, layerName } = config;
  const temp = getGeopackagePath(config.dstPath, config.datasourceId);
  const dst = getFlatGeobufPath(config.dstPath, config.datasourceId);
  const query = `SELECT ${genFields(propertiesToKeep)} FROM "${layerName}"`;
  const explodeOption =
    config.explodeMulti === true ? "-explodecollections" : "";
  fs.removeSync(dst);
  // explode into temp geopackage in case of mixed single and multipolygon to avoide flatgeobuf error
  await $`ogr2ogr -t_srs "EPSG:4326" -f GPKG -wrapdateline ${explodeOption} -dialect OGRSQL -sql ${query} ${temp} ${src}`;
  // final conversion to flatgeobuf
  await $`ogr2ogr -t_srs "EPSG:4326" -f FlatGeobuf -wrapdateline ${explodeOption} -dialect OGRSQL -sql ${query} ${dst} ${src}`;
  // remove temp
  await $`rm ${temp}`;
}
