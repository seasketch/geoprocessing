import { DefaultExtraParams } from "../types";

/**
 * Returns first element from param object at paramName key.  Parameter can be string or array of strings
 * @param paramName name of array parameter to extract from extraParams
 * @param params the object containing parameters
 * @returns the first element in the array parameter
 * @throws if param is missing or its array is empty
 */
export const getFirstFromParam = <P extends DefaultExtraParams>(
  paramName: string,
  params: P
): string => {
  const paramValue = params[paramName];
  let firstValue: string | undefined = undefined;

  if (Array.isArray(paramValue)) {
    const arrayVal = getParamStringArray(paramName, params);
    if (arrayVal) firstValue = arrayVal[0];
  } else {
    firstValue = paramValue;
  }
  if (!firstValue)
    throw new Error(
      `String or string array at parameter ${paramName} expected, found ${JSON.stringify(
        paramValue
      )}`
    );
  return firstValue;
};

/**
 * Validates and returns string[] parameter from extraParams.  If param missing it returns an empty array
 * @param paramName name of array parameter to extract from extraParams
 * @param params parameter object
 * @returns string[]
 * @throws Error if parameter contains non-string values
 */
export const getParamStringArray = <P extends DefaultExtraParams>(
  paramName: string,
  params: P
): string[] | undefined => {
  const paramValue = params[paramName];
  if (Array.isArray(paramValue)) {
    if (paramValue.length === 0) {
      console.log(`Parameter ${paramName} is an empty array`);
      return undefined;
    }
    paramValue.forEach((arrayVal) => {
      if (typeof arrayVal !== "string") {
        throw new Error(
          `${paramName} must contain all strings, received ${JSON.stringify(
            arrayVal
          )}`
        );
      }
    });
    return paramValue;
  }
  return undefined;
};
