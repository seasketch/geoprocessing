import { polygonSchema, multipolygonSchema } from ".";
import { z } from "zod";

/**
 * A geographic area (Polygon) for planning.  Typically used to represent a planning area
 */
export const geographySchema = z.object({
  /** Unique name of the geography */
  geographyId: z.string(),
  /** Optional unique id of the datasource containing geographic boundary */
  datasourceId: z.string(),
  /** Display name for the geography */
  display: z.string(),
});

export const geographiesSchema = z.array(geographySchema);

//// INFERRED TYPES ////

export type Geography = z.infer<typeof geographySchema>;
export type Geographies = z.infer<typeof geographiesSchema>;
