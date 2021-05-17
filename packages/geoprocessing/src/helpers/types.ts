import { Sketch, SketchCollection } from "../types";

/**
 * Type narrowing to allow property checking when object can be multiple types
 * https://fettblog.eu/typescript-hasownproperty/
 * */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

/**
 * Check if object is a SketchCollection and return with that type.  Useful for narrowing mixed use data structures
 */
export const isCollection = (
  sketch: Sketch | SketchCollection
): sketch is SketchCollection => {
  return sketch.type === "FeatureCollection";
};

/**
 * Check if object is a Sketch and return with that type.  Useful for narrowing mixed use data structures
 */
export const isSketch = (
  sketch: Sketch | SketchCollection
): sketch is SketchCollection => {
  return sketch.type !== "FeatureCollection";
};
