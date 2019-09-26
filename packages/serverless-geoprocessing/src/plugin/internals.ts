// Internal API accessible to geoprocessing function implementations
import TaskModel, { GeoprocessingTask } from "../tasks";
import { fetchGeoJSON } from "../geometry";
import { handlerFactory } from "../handlers";
import { handler as metadataHandler } from "../metadata";
export default {
  TaskModel,
  fetchGeoJSON,
  handlerFactory,
  metadataHandler
};

export type GeoprocessingTask = GeoprocessingTask;
