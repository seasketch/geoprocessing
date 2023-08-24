import fs from "fs-extra";
import path from "path";
import { metricsSchema } from "../../../src/types";
import { precalcConfig } from "../../../src/precalc/config";
import { Metric } from "../../../src/types";
import { readMetrics, writeMetrics, createOrUpdateMetrics } from "./metrics";

/**
 * Manage a metrics datasource
 */

/**
 * Reads metrics from disk, validates them
 * If metrics file not exist then start a new one and ensure directory exists
 */
export function readPrecalcMetrics(filePath?: string) {
  let metrics: Metric[] = [];

  // Optional override
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : precalcConfig.defaultSrcPath;

  return readMetrics(finalFilePath);
}

/**
 * Writes metrics to disk
 */
export function writePrecalcMetrics(metrics: Metric[], filePath?: string) {
  const finalFilePath =
    filePath && filePath.length > 0 ? filePath : precalcConfig.defaultSrcPath;
  return writeMetrics(metrics, finalFilePath);
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
