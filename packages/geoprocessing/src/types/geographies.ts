import { polygonSchema, multipolygonSchema } from ".";
import { z } from "zod";

/**
 * A geographic area (Polygon) for planning.  Typically used to represent a planning area
 */
export const geographySchema = z.object({
  /** Unique name of the geography */
  geographyId: z.string(),
  /** Optional unique id of the datasource containing geographic boundary.  If not provided, then geometry must be provided */
  datasourceId: z.string().optional(),
  /** Optional GeoJSON representing geographic boundary */
  geometry: polygonSchema.or(multipolygonSchema).optional(),
  /** Display name for the geography */
  display: z.string(),
});

//// INFERRED TYPES ////

export type Geography = z.infer<typeof geographySchema>;
