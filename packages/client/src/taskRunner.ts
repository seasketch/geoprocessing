import fetch from "isomorphic-fetch";
import {
  Sketch,
  GeoprocessingService,
  GeoprocessingTaskStatus,
  GeoprocessingTask,
  SketchProperties
} from "@seasketch/serverless-geoprocessing";
import { GeoprocessingRequest } from "@seasketch/serverless-geoprocessing";
import { v4 as uuid } from "uuid";

/**
 * Essentially GeoprocessingTask but with some properties changed
 * to optional since the client will not have all these values
 * immediately.
 *
 * @export
 * @interface TaskState
 */
export interface TaskState {
  sketchProperties: SketchProperties;
  id: string;
  service: string;
  location?: string;
  startedAt: Date;
  duration?: number; //ms
  logUriTemplate?: string;
  geometryUri?: string;
  status: GeoprocessingTaskStatus;
  wss?: string; // websocket for listening to status updates
  data?: any; // result data can take any json-serializable form
  error?: string;
  ttl?: number;
}

class TaskRunner extends EventTarget {
  pendingTasks: Array<TaskState> = [];
  constructor() {
    super();
  }

  private updatePendingTask(taskDetail: TaskState) {
    this.pendingTasks = [
      ...this.pendingTasks.filter(
        t => t.sketchProperties !== taskDetail.sketchProperties
      )
    ];
    if (taskDetail.status === GeoprocessingTaskStatus.Pending) {
      this.pendingTasks.push(taskDetail);
      this.pendingTasks.sort((a, b) => a.service.localeCompare(b.service));
    }
  }

  async request(
    sketchProperties: SketchProperties,
    geometryUri: string,
    service: GeoprocessingService
  ): Promise<TaskState> {
    const existing = this.pendingTasks.find(
      t =>
        t.sketchProperties === sketchProperties ||
        t.sketchProperties.id === sketchProperties.id
    );
    if (existing) {
      return existing;
    } else {
      const taskDetail = {
        // TODO: generate cachekeys properly
        id: uuid(),
        sketchProperties,
        service: service.id,
        executionMode: service.executionMode,
        startedAt: new Date(),
        status: GeoprocessingTaskStatus.Pending
      };
      this.pendingTasks.push(taskDetail);
      this.pendingTasks.sort((a, b) => a.service.localeCompare(b.service));
      this.dispatchEvent(
        new CustomEvent<TaskState>("update", { detail: taskDetail })
      );
      let payload: GeoprocessingRequest = {
        geometryUri: geometryUri,
        cacheKey: taskDetail.id
      };
      try {
        const response = await fetch(service.location, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const task: GeoprocessingTask = await response.json();
        const taskDetail = {
          ...task,
          startedAt: new Date(task.startedAt),
          sketchProperties
        };
        this.updatePendingTask(taskDetail);
        this.dispatchEvent(
          new CustomEvent<TaskState>("update", {
            detail: taskDetail
          })
        );
        return taskDetail;
      } catch (e) {
        this.updatePendingTask({
          ...taskDetail,
          error: e.toString()
        });
        return taskDetail;
      }
    }
  }
}

export default TaskRunner;
