import { Sketch, SketchCollection } from "./types";
const isCollection = (
  sketch: Sketch | SketchCollection
): sketch is SketchCollection => {
  return sketch.type === "FeatureCollection";
};
export { Sketch, SketchCollection, isCollection };
export { GeoprocessingHandler } from "./handlers";
import sketchArea from "@turf/area";
export { sketchArea };
export { version } from "../package.json";
export { default as Card } from "./components/Card";
export { default as ResultsCard } from "./components/ResultsCard";
export { useFunction } from "./hooks/useFunction";
export { default as SketchAttributesCard } from "./components/SketchAttributesCard";
