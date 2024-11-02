import fs from "fs-extra";
import path from "node:path";
import {
  datasourcesSchema,
  Datasource,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "../../../src/types/index.js";
import {
  isInternalVectorDatasource,
  isInternalRasterDatasource,
  datasourceConfig,
} from "../../../src/datasources/index.js";
import { getJsonPath } from "./pathUtils.js";
import { isFeatureCollection } from "../../../src/index.js";
import { globalDatasources } from "../../../src/datasources/global.js";

/**
 * Manage datasources for a geoprocessing project
 */

/** Creates or updates datasource record on disk */
export async function createOrUpdateDatasource(
  inputDatasource: Datasource,
  newDatasourcePath?: string,
): Promise<Datasource> {
  let dSources = readDatasources(newDatasourcePath);
  let finalDatasource: Datasource = inputDatasource;

  const dIndex = dSources.findIndex(
    (dSource) => dSource.datasourceId === inputDatasource.datasourceId,
  );
  const dExists = dIndex > -1;
  if (dExists) {
    if (process.env.NODE_ENV !== "test")
      console.log(
        `Updating ${inputDatasource.datasourceId} record in project/datasources.json file`,
      );
    // Update in place
    if (
      isInternalVectorDatasource(inputDatasource) ||
      isInternalRasterDatasource(inputDatasource)
    ) {
      finalDatasource = {
        ...dSources[dIndex],
        ...inputDatasource,
        lastUpdated: new Date().toISOString(),
      };
      dSources[dIndex] = finalDatasource;
    }
  } else {
    if (process.env.NODE_ENV !== "test")
      console.log(
        `Adding ${inputDatasource.datasourceId} record in project/datasources.json file`,
      );
    // Just add onto the end
    dSources = dSources.concat(inputDatasource);
  }

  writeDatasources(dSources, newDatasourcePath);
  return finalDatasource;
}

/**
 * Reads datasources from disk, validates them, and returns deep copy.
 * If datasource file not exist then start a new one and ensure directory exists
 */
export function readDatasources(filePath?: string) {
  // Start with default datasources
  const pds: Datasource[] = globalDatasources as Datasource[];
  // Override datasources path
  const finalFilePath =
    filePath && filePath.length > 0
      ? filePath
      : datasourceConfig.defaultDatasourcesPath;

  const diskPds = (() => {
    try {
      const dsString = fs.readFileSync(finalFilePath).toString();
      try {
        return JSON.parse(dsString);
      } catch {
        throw new Error(
          `Unable to parse JSON found in ${finalFilePath}, fix it and try again`,
        );
      }
    } catch {
      console.log(
        `Datasource file not found at ${finalFilePath}, using default datasources`,
      );
      fs.ensureDirSync(path.dirname(datasourceConfig.defaultDatasourcesPath));
      // fallback to default
      return pds;
    }
  })();

  const result = datasourcesSchema.safeParse(diskPds);
  if (result.success) {
    return result.data;
  } else {
    console.error("Datasources file is invalid.  Did you make manual changes?");
    console.log(JSON.stringify(result.error.issues, null, 2));
    throw new Error("Please fix or report this issue");
  }
}

export function writeDatasources(pd: Datasource[], filePath?: string) {
  const finalFilePath =
    filePath && filePath.length > 0
      ? filePath
      : datasourceConfig.defaultDatasourcesPath;
  fs.writeJSONSync(finalFilePath, pd, { spaces: 2 });
}

/**
 * Reads in vector datasource geojson as FeatureCollection
 * @param ds internal vector datasource to load features, with geojson format available
 * @param dstPath path to directory with datasource
 * @returns datasource features
 */
export function readDatasourceGeojsonById(
  datasourceId: string,
  dstPath: string,
) {
  const jsonPath = getJsonPath(dstPath, datasourceId);
  if (!fs.existsSync(jsonPath))
    throw new Error(`GeoJSON form of datasource does not exist at ${jsonPath}`);
  const polys = fs.readJsonSync(jsonPath);
  if (isFeatureCollection(polys)) {
    return polys as FeatureCollection<Polygon | MultiPolygon>;
  } else
    throw new Error(
      `GeoJSON at ${jsonPath} is not a FeatureCollection. Check datasource.`,
    );
}
