/**
 * Hack to make import work with "type": "module".
 */
import canonicalize from "canonicalize";

export default canonicalize as unknown as typeof canonicalize.default;
