import { Nullable, JSONValue } from "./base";
import { MetricProperties } from "../metrics/helpers";
import { Objective } from "./objective";
import { DataGroup } from "./datasource";

/** Represents a single metric, having one DataGroup */
export interface MetricGroup extends DataGroup {
  /** Unique identifier for metric */
  metricId: string;
  objective?: Objective;
}

export type MetricIdTypes = string | number;
export type MetricProperty = typeof MetricProperties[number] & keyof Metric;

/** Dimensions used in Metric */
const MetricDimensions = [
  "metricId",
  "geographyId",
  "sketchId",
  "groupId",
  "classId",
] as const;
export type MetricDimension = typeof MetricDimensions[number] & keyof Metric;

/**
 * Flexible domain model for a metric - a single measurement stratified by one or more dimensions
 */
export interface Metric {
  /** Name of the metric */
  metricId: string;
  /** The metric value */
  value: number;
  /** Additional ad-hoc properties, often used to ease interpretation */
  extra?: Record<string, JSONValue>;

  // Time
  /** Metric duration of time */
  // duration: Nullable<ISO8601Duration>;
  /** Metric for event at specific time  */
  // startTime: Nullable<ISO8601DateTime>;

  // Other Dimensions
  /** Metric from specific data class */
  classId: Nullable<string>;
  /** Identifier for group - e.g. protection level.  A sketch can only be a member of one*/
  groupId: Nullable<string>;
  /** Identifier for geography */
  geographyId: Nullable<string>;
  /** Identifier for sketch or sketch collection */
  sketchId: Nullable<string>;
}

//// AGGREGATIONS ////

/**
 * Single flattened metric with class values keyed by class name
 * Useful for rendering table rows with the values of multiple classes for a group
 */
export type GroupMetricAgg = {
  groupId: string;
  value: number;
  percValue: number;
  [className: string]: string | number;
};

export type GroupMetricSketchAgg = GroupMetricAgg & {
  sketchId: string;
};
