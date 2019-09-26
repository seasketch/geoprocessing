import { SeaSketchGeoprocessingSettings } from "./src/handlers";
export {
  isSeaSketchFeature,
  isSeaSketchFeatureCollection
} from "./src/geometry";
export {
  GeoprocessingProject,
  GeoprocessingService,
  ReportClient,
  ReportTab
} from "./src/metadata";
import { Sketch } from "./src/geometry";
export { default as pluginInternals } from "./src/plugin/internals";
export { GeoprocessingTask, GeoprocessingTaskStatus } from "./src/tasks";

export type SeaSketchGeoprocessingSettings = SeaSketchGeoprocessingSettings;
export type Sketch = Sketch;
// export type GeoprocessingTask = GeoprocessingTask;
