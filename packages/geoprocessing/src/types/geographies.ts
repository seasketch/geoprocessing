import { z } from "zod";

/**
 * A geographic area (Polygon) for planning.  Typically used to represent a planning area
 */
export const geographySchema = z.object({
  /** Unique name of the geography */
  geographyId: z.string(),
  /** ID of datasource containing geography boundary */
  datasourceId: z.string(),
  /** Display name for the geography */
  display: z.string(),
  /** Optional, defines property to use to uniquely identify geography, if geography is within larger multi-record datasource */
  geographyProperty: z.string().optional(),
  /** Optional, defines property value that uniquely identifies geography, if geography is within larger multi-record datasource */
  propertyValue: z.string().optional(),
  /** Optional, defines external layer for visualizing the geography */
  layerId: z.string().optional(),
  /** Optional, sub-geography identifier. Useful when you have multiple groupings/levels of geographies and want to select for a specific group */
  groups: z.array(z.string()).optional(),
  /** Optional, whether or not precalc should be run for this geography, defaults to true if not present */
  precalc: z.boolean().optional(),
});

export const geographiesSchema = z.array(geographySchema);

//// INFERRED TYPES ////

export type Geography = z.infer<typeof geographySchema>;
export type Geographies = z.infer<typeof geographiesSchema>;
