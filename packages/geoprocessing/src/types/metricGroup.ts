import { dataClassSchema } from "./dataclass.js";
import { z } from "zod";

//// METRIC GROUP SCHEMA ////

/**
 * Defines a metric in combination with a datasource, with one or more data classes */
export const metricGroupSchema = z.object({
  /** Unique id of metric in project*/
  metricId: z.string(),
  /** Metric type */
  type: z.string(),
  /** Datasource to generate metrics from */
  datasourceId: z.string().optional(),
  /** Optional datasource class key used to source classIds  */
  classKey: z.string().optional(),
  /** data classes used by group */
  classes: z.array(dataClassSchema),
  /** Optional ID of map layer associated with this metric */
  layerId: z.string().optional(),
  /** group level objective, applies to all classes */
  objectiveId: z.string().optional(),
});

export const metricGroupsSchema = z.array(metricGroupSchema);

//// INFERRED TYPES ////

/** Represents a single metric, having one DataGroup */
export type MetricGroup = z.infer<typeof metricGroupSchema>;
export type MetricGroups = z.infer<typeof metricGroupsSchema>;
