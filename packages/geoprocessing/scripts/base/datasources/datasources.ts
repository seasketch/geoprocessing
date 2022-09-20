import fs from "fs-extra";
import path from "path";
import { datasourcesSchema, Datasource, Datasources } from "../../../src/types";
import {
  isInternalVectorDatasource,
  isInternalRasterDatasource,
  datasourceConfig,
} from "../../../src/datasources";

/**
 * Manages datasources for a geoprocessing project
 */

/** Creates or updates datasource record on disk */
export async function createOrUpdateDatasource(
  inputDatasource: Datasource,
  newDatasourcePath?: string
) {
  let dSources = readDatasources(newDatasourcePath);

  const dIndex = dSources.findIndex(
    (dSource) => dSource.datasourceId === inputDatasource.datasourceId
  );
  const dExists = dIndex > -1;
  let finalDatasource: Datasource;
  if (dExists) {
    console.log(
      `Updating ${inputDatasource.datasourceId} record in datasource file`
    );
    // Update in place
    if (
      isInternalVectorDatasource(inputDatasource) ||
      isInternalRasterDatasource(inputDatasource)
    ) {
      dSources[dIndex] = {
        ...dSources[dIndex],
        ...inputDatasource,
        lastUpdated: new Date().toISOString(),
      };
    }
  } else {
    console.log(
      `Adding ${inputDatasource.datasourceId} record in datasource file`
    );
    // Just add onto the end
    dSources = dSources.concat(inputDatasource);
  }

  writeDatasources(dSources, newDatasourcePath);
}

/**
 * Reads datasources from disk, validates them, and returns deep copy.
 * If datasource file not exist then start a new one and ensure directory exists
 */
export function readDatasources(filePath?: string) {
  // Start with default datasources
  let pds: Datasources = [
    {
      datasourceId: "global-clipping-osm-land",
      geo_type: "vector",
      url: "https://d3p1dsef9f0gjr.cloudfront.net/",
      formats: ["subdivided"],
      classKeys: [],
    },
    {
      datasourceId: "global-clipping-eez-land-union",
      geo_type: "vector",
      url: "https://d3muy0hbwp5qkl.cloudfront.net",
      formats: ["subdivided"],
      classKeys: [],
    },
  ];
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
      } catch (err: unknown) {
        throw new Error(
          `Unable to parse JSON found in ${finalFilePath}, fix it and try again`
        );
      }
    } catch (err: unknown) {
      console.log(
        `Datasource file not found at ${finalFilePath}, using default datasources`
      );
      fs.ensureDirSync(path.dirname(datasourceConfig.defaultDatasourcesPath));
      // fallback to default
      return pds;
    }
  })();

  const result = datasourcesSchema.safeParse(diskPds);
  if (!result.success) {
    console.error("Datasources file is invalid.  Did you make manual changes?");
    console.log(JSON.stringify(result.error.issues, null, 2));
    throw new Error("Please fix or report this issue");
  } else {
    return result.data;
  }
}

export function writeDatasources(pd: Datasources, filePath?: string) {
  const finalFilePath =
    filePath && filePath.length > 0
      ? filePath
      : datasourceConfig.defaultDatasourcesPath;
  fs.writeJSONSync(finalFilePath, pd, { spaces: 2 });
}
