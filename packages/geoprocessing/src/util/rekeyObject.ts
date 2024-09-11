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
  idOrder.forEach((id) => {
    if (hasOwnProperty(inputObject, id)) newObject[id] = inputObject[id];
  });

  // Put all other properties not in idOrder at the end
  Object.keys(inputObject)
    .filter((id) => !idOrder.includes(id))
    .forEach((id) => {
      newObject[id] = inputObject[id];
    });
  return newObject;
};
