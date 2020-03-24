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
