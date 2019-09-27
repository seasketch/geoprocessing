import { Sketch, GeoprocessingService, GeoprocessingTaskStatus } from "@seasketch/serverless-geoprocessing";
/**
 * Essentially GeoprocessingTask but with some properties changed
 * to optional since the client will not have all these values
 * immediately.
 *
 * @export
 * @interface TaskState
 */
export interface TaskState {
    sketch: Sketch;
    id: string;
    service: string;
    location?: string;
    startedAt: Date;
    duration?: number;
    logUriTemplate?: string;
    geometryUri?: string;
    status: GeoprocessingTaskStatus;
    wss?: string;
    data?: any;
    error?: string;
    ttl?: number;
}
declare class TaskRunner extends EventTarget {
    pendingTasks: Array<TaskState>;
    constructor();
    private updatePendingTask;
    request(sketch: Sketch, service: GeoprocessingService): Promise<TaskState>;
}
export default TaskRunner;
