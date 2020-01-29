import { GeoprocessingHandlerOptions, SketchCollection } from "./types";
import { Feature } from "geojson";

export class GeoprocessingHandler<T> {
  func: (sketch: Feature | SketchCollection) => Promise<T>;
  options: GeoprocessingHandlerOptions;

  constructor(
    func: (sketch: Feature | SketchCollection) => Promise<T>,
    options: GeoprocessingHandlerOptions
  ) {
    this.func = func;
    this.options = options;
  }
}
