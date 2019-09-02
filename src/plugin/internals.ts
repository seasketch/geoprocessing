// Internal API accessible to geoprocessing function implementations
import TaskModel, { GeoprocessingTask } from '../tasks';
import { fetchGeoJSON } from '../geometry';

export default {
  TaskModel,
  fetchGeoJSON
};

export type GeoprocessingTask = GeoprocessingTask;