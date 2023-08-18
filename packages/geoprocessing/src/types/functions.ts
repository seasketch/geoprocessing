import { z } from "zod";

/**
 * Default set of additional parameters that a geoprocessing or preprocessing function can accept
 * Override or extend as needed with more specific types, and use .parse() function to validate your input
 */
export const extraParamsSchema = z.object({
  geographies: z.array(z.string()).optional(),
  eezs: z.array(z.string()).optional(),
});

//// INFERRED TYPES ////

export type FunctionExtraParams = z.infer<typeof extraParamsSchema>;
