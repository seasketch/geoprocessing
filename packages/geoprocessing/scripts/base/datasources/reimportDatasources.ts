import { createOrUpdateDatasource, readDatasources } from "./datasources";
import { publishDatasource } from "./publishDatasource";
import {
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
import { loadCogWindow } from "../../../src/dataproviders";
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
import LocalFileServer from "../util/localServer";
import ProjectClientBase from "../../../src/project/ProjectClientBase";

/**
 * Import a dataset into the project.  Must be a src file that OGR or GDAL can read.
 * Importing means stripping unnecessary properties/layers,
 * converting to cloud optimized format, publishing to the datasets s3 bucket,
 * and adding as datasource.
 */
export async function reimportDatasources<C extends ProjectClientBase>(
  projectClient: C,
  /** Alternative path to look for datasources than default. useful for testing */
  newDatasourcePath?: string,
  /** Alternative path to store transformed data. useful for testing */
  newDstPath?: string
) {
  // regular expression to match
  const matcher = process && process.argv ? process.argv[2] : null;

  const allDatasources = readDatasources(newDatasourcePath);
  const datasources = matcher
    ? allDatasources.filter((ds) => ds.datasourceId.match(matcher))
    : allDatasources;

  if (datasources.length === 0) {
    console.log("No datasources found");
    return;
  }

  // Process one at a time
  let failed = 0;
  let updated = 0;
  for (const ds of datasources) {
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

        const newVectorD: InternalVectorDatasource = {
          ...ds,
          keyStats: classStatsByProperty,
        };

        await createOrUpdateDatasource(newVectorD, newDatasourcePath);
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
    } else if (isInternalRasterDatasource(ds) && ds.geo_type === "raster") {
      try {
        console.log(`${ds.datasourceId} raster reimport started`);
        // parse import options from datasource record, is just a subset
        const options: ImportRasterDatasourceOptions =
          importRasterDatasourceOptionsSchema.parse(ds);
        // generate full config
        const config = genRasterConfig(options, newDstPath);
        await genCog(config);

        const tempPort = 8001;
        const server = new LocalFileServer({
          path: config.dstPath,
          port: tempPort,
        });
        const url = `${projectClient.dataBucketUrl(
          true,
          tempPort
        )}${getCogFilename(config.datasourceId)}`;
        console.log(
          `Fetching raster to calculate stats from temp file server ${url}`
        );
        const raster = await loadCogWindow(url, {});
        server.close();

        const classStatsByProperty = await genRasterKeyStats(config, raster);

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

        const newRasterD: InternalRasterDatasource = {
          ...ds,
          keyStats: classStatsByProperty,
        };

        await createOrUpdateDatasource(newRasterD, newDatasourcePath);
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
}
