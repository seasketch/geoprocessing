import { z } from "zod";
import { bboxSchema } from "./geojson.js";

//// SCHEMA ////

export const PLANNING_AREA_TYPES = ["eez", "other"] as const;
export const planningAreaTypesSchema = z.enum(PLANNING_AREA_TYPES);

export const projectSchema = z.object({
  bbox: bboxSchema,
  planningAreaType: planningAreaTypesSchema,
  planningAreaId: z.string(),
  planningAreaName: z.string(),
  externalLinks: z.record(z.string()),
});

//// INFERRED TYPES ////

export type Project = z.infer<typeof projectSchema>;
