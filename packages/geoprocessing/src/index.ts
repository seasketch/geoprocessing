import { Sketch, SketchCollection } from "./types";
const isCollection = (
  sketch: Sketch | SketchCollection
): sketch is SketchCollection => {
  return sketch.type === "FeatureCollection";
};
export { Sketch, SketchCollection, isCollection };
export { GeoprocessingHandler } from "./GeoprocessingHandler";

export { PreprocessingHandler, ValidationError } from "./PreprocessingHandler";
import sketchArea from "@turf/area";
export { sketchArea };
export { version } from "../package.json";
export { VectorDataSource, VectorFeature } from "./VectorDataSource";
export * from "./helpers";

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
