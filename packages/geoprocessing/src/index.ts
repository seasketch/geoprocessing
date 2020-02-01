// import area from "@turf/area";
export { Sketch, SketchCollection } from "./types";
export { GeoprocessingHandler } from "./handlers";
export { getExampleSketches, writeResultOutput } from "./testing/index";
// import sketchArea from "@turf/area";
export { default as sketchArea } from "@turf/area";
export { version } from "../package.json";
export const quickTest = (foo: string): string => foo + foo;
