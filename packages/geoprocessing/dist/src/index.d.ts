import { Sketch, SketchCollection } from "./types";
declare const isCollection: (sketch: Sketch | SketchCollection) => sketch is SketchCollection;
export { Sketch, SketchCollection, isCollection };
export { GeoprocessingHandler } from "./handlers";
import sketchArea from "@turf/area";
export { sketchArea };
export { version } from "../package.json";
