import fs from "fs-extra";
import path from "path";
import { metricsSchema } from "../../../src/types";
import { precalcConfig } from "../../../src/precalc/config";
import { Metric } from "../../../src/types";

/**
 * Manage a metrics datasource
 */

/**
 * Reads metrics from disk, validates them
 * If metrics file not exist then start a new one and ensure directory exists
 */
export function readMetrics(filePath: string) {
  let metrics: Metric[] = [];

  const diskPrecalc = (() => {
    try {
      const dsString = fs.readFileSync(filePath).toString();
      try {
        return JSON.parse(dsString);
      } catch (err: unknown) {
        throw new Error(
          `Unable to parse JSON found in ${filePath}, fix it and try again`
        );
      }
    } catch (err: unknown) {
      console.log(`Precalc file not found at ${filePath}, creating a new one`);
      fs.ensureDirSync(path.dirname(precalcConfig.defaultSrcPath));
      // fallback to default
      return metrics;
    }
  })();

  const result = metricsSchema.safeParse(diskPrecalc);
  if (!result.success) {
    console.error(
      `${filePath} is invalid, either you need to delete it and run precalc, or manually fix it`
    );
    console.log(JSON.stringify(result.error.issues, null, 2));
    throw new Error("Please fix or report this issue");
  } else {
    return result.data;
  }
}

/**
 * Writes metrics to disk
 */
export function writeMetrics(metrics: Metric[], filePath: string) {
  const safeMetrics = metricsSchema.safeParse(metrics);
  if (!safeMetrics.success) {
    console.error(
      `precalculated metrics are invalid, this is a bug with the precalc script`
    );
    console.log(JSON.stringify(safeMetrics.error.issues, null, 2));
    throw new Error("Please fix or report this issue");
  } else {
    fs.writeJSONSync(filePath, metrics, { spaces: 2 });
  }
}

/**
 * Creates or updates metrics on disk
 * @param inputMetrics - new metrics to add
 * @param matcher - old metrics to replace
 * @param filePath - path to metrics file
 * @returns - full set of updated metrics
 */
export async function createOrUpdateMetrics(
  inputMetrics: Metric[],
  matcher: (m: Metric) => boolean,
  filePath: string
): Promise<Metric[]> {
  let metrics = readMetrics(filePath);

  if (matcher) {
    metrics = metrics.filter(matcher);
  }

  metrics = metrics.concat(inputMetrics);
  writeMetrics(metrics, filePath);
  return metrics;
}
