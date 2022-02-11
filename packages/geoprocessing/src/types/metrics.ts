import { Nullable, JSONValue } from "./base";

/**
 * Represents a single class of data.
 * Used to access the data, and calculate metrics based on them.
 */
export interface DataClass {
  /** Unique name for class */
  classId: string;
  /** Name of class suitable for user display */
  display: string;
  /** Optional filename of dataset used for metric class, sans extension. */
  baseFilename?: string;
  /** Optional filename of dataset for metric class for use by GP function, with extension. */
  filename?: string;
  /** Optional unique number used by some datasets (e.g. raster) to represent data class instead of string */
  numericClassId?: number;
  /** Optional ID of map layer associated with this class */
  layerId?: string;
  /** Optional nodata value used by raster dataset */
  noDataValue?: number;
  /** Optional project specific goal value for this class */
  goalValue?: number;
}

/**
 * Represents a group of data classes.
 * Used to access the data, and calcualte metrics based on them.
 * This interface is murky but it supports a variety of scenarios:
 * - Vector dataset with one feature class
 * - Vector dataset with multiple feature class, each with their own file datasource, and possibly only one layerId to display them all
 * - Vector dataset with multiple feature classes, all in one file datasource, each class with its own layerId
 * - Raster with multiple feature classes represented by unique integer values that map to class names
 */
export interface DataGroup {
  /** data classes used by group */
  classes: DataClass[];
  /** Identifier for datasource */
  datasourceId?: string;
  /** Optional name of feature property containing class ID */
  classProperty?: string;
  /** Optional filename of dataset, sans extension. May contain data for one or more classes */
  baseFilename?: string;
  /** Optional filename of dataset for use by GP function, with extension */
  filename?: string;
  /** Optional ID of map layer associated with this metric */
  layerId?: string;
}

/** Represents a single metric, having one DataGroup */
export interface MetricGroup extends DataGroup {
  /** Unique identifier for metric */
  metricId: string;
}

//// METRICS ////

export type MetricIdTypes = string | number;

/** Properties used in Metric */
export const MetricProperties = [
  "metricId",
  "sketchId",
  "classId",
  "groupId",
  "geographyId",
  "value",
  "extra",
] as const;
export type MetricProperty = typeof MetricProperties[number] & keyof Metric;

/** Dimensions used in Metric */
export const MetricDimensions = [
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
