import { SketchProperties } from "../types/index.js";
import md5 from "spark-md5";
import canonicalize from "../util/canonicalize.js";

/**
 * Generates a cache key for a geoprocessing request, given sketch properties and optional extra parameters (must be JSON compatible object)
 * Extra parameters are canonicalized and hashed using md5 to ensure cache key is consistent.  Canonicalization ensures object keys are consistent
 * but not arrays.  If you use arrays as extraParam values, make sure the order stays the same and sort first if needed to generate a consistent cache key.
 */
export const genTaskCacheKey = (
  service: string,
  /** Properties of sketch to generate cache key for */
  props: SketchProperties,
  /** Extra parameters to include in cache key */
  extraParams: Record<string, unknown> = {},
) => {
  let cacheKey = `${service}-${props.id}-${props.updatedAt}`;
  if (Object.keys(extraParams).length > 0) {
    // Ensure JSON object has consistent stringification
    const canon = canonicalize(extraParams);
    // Hash the stringified JSON object
    const hash = md5.hash(JSON.stringify(canon));
    // Append the hash to the cache key to keep the key semi-human-readable
    cacheKey = `${cacheKey}-${hash}`;
  }
  return cacheKey;
};
