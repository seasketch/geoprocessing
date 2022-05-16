/**
 * Object.keys helper that returns strongly typed key values.  Uses assertion so make sure your type covers all the keys!
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;
