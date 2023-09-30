import { z } from "zod";
import { bboxSchema } from "./geojson";

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
  /** Optional, defines external layer for visualizing the geography */
  layerId: z.string().optional(),
  /** Optional, sub-geography identifier. Useful when you have multiple groupings/levels of geographies and want to select for a specific group */
  groups: z.array(z.string()).optional(),
  /** Optional, defines whether or not precalc should be run for this geography, defaults to true if not present */
  precalc: z.boolean().optional(),
  /** Required if external datasource used, defines filter to constrain geography features, matches feature property having one or more specific values */
  propertyFilter: z
    .object({
      property: z.string(),
      values: z.array(z.string().or(z.number())),
    })
    .optional(),
  /** Optional, constrain datasource to smaller bbox */
  bboxFilter: bboxSchema.optional(),
});

export const geographiesSchema = z.array(geographySchema);

//// INFERRED TYPES ////

export type Geography = z.infer<typeof geographySchema>;
export type Geographies = z.infer<typeof geographiesSchema>;
