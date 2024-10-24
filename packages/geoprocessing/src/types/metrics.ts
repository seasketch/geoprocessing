import { JSONValue, jsonSchema } from "./base.js";
import { MetricProperties } from "../metrics/helpers.js";
import { z } from "zod";

/** Dimensions used in Metric */
export const MetricDimensions = [
  "metricId",
  "geographyId",
  "sketchId",
  "groupId",
  "classId",
] as const;
export type MetricDimension = (typeof MetricDimensions)[number] & keyof Metric;

export const metricSchema = z.object({
  metricId: z.string(),
  value: z.number(),
  extra: z.record(jsonSchema).optional(),
  classId: z.string().nullable(),
  groupId: z.string().nullable(),
  geographyId: z.string().nullable(),
  sketchId: z.string().nullable(),
  //   // Time
  //   /** Metric duration of time */
  //   // duration: Nullable<ISO8601Duration>;
  //   /** Metric for event at specific time  */
  //   // startTime: Nullable<ISO8601DateTime>;
});

export const metricsSchema = z.array(metricSchema);

/**
 * Single record of value, stratified in one or more dimensions.
 * The name Metric is an overgeneralization, you can think of it as a MetricValue.
 */
export type Metric = z.infer<typeof metricSchema>;
export type Metrics = z.infer<typeof metricSchema>;

/** Alternative JSON format for metrics data that is smaller in size, better suited for blob storage and network transport */
export interface MetricPack {
  dimensions: string[];
  data: (string | number | boolean | JSONValue)[][];
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

export type MetricIdTypes = string | number;
export type MetricProperty = (typeof MetricProperties)[number] & keyof Metric;
