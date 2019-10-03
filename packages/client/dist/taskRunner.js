"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const serverless_geoprocessing_1 = require("@seasketch/serverless-geoprocessing");
const uuid_1 = require("uuid");
class TaskRunner extends EventTarget {
    constructor() {
        super();
        this.pendingTasks = [];
    }
    updatePendingTask(taskDetail) {
        this.pendingTasks = [
            ...this.pendingTasks.filter(t => t.sketchProperties !== taskDetail.sketchProperties)
        ];
        if (taskDetail.status === serverless_geoprocessing_1.GeoprocessingTaskStatus.Pending) {
            this.pendingTasks.push(taskDetail);
            this.pendingTasks.sort((a, b) => a.service.localeCompare(b.service));
        }
    }
    async request(sketchProperties, geometryUri, service) {
        const existing = this.pendingTasks.find(t => t.sketchProperties === sketchProperties ||
            t.sketchProperties.id === sketchProperties.id);
        if (existing) {
            return existing;
        }
        else {
            const taskDetail = {
                // TODO: generate cachekeys properly
                id: uuid_1.v4(),
                sketchProperties,
                service: service.id,
                executionMode: service.executionMode,
                startedAt: new Date(),
                status: serverless_geoprocessing_1.GeoprocessingTaskStatus.Pending
            };
            this.pendingTasks.push(taskDetail);
            this.pendingTasks.sort((a, b) => a.service.localeCompare(b.service));
            this.dispatchEvent(new CustomEvent("update", { detail: taskDetail }));
            let payload = {
                geometryUri: geometryUri,
                cacheKey: taskDetail.id
            };
            try {
                const response = await isomorphic_fetch_1.default(service.location, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                const task = await response.json();
                const taskDetail = {
                    ...task,
                    startedAt: new Date(task.startedAt),
                    sketchProperties
                };
                this.updatePendingTask(taskDetail);
                this.dispatchEvent(new CustomEvent("update", {
                    detail: taskDetail
                }));
                return taskDetail;
            }
            catch (e) {
                this.updatePendingTask({
                    ...taskDetail,
                    error: e.toString()
                });
                return taskDetail;
            }
        }
    }
}
exports.default = TaskRunner;
