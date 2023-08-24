import { readDatasources } from "./datasources";
import { Metric, Datasource, Geography } from "../../../src/types";
import {
  isInternalRasterDatasource,
  isInternalVectorDatasource,
} from "../../../src/datasources";
import ProjectClientBase from "../../../src/project/ProjectClientBase";
import { readGeographies } from "../geographies/geographies";
import { createOrUpdatePrecalcMetrics } from "./precalc";
import { precalcVectorDatasource } from "./precalcVectorDatasource";

/**
 * Precalc one or more datasources for a project, for one or more defined geographies
 */
export async function precalcDatasources<C extends ProjectClientBase>(
  projectClient: C,
  extraOptions: {
    /** Alternative path to look for datasources than default. useful for testing */
    newDatasourcePath?: string;
    /** Alternative path to look for geographes than default. useful for testing */
    newGeographyPath?: string;
    /** Alternative path to store precalc data. useful for testing */
    newPrecalcPath?: string;
    /** Alternative dist path. useful for testing */
    newDstPath?: string;
    /** string or regular expression to express with datasources to reimport, matching on datasourceId */
    datasourceMatcher?: string[];
    /** string or regular expression to express with geographies to reimport, matching on geographyId */
    geographyMatcher?: string[];
  }
): Promise<Metric[]> {
  const {
    newDatasourcePath,
    newGeographyPath,
    datasourceMatcher,
    geographyMatcher,
  } = extraOptions;

  // Get geographies to precalc
  const allGeographies = await readGeographies(newGeographyPath);
  const filteredGeographies = (() => {
    if (!geographyMatcher) {
      return allGeographies;
    } else {
      const filteredDs = allGeographies.filter((ds) =>
        geographyMatcher.includes(ds.datasourceId)
      );
      return filteredDs;
    }
  })();
  if (filteredGeographies.length === 0) {
    console.log("No geographies found");
    return [];
  }

  // Get datasources to precalc
  const allDatasources = await readDatasources(newDatasourcePath);
  const filteredDatasources = (() => {
    if (!datasourceMatcher) {
      return allDatasources;
    } else {
      const filteredDs = allDatasources.filter((ds) =>
        datasourceMatcher.includes(ds.datasourceId)
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
  let successful = 0;
  let finalMetrics: Metric[] = [];

  // Run precalc on subset of datasources for all geographies
  for (const ds of filteredDatasources) {
    for (const geog of allGeographies) {
      try {
        console.log(
          `Precalculating datasource ${ds.datasourceId} for geography ${geog.geographyId}`
        );
        const metrics = await precalculateMetrics(
          projectClient,
          ds,
          geog,
          extraOptions
        );
        finalMetrics = finalMetrics.concat(metrics);
        console.log(`${ds.datasourceId} precalc complete`);
        console.log(" ");
        successful += 1;
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

  // Run precalc on subset of geographies for all datasources
  for (const geog of filteredGeographies) {
    for (const ds of allDatasources) {
      try {
        console.log(
          `Precalculating datasource ${ds.datasourceId} for geography ${geog.geographyId}`
        );
        const metrics = await precalculateMetrics(
          projectClient,
          ds,
          geog,
          extraOptions
        );
        finalMetrics = finalMetrics.concat(metrics);
        console.log(`${ds.datasourceId} precalc complete`);
        console.log(" ");
        successful += 1;
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(e.message);
          console.log(e.stack);
          console.log(
            `Updating precalc metrics for ${geog.geographyId} failed, moving to next`
          );
          failed += 1;
        }
      }
    }
  }

  console.log(`${successful} datasources precalculated successfully`);
  if (failed > 0) {
    console.log(
      `${failed} datasources failed to precalculate.  Fix them and try again`
    );
  }

  return finalMetrics;
}

/**
 * Precalculate metrics for internal vector/raster datasource for given geography
 */
export const precalculateMetrics = async (
  projectClient: ProjectClientBase,
  ds: Datasource,
  geog: Geography,
  extraOptions: {
    /** Alternative path to store precalc data. useful for testing */
    newPrecalcPath?: string;
    /** Alternative dist path. useful for testing */
    newDstPath?: string;
  }
): Promise<Metric[]> => {
  const { newPrecalcPath, newDstPath } = extraOptions;

  // precalc
  const curMetrics = await (async () => {
    if (isInternalVectorDatasource(ds) && ds.geo_type === "vector") {
      return await precalcVectorDatasource(projectClient, ds, geog, {
        newDstPath,
      });
    } else if (isInternalRasterDatasource(ds) && ds.geo_type === "raster") {
      return [];
      // metrics = metrics.concat(await precalcRasterDatasource(
      //   datasource,
      //   geography
      // ))
    } else {
      console.log(`Skipping ${ds.datasourceId}, precalc not supported`);
      return [];
    }
  })();

  // If global datasource or unable to precalculate
  if (!curMetrics.length) return [];

  // Find metric classes to be updated on disk
  const curMetricsClassIds = curMetrics.reduce<string[]>((acc, m: Metric) => {
    if (!m.classId) return acc;
    return acc.includes(m.classId) ? acc : acc.concat([m.classId]);
  }, []);

  const staleMetricsFilterFn = staleMetricsFilterNursery(
    curMetricsClassIds,
    geog.geographyId
  );

  createOrUpdatePrecalcMetrics(
    curMetrics,
    staleMetricsFilterFn,
    newPrecalcPath
  );

  return curMetrics;
};

/**
 * Given a list of classIds, return a filter function that will filter out metrics that are not in the list
 * @param classIds
 */
export const staleMetricsFilterNursery = (
  classIds: string[],
  geographyId: string
) => {
  return (m: Metric) => {
    return (
      (!!m.classId && classIds.includes(m.classId) === false) ||
      (!!m.geographyId && m.geographyId !== geographyId)
    );
  };
};
