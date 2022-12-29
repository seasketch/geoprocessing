import { $ } from "zx";
import {
  ImportRasterDatasourceOptions,
  ImportVectorDatasourceOptions,
} from "../../../src/types";
import path from "path";

/** Checks that docker is installed and runnable, throws error if not */
export async function verifyWorkspace() {
  try {
    await $`docker info > /dev/null 2>&1`;
  } catch (err: unknown) {
    throw new Error("Docker is not running, please start docker and try again");
  }
  return true;
}

/**
 * Generate cloud-optimized GeoTIFF in geoprocessing workspace
 */
export async function genCog(
  config: ImportRasterDatasourceOptions,
  binPath: string,
  dstPath: string,
  /** raster band number to import */
  band: number
) {
  const { src } = config;
  /** path to src data.  Mounted as volume and accessible as /data/src in container by cmd */
  const inPath = path.dirname(src);
  /** path to data output by cmd.  Mounted as volume and accessible as /data/out in container by cmd */
  const outPath = dstPath;
  /** raster filename to import from inPath */
  const inFile = path.basename(src);
  /** raster filename to output to outPath */
  const outFile = config.datasourceId;

  // console.log("inPath", inPath);
  // console.log("outPath", outPath);
  // console.log("binPath", binPath);
  // console.log("inFile", inFile);
  // console.log("outFile", outFile);
  // console.log("band", band);

  // Uses readlink script to resolve symlinks, because docker can't mount a symlink path
  try {
    await $`docker run --rm -v "$(${binPath}/readlink.sh ${inPath})":/data/in -v "$(${binPath}/readlink.sh ${outPath})":/data/out -v "$(${binPath}/readlink.sh ${binPath})":/data/bin seasketch/geoprocessing-base /data/bin/genCog.sh /data/in/${inFile} /data/out ${outFile} ${band}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Workspace genCog failed");
      throw err;
    }
  }
  return true;
}

/**
 * Generate cloud-optimized GeoTIFF in geoprocessing workspace
 * multi-part geometries will be split into single by default, unless explodeOption is false
 */
export async function genFgb(
  config: ImportVectorDatasourceOptions,
  binPath: string,
  dstPath: string
) {
  const { src, propertiesToKeep } = config;
  /** path to src data.  Mounted as volume and accessible as /data/src in container by cmd */
  const inPath = path.dirname(src);
  /** path to data output by cmd.  Mounted as volume and accessible as /data/out in container by cmd */
  const outPath = dstPath;
  /** raster filename to import from inPath */
  const inFile = path.basename(src);
  /** raster filename to output to outPath */
  const outFile = config.datasourceId;

  const query = `SELECT "${
    propertiesToKeep.length > 0 ? propertiesToKeep.join(",") : "*"
  }" FROM "${config.layerName || config.datasourceId}"`;
  const explodeOption =
    config.explodeMulti === undefined
      ? "-explodecollections"
      : config.explodeMulti === true
      ? "-explodecollections"
      : "";

  // console.log("inPath", inPath);
  // console.log("outPath", outPath);
  // console.log("binPath", binPath);
  // console.log("inFile", inFile);
  // console.log("outFile", outFile);
  // console.log("query", query);
  // console.log("explodeOption", explodeOption);

  try {
    // Uses readlink script to resolve symlinks, because docker can't mount a symlink path
    await $`docker run --rm -v "$(${binPath}/readlink.sh ${inPath})":/data/in -v "$(${binPath}/readlink.sh ${outPath})":/data/out -v "$(${binPath}/readlink.sh ${binPath})":/data/bin seasketch/geoprocessing-base /data/bin/genFgb.sh /data/in/${inFile} /data/out ${outFile} ${query} ${explodeOption}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Workspace genFgb failed");
      throw err;
    }
  }
  return true;
}

/**
 * Generate GeoJSON in geoprocessing workspace
 * multi-part geometries will be split into single by default, unless explodeOption is false
 */
export async function genGeojson(
  config: ImportVectorDatasourceOptions,
  binPath: string,
  dstPath: string
) {
  const { src, propertiesToKeep } = config;
  /** path to src data.  Mounted as volume and accessible as /data/src in container by cmd */
  const inPath = path.dirname(src);
  /** path to data output by cmd.  Mounted as volume and accessible as /data/out in container by cmd */
  const outPath = dstPath;
  /** raster filename to import from inPath */
  const inFile = path.basename(src);
  /** raster filename to output to outPath */
  const outFile = config.datasourceId;

  const query = `SELECT "${
    propertiesToKeep.length > 0 ? propertiesToKeep.join(",") : "*"
  }" FROM "${config.layerName || config.datasourceId}"`;
  const explodeOption =
    config.explodeMulti === undefined
      ? "-explodecollections"
      : config.explodeMulti === true
      ? "-explodecollections"
      : "";

  // console.log("inPath", inPath);
  // console.log("outPath", outPath);
  // console.log("binPath", binPath);
  // console.log("inFile", inFile);
  // console.log("outFile", outFile);
  // console.log("query", query);
  // console.log("explodeOption", explodeOption);

  try {
    // Uses readlink script to resolve symlinks, because docker can't mount a symlink path
    await $`docker run --rm -v "$(${binPath}/readlink.sh ${inPath})":/data/in -v "$(${binPath}/readlink.sh ${outPath})":/data/out -v "$(${binPath}/readlink.sh ${binPath})":/data/bin seasketch/geoprocessing-base /data/bin/genGeojson.sh /data/in/${inFile} /data/out ${outFile} ${query} ${explodeOption}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Workspace genGeojson failed");
      throw err;
    }
  }
  return true;
}
