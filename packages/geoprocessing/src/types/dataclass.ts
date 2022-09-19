import { z } from "zod";

//// SCHEMA ////

/**
 * Represents a single class of data. Ties it to an underlying datasource, holds attributes used for displaying in user interfaces
 */
export const dataClassSchema = z.object({
  /** Unique identifier for class in project */
  classId: z.string(),
  /** Optional datasource class key used to source classIds  */
  classKey: z.string().optional(),
  /** Datasource for single data class */
  datasourceId: z.string().optional(),
  /** Name of class suitable for user display */
  display: z.string(),
  /** Optional unique number used by some datasets (e.g. raster) to represent data class instead of string */
  numericClassId: z.number().optional(),
  /** Optional ID of map layer associated with this class */
  layerId: z.string().optional(),
  /** class level objective */
  objectiveId: z.string().optional(),
});

/**
 * Represents a group of data classes.
 * Used to access the data, and calcualte metrics based on them.
 * This interface is murky but it supports a variety of scenarios:
 * - Vector dataset with one feature class
 * - Vector dataset with multiple feature class, each with their own file datasource, and possibly only one layerId to display them all
 * - Vector dataset with multiple feature classes, all in one file datasource, each class with its own layerId
 * - Raster with multiple feature classes represented by unique integer values that map to class names
 */
// export interface DataGroup {
//   /** data classes used by group */
//   classes: DataClass[];
//   /** Identifier for datasource */
//   datasourceId?: string;
//   /** Optional name of feature property containing class ID */
//   classProperty?: string;
//   /** Optional filename of dataset, sans extension. May contain data for one or more classes */
//   baseFilename?: string;
//   /** Optional filename of dataset for use by GP function, with extension */
//   filename?: string;
//   /** Optional ID of map layer associated with this metric */
//   layerId?: string;
// }

//// INFERRED TYPES ////

export type DataClass = z.infer<typeof dataClassSchema>;
