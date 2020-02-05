import { Sketch, SketchCollection } from "./types";
import { GeoprocessingRequest } from "./types";
import "isomorphic-fetch";
export declare const fetchGeoJSON: (request: GeoprocessingRequest) => Promise<Sketch | SketchCollection>;
