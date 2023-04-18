import { z } from "zod";

//// SCHEMA ////

export const box2dSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const box3dSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const bboxSchema = box2dSchema.or(box3dSchema);

export const PLANNING_AREA_TYPES = ["eez", "other"] as const;
export const planningAreaTypesSchema = z.enum(PLANNING_AREA_TYPES);

export const projectSchema = z.object({
  bbox: bboxSchema,
  planningAreaType: planningAreaTypesSchema,
  planningAreaName: z.string(),
  externalLinks: z.record(z.string()),
});

//// INFERRED TYPES ////

export type Project = z.infer<typeof projectSchema>;
