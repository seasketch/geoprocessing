import { z } from "zod";

/**
 * Schema for npm package.json metadata, as found in the wild
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
  private: z.boolean().optional(),
  type: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  repositoryUrl: z.string().optional(),
});

/**
 * Stricter schema for npm package.json metadata, with most fields guaranteed present
 */
export const loadedPackageSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  license: z.string(),
  homepage: z.string().optional(),
  bugs: z.record(z.string()).optional(),
  repository: z.record(z.string()).optional(),
  dependencies: z.record(z.string()),
  devDependencies: z.record(z.string()).optional(),
  scripts: z.record(z.string()),
  private: z.boolean(),
  type: z.string().optional(),
  keywords: z.array(z.string()),
  repositoryUrl: z.string().optional(),
});

//// INFERRED TYPES ////

/** Represents a single JS package */
export type Package = z.infer<typeof packageSchema>;
export type LoadedPackage = z.infer<typeof loadedPackageSchema>;
