import { v4 as uuid } from "uuid";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import {
  isMetricArray,
  isMetricPack,
  packMetrics,
  unpackMetrics,
} from "../metrics/index.js";
import cloneDeep from "lodash/cloneDeep.js";
import { Metric } from "../types/metrics.js";
import { byteSize } from "../util/byteSize.js";
import { JSONValue } from "../types/base.js";
import { hasOwnProperty } from "../helpers/native.js";
import { chunk } from "../helpers/chunk.js";

export const commonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  // Serve stale while revalidating cache if < 24 hours old
  // don't revalidate if < 5 minutes old
  "Cache-Control": "max-age=30, stale-while-revalidate=86400",
};

export interface GeoprocessingTask<ResultType = any> {
  id: string;
  service: string;
  location: string;
  startedAt: string; //ISO 8601
  duration?: number; //ms
  logUriTemplate: string;
  geometryUri: string;
  status: GeoprocessingTaskStatus;
  wss: string; // websocket for listening to status updates
  data?: ResultType; // result data can take any json-serializable form
  error?: string;
  estimate: number;
  // ttl?: number;
}

export interface MetricGroupItem<ResultType = any> {
  duration?: number; //ms
  status: GeoprocessingTaskStatus;
  data?: ResultType; // result data can take any json-serializable form
}
export interface RootTaskItem<ResultType = any>
  extends MetricGroupItem<ResultType> {
  metricGroupItems: string[];
}

export enum GeoprocessingTaskStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

/**
 * Task model responsible for managing task results and estimates in DynamoDB
 */
export class TasksModel {
  /** task table */
  table: string;
  /** task estimate table */
  estimatesTable: string;
  /** database client */
  db: DynamoDB.DocumentClient;

  constructor(
    table: string,
    estimatesTable: string,
    db: DynamoDB.DocumentClient
  ) {
    this.table = table;
    this.estimatesTable = estimatesTable;
    this.db = db;
  }

  init(
    service: string,
    id?: string,
    wss?: string,
    startedAt?: string,
    duration?: number,
    status?: GeoprocessingTaskStatus,
    data?: any
  ) {
    id = id || uuid();
    const location = `/${service}/tasks/${id}`;
    const task: GeoprocessingTask = {
      id,
      service,
      wss: wss ? wss : `${location}/socket`,
      location,
      startedAt: startedAt || new Date().toISOString(),
      logUriTemplate: `${location}/logs{?limit,nextToken}`,
      geometryUri: `${location}/geometry`,
      status: status || GeoprocessingTaskStatus.Pending,
      estimate: 2,
    };

    return task;
  }

  async create(
    service: string,
    /** Cache key */
    id?: string,
    correlationId?: string,
    wss?: string
  ) {
    const task = this.init(service, id, wss);
    try {
      let estimate = await this.getMeanEstimate(task);
      task.estimate = estimate;
    } catch (e) {
      //can happen when testing, will default to 1 if can't get an estimate
    }

    await this.db
      .put({
        TableName: this.table,
        Item: {
          ...task,
          correlationIds: correlationId ? [correlationId] : [],
        },
      })
      .promise();
    return task;
  }

  async assignCorrelationId(
    service: string,
    taskId: string,
    correlationId: string
  ) {
    return this.db
      .update({
        TableName: this.table,
        Key: {
          id: taskId,
          service,
        },
        UpdateExpression:
          "set #correlationIds = list_append(#correlationIds, :val)",
        ExpressionAttributeNames: {
          "#correlationIds": "correlationIds",
        },
        ExpressionAttributeValues: {
          ":val": [correlationId],
        },
      })
      .promise();
  }

  async complete(
    task: GeoprocessingTask,
    results: any,
    options: { minSplitSizeBytes?: number } = {}
  ): Promise<APIGatewayProxyResult> {
    task.data = results;
    task.status = GeoprocessingTaskStatus.Completed;
    task.duration = new Date().getTime() - new Date(task.startedAt).getTime();

    const { rootResult, metricGroups } = this.splitSketchMetrics(results, {
      minSplitSizeBytes: options.minSplitSizeBytes,
    });
    const numMetricGroups = metricGroups.length;

    // Store root result as top-level dynamodb item
    await this.db
      .update({
        TableName: this.table,
        Key: {
          id: task.id,
          service: task.service,
        },
        UpdateExpression:
          "set #data = :data, #status = :status, #duration = :duration",
        ExpressionAttributeNames: {
          "#data": "data",
          "#status": "status",
          "#duration": "duration",
        },
        ExpressionAttributeValues: {
          ":data": rootResult,
          ":status": task.status,
          ":duration": task.duration,
        },
      })
      .promise();

    // If more than one metric group, store each one as a separate dynamdodb item
    if (numMetricGroups > 1) {
      const promises = metricGroups.map(async (metricGroup, index) => {
        return this.db
          .update({
            TableName: this.table,
            Key: {
              id: `${task.id}-metricGroup-${index}`,
              service: task.service,
            },
            UpdateExpression:
              "set #data = :data, #status = :status, #duration = :duration",
            ExpressionAttributeNames: {
              "#data": "data",
              "#status": "status",
              "#duration": "duration",
            },
            ExpressionAttributeValues: {
              ":data": { metrics: packMetrics(metricGroup) },
              ":status": task.status,
              ":duration": task.duration,
            },
          })
          .promise();
      });
      await Promise.all(promises);
    }

    return {
      statusCode: 200,
      headers: {
        ...commonHeaders,
        "x-gp-cache": "Cache miss",
      },
      body: JSON.stringify(task),
    };
  }

  async updateEstimate(task: GeoprocessingTask) {
    let duration: number = task.duration ? task.duration : 0;
    let service: string = task.service;
    let meanEstimate = 0;

    try {
      const response = await this.db
        .get({
          TableName: this.estimatesTable,
          Key: {
            service,
          },
        })
        .promise();

      let taskItem = response.Item;

      //@ts-ignore
      if (taskItem && taskItem?.allEstimates) {
        //@ts-ignore
        let allEstimates: number[] = taskItem?.allEstimates;
        //cap it at five for estimate avg
        if (allEstimates.length >= 5) {
          allEstimates.pop();
        }
        allEstimates.push(duration);

        let meanEstimate = Math.round(
          allEstimates.reduce((a, b) => a + b, 0) / allEstimates.length
        );

        await this.db
          .update({
            TableName: this.estimatesTable,
            Key: {
              service: task.service,
            },
            UpdateExpression:
              "set #allEstimates = :allEstimates,  #meanEstimate = :meanEstimate",
            ExpressionAttributeNames: {
              "#allEstimates": "allEstimates",
              "#meanEstimate": "meanEstimate",
            },
            ExpressionAttributeValues: {
              ":allEstimates": allEstimates,
              ":meanEstimate": meanEstimate,
            },
          })
          .promise();
      } else {
        meanEstimate = duration;
        //no estimates yet
        await this.db
          .update({
            TableName: this.estimatesTable,
            Key: {
              service: task.service,
            },
            UpdateExpression:
              "set #allEstimates = :allEstimates, #meanEstimate = :meanEstimate",
            ExpressionAttributeNames: {
              "#allEstimates": "allEstimates",
              "#meanEstimate": "meanEstimate",
            },
            ExpressionAttributeValues: {
              ":allEstimates": [duration],
              ":meanEstimate": meanEstimate,
            },
          })
          .promise();
      }
      return meanEstimate;
    } catch (e) {
      console.warn("unable to append duration estimate: ", e);
    }
  }

  async fail(
    task: GeoprocessingTask,
    errorDescription: string,
    error?: Error
  ): Promise<APIGatewayProxyResult> {
    if (error) console.error(error);
    task.status = GeoprocessingTaskStatus.Failed;
    task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
    task.error = errorDescription;
    await this.db
      .update({
        TableName: this.table,
        Key: {
          id: task.id,
          service: task.service,
        },
        UpdateExpression:
          "set #error = :error, #status = :status, #duration = :duration",
        ExpressionAttributeNames: {
          "#error": "error",
          "#status": "status",
          "#duration": "duration",
        },
        ExpressionAttributeValues: {
          ":error": errorDescription,
          ":status": task.status,
          ":duration": task.duration,
        },
      })
      .promise();
    return {
      statusCode: 500,
      headers: {
        ...commonHeaders,
        "Cache-Control": "max-age=0",
      },
      body: JSON.stringify(task),
    };
  }

  async get(
    service: string,
    taskId: string
  ): Promise<GeoprocessingTask | undefined> {
    try {
      // Get root item
      const rootResponse = await this.db
        .get({
          TableName: this.table,
          Key: {
            id: taskId,
            service,
          },
        })
        .promise();
      let rootResult = rootResponse.Item as RootTaskItem;

      // Check for sketch metric items and re-merge them with root item if found
      if (
        rootResult.data &&
        rootResult.data.numMetricGroups &&
        rootResult.data.numMetricGroups > 0
      ) {
        var metricGroupBatchParams = {
          RequestItems: {
            [this.table]: {
              Keys: Array.from(
                Array(rootResult.data.numMetricGroups).keys()
              ).map((index) => ({
                id: `${taskId}-metricGroup-${index}`,
                service,
              })),
            },
          },
        };

        const metricGroupResult = await this.db
          .batchGet(metricGroupBatchParams)
          .promise();

        if (
          metricGroupResult.Responses &&
          metricGroupResult.Responses[this.table]
        ) {
          const metricGroupItems = metricGroupResult.Responses[
            this.table
          ] as MetricGroupItem[];
          rootResult.data.metrics = this.unsplitSketchMetrics(metricGroupItems);
        } else {
          console.warn(`No child items found for: ${taskId}`);
        }
      } else if (
        rootResult.data &&
        rootResult.data.metrics &&
        isMetricPack(rootResult.data.metrics)
      ) {
        rootResult.data.metrics = unpackMetrics(rootResult.data.metrics);
      }

      return rootResult as unknown as GeoprocessingTask;
    } catch (e) {
      return undefined;
    }
  }

  async getMeanEstimate(task: GeoprocessingTask): Promise<number> {
    let service = task.service;
    const response = await this.db
      .get({
        TableName: this.estimatesTable,
        Key: {
          service,
        },
      })
      .promise();
    let meanEstimate: number = response.Item?.meanEstimate;
    return meanEstimate;
  }

  /**
   * Split function result into multple items if more object with metrics for more than one sketch
   * @param rootResult
   * @param minSplitSizeBytes rootResult over this size in bytes (when converted to JSON string) will be split. defaults to 350KB, just under 400KB dynamodb limit per item
   * @returns rootResult with metrics removed, and metricsBySketch individual sketch results keyed by sketchId
   */
  private splitSketchMetrics(
    rootResult: JSONValue,
    options: { minSplitSizeBytes?: number } = {}
  ) {
    const minSplitSizeBytes = options.minSplitSizeBytes || 350 * 1024;
    const rootData = cloneDeep(rootResult);
    const rootString = JSON.stringify(rootData);
    const resultSize = byteSize(rootString);
    let metricGroups: Metric[][] = [];

    if (
      typeof rootResult === "object" &&
      rootResult !== null &&
      hasOwnProperty(rootResult, "metrics") &&
      isMetricArray(rootResult.metrics)
    ) {
      const shouldSplit = resultSize > minSplitSizeBytes;

      if (shouldSplit) {
        console.log(
          `Result size of ${resultSize} bytes exceeds ${minSplitSizeBytes} threshold, splitting into multiple db items`
        );

        // Split metrics into groups that will fit within size limit
        const clonedMetrics = cloneDeep(rootResult.metrics as Metric[]);
        const metricSize = byteSize(JSON.stringify(clonedMetrics));
        const numGroups = Math.ceil(metricSize / minSplitSizeBytes);
        const chunkSize = Math.ceil(clonedMetrics.length / numGroups);
        metricGroups = chunk(clonedMetrics, chunkSize);

        // @ts-ignore
        rootData.numMetricGroups = metricGroups.length;
        // @ts-ignore
        rootData.metrics = []; // clear it
      } else {
        // @ts-ignore
        rootData.metrics = packMetrics(rootData.metrics); // just pack the original metrics
      }
    }

    return { rootResult: rootData, metricGroups };
  }

  /**
   * Given child task item array, returns them unpacked and merged into a single array
   */
  private unsplitSketchMetrics(metricGroupItems: MetricGroupItem[]) {
    let aggMetrics: Metric[] = [];
    for (let i = 0; i < metricGroupItems.length; i++) {
      const metricGroupItem = metricGroupItems[i];

      if (metricGroupItem.data && metricGroupItem.data.metrics) {
        const newMetrics = isMetricPack(metricGroupItem.data.metrics)
          ? unpackMetrics(metricGroupItem.data.metrics)
          : metricGroupItem.data.metrics;

        aggMetrics = aggMetrics.concat(newMetrics);
      }
    }
    return aggMetrics;
  }
}
