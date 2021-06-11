import { Sketch, SketchCollection } from "../types";
import { isSketch } from "./types";
/**
 * UserAttributes are those filled in via the attributes form specified as
 * part of a SketchClass. This getter function is easier to use than searching
 * the Sketch.properties.userAttributes array, supports default values, and is
 * easier to use with typescript.
 */
export function getUserAttribute<T>(
  sketch: Sketch,
  exportid: string
): T | undefined;
export function getUserAttribute<T>(
  sketch: Sketch,
  exportid: string,
  defaultValue: T
): T;
export function getUserAttribute<T>(
  sketch: Sketch,
  exportid: string,
  defaultValue?: T
) {
  let found = sketch.properties.userAttributes.find(
    (a) => a.exportId === exportid
  );
  return found?.value || defaultValue;
}

/** Helper to convert a Sketch or SketchCollection to a Sketch array */
export function toSketchArray(input: Sketch | SketchCollection) {
  if (isSketch(input)) {
    return [input];
  } else {
    return input.features;
  }
}
