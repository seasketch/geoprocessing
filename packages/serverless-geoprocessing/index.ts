import { SeaSketchGeoprocessingSettings } from "./src/handlers";
import { isSeaSketchFeature, isSeaSketchFeatureCollection, Sketch } from './src/geometry';
// @ts-ignore
import pluginInternals from './src/plugin/internals';

export {
  isSeaSketchFeature,
  isSeaSketchFeatureCollection,
  Sketch,
  pluginInternals,
  SeaSketchGeoprocessingSettings
}
// module.exports = plugin;