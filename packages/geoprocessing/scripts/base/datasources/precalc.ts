import { precalcConfig } from "../../../src/precalc/config";
import { Metric } from "../../../src/types";
import { readMetrics, writeMetrics, createOrUpdateMetrics } from "./metrics";
import { sortMetrics, rekeyMetrics } from "../../../src/metrics/helpers";

// Extends metrics datasource

/**
 * Reads metrics from disk, validates them
 * If metrics file not exist then start a new one and ensure directory exists
 */
export function readPrecalcMetrics(filePath?: string) {
  // Optional override
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : precalcConfig.defaultSrcPath;

  return readMetrics(finalFilePath);
}

/**
 * Writes metrics to disk, sorted and rekeyed for consistent ordering
 */
export function writePrecalcMetrics(metrics: Metric[], filePath?: string) {
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : precalcConfig.defaultSrcPath;
  return writeMetrics(sortMetrics(rekeyMetrics(metrics)), finalFilePath);
}

/** Creates or updates metrics on disk */
export async function createOrUpdatePrecalcMetrics(
  metrics: Metric[],
  matcher: (m: Metric) => boolean,
  filePath?: string
): Promise<Metric[]> {
  // Optional override
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : precalcConfig.defaultSrcPath;
  return createOrUpdateMetrics(metrics, matcher, finalFilePath);
}
