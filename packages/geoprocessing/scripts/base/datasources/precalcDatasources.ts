import { readDatasources } from "./datasources";
import {
  Metric,
  Datasource,
  Geography,
  VectorDatasource,
} from "../../../src/types";
import {
  firstMatching,
  isRasterDatasource,
  isVectorDatasource,
} from "../../../src/datasources";
import ProjectClientBase from "../../../src/project/ProjectClientBase";
import { readGeographies } from "../geographies/geographies";
import { createOrUpdatePrecalcMetrics } from "./precalc";
import { precalcVectorDatasource } from "./precalcVectorDatasource";
import { precalcRasterDatasource } from "./precalcRasterDatasource";
import cloneDeep from "lodash/cloneDeep";

export interface PrecalcDatasourceOptions {
  /** Alternative path to look for datasources than default if using internal.*/
  newDatasourcePath?: string;
  /** Alternative path to look for geographes than default. useful for testing */
  newGeographyPath?: string;
  /** Alternative path to store precalc data. useful for testing */
  newPrecalcPath?: string;
  /** Alternative dist path. useful for testing */
  newDstPath?: string;
  /** array of datasource ID's to precalc, for all geographies.  Defaults to "*"" as matcher, which matches on all datasources */
  datasourceMatcher?: string[];
  /** array of geography ID's to precalc, for all datasources.  Defaults to "*" as matcher, which matches on all geographies */
  geographyMatcher?: string[];
  /** Alternative port to fetch data from */
  port?: number;
}

/**
 * Precalc one or more datasources for a project, for one or more defined geographies
 * one at a time, writing them out to disk as they complete
 */
export async function precalcDatasources<C extends ProjectClientBase>(
  projectClient: C,
  extraOptions: PrecalcDatasourceOptions = {}
): Promise<Metric[]> {
  const {
    newDatasourcePath,
    newGeographyPath,
    datasourceMatcher = ["*"],
    geographyMatcher = ["*"],
  } = extraOptions;

  const allGeographies = await readGeographies(newGeographyPath);
  // Start with no geographies to precalc.  Matcher can specify all or some
  let matchingGeographies: Geography[] = [];
  if (geographyMatcher && geographyMatcher.length > 0) {
    if (geographyMatcher.includes("*")) {
      matchingGeographies = cloneDeep(allGeographies);
    } else {
      matchingGeographies = cloneDeep(allGeographies).filter((geog) =>
        geographyMatcher.includes(geog.geographyId)
      );

      if (matchingGeographies.length === 0)
        throw new Error(
          `No matching geographies found for ${geographyMatcher}, exiting`
        );
    }
  }

  const vectorDatasources: VectorDatasource[] = (await readDatasources(
    newDatasourcePath
  ).filter((ds) => isVectorDatasource(ds))) as VectorDatasource[];
  const datasources = cloneDeep(await readDatasources(newDatasourcePath));
  // Start with no datasources to precalc.  Matcher can specify all (*) or some
  let matchingDatasources: Datasource[] = [];

  if (datasourceMatcher && datasourceMatcher.length > 0) {
    if (datasourceMatcher.includes("*")) {
      matchingDatasources = cloneDeep(datasources);
    } else {
      matchingDatasources = cloneDeep(datasources).filter((ds) =>
        datasourceMatcher.includes(ds.datasourceId)
      );
    }
  }

  // Process one at a time
  let failed = 0;
  let skipped = 0;
  let successfulDs = 0;
  let successfulGs = 0;
  let finalMetrics: Metric[] = [];
  let processed = {}; // Track processed datasource/geography combinations to avoid duplicates

  // console.log("vector (geog) datasources", vectorDatasources);
  // console.log("datasources", datasources);
  // console.log("matching datasources", matchingDatasources);
  // console.log("all geographies", allGeographies);
  // console.log("matching geographies", matchingGeographies);

  // Run precalc on matching subset of datasources for all geographies
  for (const ds of matchingDatasources) {
    for (const geog of allGeographies) {
      // Skip if either datasource or geography has precalc set to false
      if (geog.precalc === false || ds.precalc === false) {
        // console.log(
        //   `Precalc disabled for datasource ${ds.datasourceId} for geography ${geog.geographyId}`
        // );
        continue;
      }
      // Skip if already processed
      if (processed[`${ds.datasourceId}-${geog.geographyId}`] === true) {
        continue;
      }
      try {
        console.log(
          `Precalculating datasource ${ds.datasourceId} for geography ${geog.geographyId}`
        );
        const geogDatasource = firstMatching(
          vectorDatasources,
          (item) => item.datasourceId === geog.datasourceId
        );
        const metrics = await precalcMetrics(
          projectClient,
          ds,
          geog,
          geogDatasource,
          extraOptions
        );
        // console.log(ds.datasourceId, geog.geographyId, metrics);
        finalMetrics = finalMetrics.concat(metrics);

        console.log(" ");
        successfulDs += 1;
        processed[`${ds.datasourceId}-${geog.geographyId}`] = true;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Updating precalc metrics for ${ds.datasourceId} failed, moving to next`
          );
          failed += 1;
        }
      }
    }
  }

  // Also run precalc on matching subset of geographies for all datasources, for completeness
  for (const geog of matchingGeographies) {
    for (const ds of datasources) {
      if (geog.precalc === false || ds.precalc === false) {
        // console.log(
        //   `Precalc disabled for datasource ${ds.datasourceId} + geography ${geog.geographyId}`
        // );
        skipped += 1;
        continue;
      }
      // Skip if already processed
      if (processed[`${ds.datasourceId}-${geog.geographyId}`] === true) {
        continue;
      }
      try {
        console.log(
          `Precalculating datasource ${ds.datasourceId} + geography ${geog.geographyId}`
        );
        const geogDatasource = firstMatching(
          vectorDatasources,
          (item) => item.datasourceId === geog.datasourceId
        );
        const metrics = await precalcMetrics(
          projectClient,
          ds,
          geog,
          geogDatasource,
          extraOptions
        );
        finalMetrics = finalMetrics.concat(metrics);
        console.log(`${ds.datasourceId} precalc complete`);
        console.log(" ");
        successfulGs += 1;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Updating precalc metrics for data ${ds.datasourceId} + geography ${geog.geographyId} failed, moving to next`
          );
          failed += 1;
        }
      }
    }
  }

  const successful = successfulDs + successfulGs;

  if (successful > 0)
    console.log(
      `${successfulDs} datasource/geography combinations precalculated successfully`
    );
  if (skipped > 0)
    console.log(
      `${successfulDs} datasource/geography combinations skipped due to precalc disabled`
    );
  if (successfulDs === 0 && successfulGs === 0 && skipped === 0) {
    console.log(`No datasources or geographies found to precalculate`);
  }

  if (failed > 0) {
    console.log(
      `${failed} datasources failed to precalculate.  Fix them and try again`
    );
  }

  return finalMetrics;
}

/**
 * Precalculate metrics for datasource for given geography and write out to disk
 */
export const precalcMetrics = async (
  projectClient: ProjectClientBase,
  ds: Datasource,
  geog: Geography,
  geogDs: VectorDatasource,
  extraOptions: PrecalcDatasourceOptions
): Promise<Metric[]> => {
  const { newPrecalcPath, newDstPath, port } = extraOptions;

  // precalc if possible. If external datasource, then return nothing
  const curMetrics = await (async () => {
    if (isVectorDatasource(ds) && ds.geo_type === "vector") {
      return await precalcVectorDatasource(projectClient, ds, geog, geogDs, {
        newDstPath,
        port,
      });
    } else if (isRasterDatasource(ds) && ds.geo_type === "raster") {
      return await precalcRasterDatasource(projectClient, ds, geog, geogDs, {
        newDstPath,
        port,
      });
    } else {
      console.log(`Skipping ${ds.datasourceId}, precalc not supported`);
      return [];
    }
  })();

  const staleMetricsFilterFn = staleMetricsFilterFnFactory(
    ds.datasourceId,
    geog.geographyId
  );

  createOrUpdatePrecalcMetrics(curMetrics, {
    matcher: staleMetricsFilterFn,
    filePath: newPrecalcPath,
  });

  return curMetrics;
};

/**
 * returns a function that will filter out metrics that don't match the geographyId or don't have a classId that starts with the datasourceId (total metrics)
 */
export const staleMetricsFilterFnFactory = (
  datasourceId: string,
  geographyId: string
) => {
  return (m: Metric) => {
    return (
      (!!m.classId && !m.classId.startsWith(datasourceId + "-")) ||
      (!!m.geographyId && m.geographyId !== geographyId)
    );
  };
};
