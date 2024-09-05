import { JSONValue } from "../types/base.js";

/**
 * Reorders object, mutating in place, in the order provided
 */
export const rekeyObject = (
  object: Record<string, JSONValue>,
  idOrder: string[],
) => {
  const newObject: Record<string, JSONValue> = {};
  idOrder.forEach((id) => {
    if (object.hasOwnProperty(id)) newObject[id] = object[id];
  });

  // Put all other properties not in idOrder at the end
  Object.keys(object)
    .filter((id) => !idOrder.includes(id))
    .forEach((id) => {
      newObject[id] = object[id];
    });
  return newObject;
};
