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

export const projectSchema = z.object({
  bbox: bboxSchema,
  noun: z.string(),
  nounPossessive: z.string(),
  externalLinks: z.record(z.string()),
  /** Datasources for clipping sketches keyed by boundary name */
  clipDatasources: z.record(z.string()),
});

//// INFERRED TYPES ////

export type Project = z.infer<typeof projectSchema>;
