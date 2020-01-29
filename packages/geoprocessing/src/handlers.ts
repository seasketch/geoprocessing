import { GeoprocessingHandlerOptions, SketchCollection, Sketch } from "./types";

export class GeoprocessingHandler<T> {
  func: (sketch: Sketch | SketchCollection) => Promise<T>;
  options: GeoprocessingHandlerOptions;

  constructor(
    func: (sketch: Sketch | SketchCollection) => Promise<T>,
    options: GeoprocessingHandlerOptions
  ) {
    this.func = func;
    this.options = options;
  }
}
