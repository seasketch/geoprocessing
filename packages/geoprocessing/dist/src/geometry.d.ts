import { Sketch, SketchCollection } from "./types";
import { GeoprocessingRequest } from "./types";
export declare const fetchGeoJSON: (request: GeoprocessingRequest) => Promise<Sketch | SketchCollection>;
