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
