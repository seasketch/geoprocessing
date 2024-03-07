import { readDatasources } from "./datasources.js";
import {
  Datasource,
  ImportRasterDatasourceOptions,
  importRasterDatasourceOptionsSchema,
  ImportVectorDatasourceOptions,
  importVectorDatasourceOptionsSchema,
} from "../../../src/types/index.js";
import {
  isInternalRasterDatasource,
  isInternalVectorDatasource,
  getDatasetBucketName,
} from "../../../src/datasources/index.js";
import { genVectorConfig } from "./genVectorConfig.js";
import { genRasterConfig } from "./genRasterConfig.js";
import ProjectClientBase from "../../../src/project/ProjectClientBase.js";
import { publishDatasource } from "./publishDatasource.js";

/**
 * Import a dataset into the project.  Must be a src file that OGR or GDAL can read.
 * Importing means stripping unnecessary properties/layers,
 * converting to cloud optimized format, and adding as datasource.
 */
export async function publishDatasources<C extends ProjectClientBase>(
  projectClient: C,
  extraOptions: {
    /** Alternative path to look for datasources than default. useful for testing */
    newDatasourcePath?: string;
    /** Alternative path to store transformed data. useful for testing */
    newDstPath?: string;
    /** string/regular expression matching on datasourceID or array of datasource IDs */
    matcher?: string | string[];
  } = {}
): Promise<Datasource[]> {
  const { newDatasourcePath, newDstPath, matcher } = extraOptions;

  const allDatasources = await readDatasources(newDatasourcePath);
  const finalDatasources = (() => {
    if (!matcher) {
      return allDatasources;
    } else if (Array.isArray(matcher)) {
      const filteredDs = allDatasources.filter((ds) =>
        matcher.includes(ds.datasourceId)
      );
      return filteredDs;
    } else {
      return allDatasources.filter((ds) => ds.datasourceId.match(matcher));
    }
  })();

  if (finalDatasources.length === 0) {
    console.log("No datasources found");
    return [];
  }

  // Process one at a time
  let failed = 0;
  let updated = 0;
  for (const ds of finalDatasources) {
    if (isInternalVectorDatasource(ds) && ds.geo_type === "vector") {
      try {
        console.log(`${ds.datasourceId} vector publish started`);
        // parse import options from datasource record, is just a subset
        const options: ImportVectorDatasourceOptions =
          importVectorDatasourceOptionsSchema.parse(ds);
        // generate full config
        const config = genVectorConfig(projectClient, options, newDstPath);

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

        console.log(`${ds.datasourceId} publish complete`);
        console.log(" ");
        updated += 1;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Publishing datasource ${ds.datasourceId} failed, moving to next`
          );
          failed += 1;
        }
      }
    } else if (isInternalRasterDatasource(ds) && ds.geo_type === "raster") {
      try {
        console.log(`${ds.datasourceId} raster publish started`);
        // parse import options from datasource record, is just a subset
        const options: ImportRasterDatasourceOptions =
          importRasterDatasourceOptionsSchema.parse(ds);
        // generate full config
        const config = genRasterConfig(projectClient, options, newDstPath);

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

        console.log(`${ds.datasourceId} publish complete`);
        console.log();
        updated += 1;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Publishing datasource ${ds.datasourceId} failed, moving to next`
          );
          failed += 1;
        }
      }
    } else {
      console.log(`Skipping ${ds.datasourceId}, publish not supported`);
    }
  }

  console.log(`${updated} datasources published successfully`);
  if (failed > 0) {
    console.log(
      `${failed} datasources failed to publish.  Fix them and try again`
    );
  }

  return finalDatasources;
}
