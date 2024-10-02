import { JSONValue } from "../types/base.js";
import { hasOwnProperty } from "../helpers/native.js";

/**
 * Reorders object, mutating in place, in the order provided
 */
export const rekeyObject = (
  inputObject: Record<string, JSONValue>,
  idOrder: string[],
) => {
  const newObject: Record<string, JSONValue> = {};
  for (const id of idOrder) {
    if (hasOwnProperty(inputObject, id)) newObject[id] = inputObject[id];
  }

  // Put all other properties not in idOrder at the end
  for (const id of Object.keys(inputObject).filter(
    (id) => !idOrder.includes(id),
  )) {
    newObject[id] = inputObject[id];
  }
  return newObject;
};
