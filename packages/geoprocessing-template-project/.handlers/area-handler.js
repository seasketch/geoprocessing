// Generated file. Edit the contents of serverless.yml to change output.
const { 
  pluginInternals, 
  GeoprocessingTask, 
  Sketch,
  SeaSketchGeoprocessingSettings
} = require("@seasketch/serverless-geoprocessing");
const { TaskModel, fetchGeoJSON, handlerFactory } = pluginInternals;
const func = require('./area').default;

const settings = {
  "executionMode": "sync",
  "restrictedAccess": false,
  "serviceName": "area",
  "tasksTable": "GeoprocessingTemplateProject-tasks"
};
module.exports = {
  handler: handlerFactory(func, settings)
};
