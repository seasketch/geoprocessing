import {
  Metric,
  MetricGroup,
  NullSketch,
  NullSketchCollection,
} from "./index.js";

/** Represents a single report, with one or more metrics */
export interface Report {
  /** unique identifier for report */
  reportId: string;
  /** report metrics keyed by metricId for easy retrieval */
  metrics: Record<string, MetricGroup>;
}

/**
 * Metrics for reports not associated with sketches.  Used for precalculation
 */
export interface ReportResultBase {
  metrics: Metric[];
}

/**
 * Report results consist of collections of metrics for sketches
 */
export interface ReportResult {
  metrics: Metric[];
  /** The sketch used, without geometry */
  sketch?: NullSketch | NullSketchCollection;
}
