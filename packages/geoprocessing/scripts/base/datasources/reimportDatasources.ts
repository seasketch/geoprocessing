import { createOrUpdateDatasource, readDatasources } from "./datasources";
import {
  Datasources,
  ImportRasterDatasourceOptions,
  importRasterDatasourceOptionsSchema,
  ImportVectorDatasourceOptions,
  importVectorDatasourceOptionsSchema,
  InternalRasterDatasource,
  InternalVectorDatasource,
} from "../../../src/types";
import {
  isInternalRasterDatasource,
  isInternalVectorDatasource,
  getCogFilename,
  getDatasetBucketName,
} from "../../../src/datasources";
import {
  genVectorConfig,
  genGeojson,
  genFlatgeobuf,
  genVectorKeyStats,
} from "./importVectorDatasource";
import {
  genCog,
  genRasterConfig,
  genRasterKeyStats,
} from "./importRasterDatasource";
import { loadCogWindow } from "../../../src/dataproviders/cog";
import ProjectClientBase from "../../../src/project/ProjectClientBase";
import { publishDatasource } from "./publishDatasource";

/**
 * Import a dataset into the project.  Must be a src file that OGR or GDAL can read.
 * Importing means stripping unnecessary properties/layers,
 * converting to cloud optimized format, and adding as datasource.
 */
export async function reimportDatasources<C extends ProjectClientBase>(
  projectClient: C,
  extraOptions: {
    /** Whether or not to publish after reimport */
    doPublish?: boolean;
    /** Alternative path to look for datasources than default. useful for testing */
    newDatasourcePath?: string;
    /** Alternative path to store transformed data. useful for testing */
    newDstPath?: string;
    /** string or regular expression to express with datasources to reimport, matching on datasourceId */
    matcher?: string[];
  }
): Promise<Datasources> {
  const {
    newDatasourcePath,
    newDstPath,
    matcher,
    doPublish = false,
  } = extraOptions;

  const allDatasources = await readDatasources(newDatasourcePath);
  const filteredDatasources = (() => {
    if (!matcher) {
      return allDatasources;
    } else {
      const filteredDs = allDatasources.filter((ds) =>
        matcher.includes(ds.datasourceId)
      );
      return filteredDs;
    }
  })();

  if (filteredDatasources.length === 0) {
    console.log("No datasources found");
    return [];
  }

  // Process one at a time
  let failed = 0;
  let updated = 0;
  let finalDatasources: Datasources = [];
  for (const ds of filteredDatasources) {
    if (isInternalVectorDatasource(ds) && ds.geo_type === "vector") {
      try {
        console.log(`${ds.datasourceId} vector reimport started`);
        // parse import options from datasource record, is just a subset
        const options: ImportVectorDatasourceOptions =
          importVectorDatasourceOptionsSchema.parse(ds);
        // generate full config
        const config = genVectorConfig(projectClient, options, newDstPath);
        await genGeojson(config);
        await genFlatgeobuf(config);
        const classStatsByProperty = genVectorKeyStats(config);

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

        const newVectorD: InternalVectorDatasource = {
          ...ds,
          keyStats: classStatsByProperty,
        };

        // Datasource record with new or updated timestamp
        const finalDs = await createOrUpdateDatasource(
          newVectorD,
          newDatasourcePath
        );
        finalDatasources.push(finalDs);

        console.log(`${ds.datasourceId} reimport complete`);
        console.log(" ");
        updated += 1;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Updating datasource ${ds.datasourceId} failed, moving to next`
          );
          failed += 1;
        }
      }
    } else if (isInternalRasterDatasource(ds) && ds.geo_type === "raster") {
      try {
        console.log(`${ds.datasourceId} raster reimport started`);
        // parse import options from datasource record, is just a subset
        const options: ImportRasterDatasourceOptions =
          importRasterDatasourceOptionsSchema.parse(ds);
        // generate full config
        const config = genRasterConfig(projectClient, options, newDstPath);
        await genCog(config);

        const tempPort = 8001;
        const url = `${projectClient.dataBucketUrl(
          true,
          tempPort
        )}${getCogFilename(config.datasourceId)}`;
        console.log(
          `Fetching raster to calculate stats from temp file server ${url}`
        );
        const raster = await loadCogWindow(url, {});

        console.log("raster loaded");

        const classStatsByProperty = await genRasterKeyStats(config, raster);

        console.log("raster key stats calculated");

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

        const newRasterD: InternalRasterDatasource = {
          ...ds,
          keyStats: classStatsByProperty,
        };

        // Datasource record with new or updated timestamp
        const finalDs = await createOrUpdateDatasource(
          newRasterD,
          newDatasourcePath
        );
        finalDatasources.push(finalDs);

        console.log(`${ds.datasourceId} reimport complete`);
        console.log();
        updated += 1;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Updating datasource ${ds.datasourceId} failed, moving to next`
          );
          failed += 1;
        }
      }
    } else {
      console.log(`Skipping ${ds.datasourceId}, reimport not supported`);
    }
  }

  console.log(`${updated} datasources reimported successfully`);
  if (failed > 0) {
    console.log(
      `${failed} datasources failed to reimported.  Fix them and try again`
    );
  }

  return finalDatasources;
}
