import { z } from "zod";

import { Package } from "./package.js";
import { GeoprocessingJsonConfig } from "./project.js";
import { bboxSchema } from "./geojson.js";

// Schema and types for representing datasources used in calculating metrics

const GEO_TYPES = ["vector", "raster"] as const;
export const geoTypesSchema = z.enum(GEO_TYPES);

const SUPPORTED_FORMATS = ["fgb", "json", "tif", "subdivided"] as const;
export const supportedFormatsSchema = z.enum(SUPPORTED_FORMATS);

/** Data variable measurement type */
const MEASUREMENT_TYPES = [
  // "quantitative-discrete-integer",
  // "quantitative-continuous-ratio",
  // "categorical-binary",
  // "categorical-nominal",
  // "categorical-ordinal",
  "quantitative",
  "categorical",
] as const;
export const measurementTypesSchema = z.enum(MEASUREMENT_TYPES);

/** Unused - Data variable recording precision */
const MEASUREMENT_SCALES = ["nominal", "ordinal", "interval", "ratio"] as const;
export const measurementScalesSchema = z.enum(MEASUREMENT_SCALES);

export const statsSchema = z.object({
  count: z.number().nullable().optional(),
  sum: z.number().nullable().optional(),
  area: z.number().nullable().optional(),
});

/** Pre-calculated stats by key by class */
export const classStatsSchema = z.record(statsSchema);

export const baseDatasourceSchema = z.object({
  /** Unique id of datasource in project */
  datasourceId: z.string(),
  /** basic geospatial type */
  geo_type: geoTypesSchema,
  /** Available formats */
  formats: z.array(supportedFormatsSchema),
  /** Optional, defines whether or not precalc should be run for this datasource */
  precalc: z.boolean(),
  metadata: z
    .object({
      /** Human-readable name of datasource */
      name: z.string(),
      /** Description of datasource */
      description: z.string().optional(),
      /** Publisher-provided version number or ISO 8601 date */
      version: z.string(),
      /** Publisher name */
      publisher: z.string(),
      /** ISO 8601 publish date */
      publishDate: z.string(),
      /** Public URL to access published data */
      publishLink: z.string(),
    })
    .optional(),
});

/** Properties for vector datasource */
export const vectorDatasourceSchema = baseDatasourceSchema.merge(
  z.object({
    /** Optional, name of property containing unique ID value for each vector feature */
    idProperty: z.string().optional(),
    /** Optional, name of property containing name for each vector feature */
    nameProperty: z.string().optional(),
    /** Optional, constrain datasource features by property having one or more specific values */
    propertyFilter: z
      .object({
        property: z.string(),
        values: z.array(z.string().or(z.number())),
      })
      .optional(),
    /** Optional, constrain datasource to smaller bbox */
    bboxFilter: bboxSchema.optional(),
    /** Import - Name of layer within vector datasource to extract */
    layerName: z.string().optional(),
    /** properties whose values define classes of data. */
    classKeys: z.array(z.string()),
  }),
);

/** Properties for raster datasource */
export const rasterDatasourceSchema = baseDatasourceSchema.merge(
  z.object({
    /** Type of measurements that the raster values represent */
    measurementType: measurementTypesSchema,
    /** Import - band within raster datasource to extract */
    band: z.number(),
    /** Nodata value */
    noDataValue: z.number().optional(),
  }),
);

/** Properties for external datasource */
export const externalDatasourceSchema = z.object({
  /** Url if external datasource */
  url: z.string(),
});

/** Properties for importing an internal datasource */
export const internalImportSchema = z.object({
  /** Import - Path to source data, with filename */
  src: z.string(),
});

/** Timestamp properties to ease syncing with local/published datasource files */
export const internalDatasourceSchema = z.object({
  /** Datasource creation timestamp  */
  created: z.string(),
  /** Datasource updated timestamp */
  lastUpdated: z.string(),
});

/** Properties for import of internal vector datasources */
export const internalVectorImportSchema = internalImportSchema.merge(
  z.object({
    /** Import - What to keep in final dataset. Vector - properties, all else removed   */
    propertiesToKeep: z.array(z.string()),
    /** Import - Whether to explode multi-geometries into single e.g. MultiPolygon to Polygon. Defaults to true */
    explodeMulti: z.boolean(),
  }),
);

export const internalVectorDatasourceSchema = vectorDatasourceSchema
  .merge(internalDatasourceSchema)
  .merge(internalVectorImportSchema);

export const externalVectorDatasourceSchema = vectorDatasourceSchema.and(
  externalDatasourceSchema,
);

export const internalRasterDatasourceSchema = rasterDatasourceSchema
  .merge(internalDatasourceSchema)
  .merge(internalImportSchema);

export const externalRasterDatasourceSchema = rasterDatasourceSchema.and(
  externalDatasourceSchema,
);

export const datasourceSchema = internalVectorDatasourceSchema
  .or(externalVectorDatasourceSchema)
  .or(internalRasterDatasourceSchema)
  .or(externalRasterDatasourceSchema);
export const datasourcesSchema = z.array(datasourceSchema);

// INFERRED TYPES //

export type GeoTypes = z.infer<typeof geoTypesSchema>;
export type SupportedFormats = z.infer<typeof supportedFormatsSchema>;
export type Stats = z.infer<typeof statsSchema>;
export type ClassStats = z.infer<typeof classStatsSchema>;
export type BaseDatasource = z.infer<typeof baseDatasourceSchema>;

export type VectorDatasource = z.infer<typeof vectorDatasourceSchema>;
export type InternalVectorDatasource = z.infer<
  typeof internalVectorDatasourceSchema
>;

export type RasterDatasource = z.infer<typeof rasterDatasourceSchema>;

export type InternalRasterDatasource = z.infer<
  typeof internalRasterDatasourceSchema
>;
export type ExternalVectorDatasource = z.infer<
  typeof externalVectorDatasourceSchema
>;
export type ExternalRasterDatasource = z.infer<
  typeof externalRasterDatasourceSchema
>;
export type Datasource = z.infer<typeof datasourceSchema>;

//// IMPORT DATSOURCE ////

// SCHEMA //

export const importVectorDatasourceOptionsSchema = vectorDatasourceSchema.merge(
  internalVectorImportSchema,
);
export const importRasterDatasourceOptionsSchema =
  rasterDatasourceSchema.merge(internalImportSchema);

// INFERRED TYPES //

export type ImportVectorDatasourceOptions = z.infer<
  typeof importVectorDatasourceOptionsSchema
>;
export type ImportRasterDatasourceOptions = z.infer<
  typeof importRasterDatasourceOptionsSchema
>;

// NATIVE TYPES //

export interface BaseImportDatasourceConfig {
  /** Path to store imported datasets after transformation, ready to be published or accessed via local web server for tests */
  dstPath: string;
  /** project package metadata */
  package: Package;
  /** geoprocessing metadata */
  gp: GeoprocessingJsonConfig;
}

/** Full configuration needed to import a dataset */
export type ImportVectorDatasourceConfig = ImportVectorDatasourceOptions &
  BaseImportDatasourceConfig;
export type ImportRasterDatasourceConfig = ImportRasterDatasourceOptions &
  BaseImportDatasourceConfig;
