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
 * Check if object is a SketchCollection and and narrows type to SketchCollection for any code in a block guarded by a call to this function.
 */
export const isCollection = (
  sketch: Sketch | SketchCollection
): sketch is SketchCollection => {
  return sketch.type === "FeatureCollection";
};

/**
 * Check if object is a Sketch and narrows type to Sketch for any code in a block guarded by a call to this function.
 */
export const isSketch = (
  sketch: Sketch | SketchCollection
): sketch is Sketch => {
  return sketch.type !== "FeatureCollection";
};
