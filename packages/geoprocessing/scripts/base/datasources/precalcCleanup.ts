import { Datasource, Geography, Metric } from "../../../src/types/index.js";
import ProjectClientBase from "../../../src/project/ProjectClientBase.js";

/**
 * Precalc one or more datasources for a project, for one or more defined geographies, and return the freshly filtered metrics
 */
export function precalcCleanup<C extends ProjectClientBase>(
  projectClient: C,
): Metric[] {
  let metrics = projectClient.getPrecalcMetrics();

  // Filter out any metrics where geography or datasource no longer present
  metrics = metrics.filter((m) => {
    if (!m.geographyId || !m.classId) return false;

    let curGeog: Geography;
    let curDatasource: Datasource;
    try {
      curGeog = projectClient.getGeographyById(m.geographyId);
      if (!curGeog) return false;

      // precalc metrics should have a classId ending in -total
      if (m.classId.endsWith("-total") === false) {
        return false;
      }
      const datasourceId = m.classId.replace("-total", "");
      curDatasource = projectClient.getDatasourceById(datasourceId);
      if (!curDatasource) return false;
      if (curGeog.precalc === false && curDatasource.precalc === false)
        return false;
    } catch (e: unknown) {
      return false;
    }
    return true;
  });

  return metrics;
}
