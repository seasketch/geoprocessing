import { createOrUpdateDatasource, readDatasources } from "./datasources";
import {
  Datasource,
  ImportRasterDatasourceOptions,
  importRasterDatasourceOptionsSchema,
  ImportVectorDatasourceOptions,
  importVectorDatasourceOptionsSchema,
} from "../../../src/types";
import {
  isInternalRasterDatasource,
  isInternalVectorDatasource,
} from "../../../src/datasources";
import { genGeojson, genFlatgeobuf } from "./importVectorDatasource";
import { genVectorConfig } from "./genVectorConfig";
import { genCog } from "./importRasterDatasource";
import { genRasterConfig } from "./genRasterConfig";
import ProjectClientBase from "../../../src/project/ProjectClientBase";

/**
 * Reimport one or more datasources into project.
 */
export async function reimportDatasources<C extends ProjectClientBase>(
  projectClient: C,
  extraOptions: {
    /** Alternative path to look for datasources than default. useful for testing */
    newDatasourcePath?: string;
    /** Alternative path to store transformed data. useful for testing */
    newDstPath?: string;
    /** string or regular expression to express with datasources to reimport, matching on datasourceId */
    matcher?: string[];
  }
): Promise<Datasource[]> {
  const {
    newDatasourcePath,
    newDstPath,
    matcher,
  } = extraOptions;

  const allDatasources = await readDatasources(newDatasourcePath);
  const filteredDatasources = (() => {
    if (!matcher) {
      // Filter out external datasources or support them
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
  let finalDatasources: Datasource[] = [];
  for (const ds of filteredDatasources) {
    if (isInternalVectorDatasource(ds) && ds.geo_type === "vector") {
      try {
        console.log(`${ds.datasourceId} vector reimport started`);
        // parse import options from datasource record, is just a subset
        const options: ImportVectorDatasourceOptions =
          importVectorDatasourceOptionsSchema.parse(ds);
        // generate full config
        const config = genVectorConfig(projectClient, options, newDstPath);

        await Promise.all(
          config.formats.map(async (format) => {
            if (format === "json") {
              await genGeojson(config);
            } else if (format === "fgb") {
              await genFlatgeobuf(config);
            }
          })
        );

        // Datasource record with new or updated timestamp
        const finalDs = await createOrUpdateDatasource(ds, newDatasourcePath);
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

        // Datasource record with new or updated timestamp
        const finalDs = await createOrUpdateDatasource(ds, newDatasourcePath);
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
