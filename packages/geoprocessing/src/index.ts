import { Sketch, SketchCollection } from "./types";
const isCollection = (
  sketch: Sketch | SketchCollection
): sketch is SketchCollection => {
  return sketch.type === "FeatureCollection";
};
export { Sketch, SketchCollection, isCollection };
export { GeoprocessingHandler } from "./GeoprocessingHandler";
import sketchArea from "@turf/area";
export { sketchArea };
export { version } from "../package.json";

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
    a => a.exportId === exportid
  );
  return found?.value || defaultValue;
}
