const isCollection = (sketch) => {
    return sketch.type === "FeatureCollection";
};
export { isCollection };
export { GeoprocessingHandler } from "./handlers";
import sketchArea from "@turf/area";
export { sketchArea };
export { version } from "../package.json";
export { default as Card } from "./components/Card";
export { default as ResultsCard } from "./components/ResultsCard";
export { useFunction } from "./hooks/useFunction";
export { default as SketchAttributesCard } from "./components/SketchAttributesCard";
//# sourceMappingURL=index.js.map