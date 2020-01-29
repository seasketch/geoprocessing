import { GeoprocessingHandlerOptions, SketchCollection, Sketch } from "./types";
export declare class GeoprocessingHandler<T> {
    func: (sketch: Sketch | SketchCollection) => Promise<T>;
    options: GeoprocessingHandlerOptions;
    constructor(func: (sketch: Sketch | SketchCollection) => Promise<T>, options: GeoprocessingHandlerOptions);
}
