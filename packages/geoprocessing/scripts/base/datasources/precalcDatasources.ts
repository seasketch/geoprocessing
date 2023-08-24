import { readDatasources } from "./datasources";
import { Metric } from "../../../src/types";
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
    /** Whether or not to publish after reimport */
    doPublish?: boolean;
    /** Alternative path to look for datasources than default. useful for testing */
    newDatasourcePath?: string;
    /** Alternative path to look for geographes than default. useful for testing */
    newGeographyPath?: string;
    /** Alternative path to store precalc data. useful for testing */
    newDstPath?: string;
    /** string or regular expression to express with datasources to reimport, matching on datasourceId */
    datasourceMatcher?: string[];
  }
): Promise<Metric[]> {
  const {
    newDatasourcePath,
    newGeographyPath,
    newDstPath,
    datasourceMatcher: matcher,
    doPublish = false,
  } = extraOptions;

  const geographies = await readGeographies(newGeographyPath);

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
  let calculated = 0;
  let finalMetrics: Metric[] = [];
  for (const ds of filteredDatasources) {
    for (const geog of geographies) {
      // precalc
      const curMetrics = await (async () => {
        if (isInternalVectorDatasource(ds) && ds.geo_type === "vector") {
          try {
            console.log(
              `Precalculating vector datasource ${ds.datasourceId} for geography ${geog.geographyId}`
            );
            return await precalcVectorDatasource(projectClient, ds, geog);
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
        } else if (isInternalRasterDatasource(ds) && ds.geo_type === "raster") {
          try {
            console.log(
              `Precalculating raster datasource ${ds.datasourceId} for geography ${geog.geographyId}`
            );
            return [];
            // metrics = metrics.concat(await precalcRasterDatasource(
            //   datasource,
            //   geography
            // ))
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
          console.log(`Skipping ${ds.datasourceId}, precalc not supported`);
          return [];
        }
        return [];
      })();

      finalMetrics = finalMetrics.concat(curMetrics);

      // Update precalc metrics on disk
      const classIds = curMetrics.reduce<string[]>((acc, m: Metric) => {
        if (!m.classId) return acc;
        return acc.includes(m.classId) ? acc : acc.concat([m.classId]);
      }, []);
      createOrUpdatePrecalcMetrics(
        curMetrics,
        (m) =>
          !!m.classId &&
          classIds.includes(m.classId) &&
          !!m.geographyId &&
          m.geographyId === geog.geographyId,
        newDstPath
      );

      console.log(`${ds.datasourceId} precalc complete`);
      console.log(" ");
      calculated += 1;
    }
  }

  console.log(`${calculated} datasources precalculated successfully`);
  if (failed > 0) {
    console.log(
      `${failed} datasources failed to precalculate.  Fix them and try again`
    );
  }

  return finalMetrics;
}
