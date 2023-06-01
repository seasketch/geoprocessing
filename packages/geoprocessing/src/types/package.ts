import { z } from "zod";

/**
 * Package metadata stored in top-level package.json.  Partial definition for pieces used by this library
 */
export const packageSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  license: z.string(),
  homepage: z.string().optional(),
  bugs: z.record(z.string()).optional(),
  repository: z.record(z.string()).optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  scripts: z.record(z.string()).optional(),
});

//// INFERRED TYPES ////

/** Represents a single JS package */
export type Package = z.infer<typeof packageSchema>;
