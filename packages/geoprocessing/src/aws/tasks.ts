import { v4 as uuid } from "uuid";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBDocument,
  UpdateCommand,
  PutCommand,
  GetCommand,
  QueryCommand,
  paginateQuery,
  DynamoDBDocumentPaginationConfiguration,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import { JSONValue } from "../types/base.js";
import { toJsonFile } from "../helpers/fs.js";

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
export default class TasksModel {
  /** task table */
  table: string;
  /** task estimate table */
  estimatesTable: string;
  /** database client */
  db: DynamoDBDocument;

  constructor(table: string, estimatesTable: string, db: DynamoDBDocument) {
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
    data?: any,
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
    wss?: string,
  ) {
    const task = this.init(service, id, wss);
    try {
      let estimate = await this.getMeanEstimate(task);
      task.estimate = estimate;
    } catch (e) {
      //can happen when testing, will default to 1 if can't get an estimate
    }

    await this.db.send(
      new PutCommand({
        TableName: this.table,
        Item: {
          ...task,
        },
      }),
    );
    return task;
  }

  /**
   * @param task
   * @param results - JSON serializable object, with no string larger than 400KB without a space character.  Spaces are used to chunk result
   * @param options
   * @returns
   */
  async complete(
    task: GeoprocessingTask,
    results: any,
    options: { minSplitSizeBytes?: number } = {},
  ): Promise<APIGatewayProxyResult> {
    task.data = results;
    task.status = GeoprocessingTaskStatus.Completed;
    task.duration = new Date().getTime() - new Date(task.startedAt).getTime();

    const tsStrings = Date.now();
    console.time(`split strings - ${tsStrings}`);
    const jsonStrings = this.toJsonStrings(results, {
      minSplitSizeBytes: options.minSplitSizeBytes,
    });
    console.timeEnd(`split strings - ${tsStrings}`);
    const numJsonStrings = jsonStrings.length;

    // Update root task
    const tsRootChunk = Date.now();
    console.time(`save root - ${tsRootChunk}`);
    await this.db.send(
      new UpdateCommand({
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
          ":data": { numChunks: numJsonStrings },
          ":status": task.status,
          ":duration": task.duration,
        },
      }),
    );
    console.timeEnd(`save root - ${tsRootChunk}`);

    // const jsonStringsHash = jsonStrings.reduce<Record<string, string>>(
    //   (acc, curString, index) => {
    //     return { [index]: curString, ...acc };
    //   },
    //   {}
    // );
    // toJsonFile(jsonStringsHash, "./chunk_toJsonStrings.json");

    // Store each JSON substring as a separate dynamodb item, with chunk index
    // all under same partition key (task.id) as root item for easy retrieval
    console.log(`Saving ${jsonStrings.length} chunks`);
    const promises = jsonStrings.map(async (chunk, index) => {
      console.log("chunk", chunk);
      console.log(`Chunk ${index} - ${chunk.length} length`);
      return this.db.send(
        new UpdateCommand({
          TableName: this.table,
          Key: {
            id: task.id,
            service: `${task.service}-chunk-${index}`,
          },
          UpdateExpression:
            "set #data = :data, #status = :status, #duration = :duration",
          ExpressionAttributeNames: {
            "#data": "data",
            "#status": "status",
            "#duration": "duration",
          },
          ExpressionAttributeValues: {
            ":data": { chunk: chunk },
            ":status": task.status,
            ":duration": task.duration,
          },
        }),
      );
    });
    const tsSaveChunk = Date.now();
    console.time(`save chunks - ${tsSaveChunk}`);
    await Promise.all(promises);
    console.timeEnd(`save chunks - ${tsSaveChunk}`);

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
      const response = await this.db.send(
        new GetCommand({
          TableName: this.estimatesTable,
          Key: {
            service,
          },
        }),
      );

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
          allEstimates.reduce((a, b) => a + b, 0) / allEstimates.length,
        );

        await this.db.send(
          new UpdateCommand({
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
          }),
        );
      } else {
        meanEstimate = duration;
        //no estimates yet
        await this.db.send(
          new UpdateCommand({
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
          }),
        );
      }
      return meanEstimate;
    } catch (e) {
      console.warn("unable to append duration estimate: ", e);
    }
  }

  async fail(
    task: GeoprocessingTask,
    errorDescription: string,
    error?: Error,
  ): Promise<APIGatewayProxyResult> {
    if (error) console.error(error);
    task.status = GeoprocessingTaskStatus.Failed;
    task.duration = new Date().getTime() - new Date(task.startedAt).getTime();
    task.error = errorDescription;
    await this.db.send(
      new UpdateCommand({
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
      }),
    );
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
    taskId: string,
  ): Promise<GeoprocessingTask | undefined> {
    try {
      // Get all items under the same partition key (task id)
      const query: QueryCommandInput = {
        TableName: this.table,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": taskId,
        },
        ScanIndexForward: true, // sort ascending by range key (service)
      };

      // Pager will return a variable number of items, up to 1MB of data
      const paginatorConfig: DynamoDBDocumentPaginationConfiguration = {
        client: this.db,
        pageSize: 25,
      };
      const pager = paginateQuery(paginatorConfig, query);

      // Build list of items, page by page
      const items: Record<string, any>[] = [];
      for await (const result of pager) {
        if (result && result.Items) {
          items.push(...result.Items);
        }
      }

      if (!items || items.length === 0) return undefined;

      items.forEach((item, index) => {
        console.log(
          `item ${index}`,
          item.service,
          JSON.stringify(item, null, 2),
        );
      });

      // Filter down to root and chunk items for service
      const serviceItems = items.filter((item) =>
        item.service.includes(service),
      );

      // console.log("serviceItemsLength", serviceItems.length);
      // serviceItems.forEach((item, index) => {
      //   console.log(`serviceItem ${index}`, JSON.stringify(item, null, 2));
      // });

      const rootItemIndex = serviceItems.findIndex(
        (item) => item.service === service,
      );
      // console.log("rootItemIndex", rootItemIndex);

      // Remove root item.
      const rootItem = serviceItems.splice(rootItemIndex, 1)[0]; // mutates items
      // Filter for chunk items for this service, just in case there's more under partition key
      const chunkItems = serviceItems.filter((item) =>
        item.service.includes(`${service}-chunk`),
      );

      // chunkItems.forEach((item, index) => {
      //   console.log(`chunkItem ${index}`, JSON.stringify(item, null, 2));
      // });

      // If chunk data, merge it back into root item
      if (chunkItems.length > 0) {
        console.log(`Merging ${chunkItems.length} chunks`);
        const chunkStrings = chunkItems.map((item) => item.data.chunk);
        rootItem.data = this.fromJsonStrings(chunkStrings);
      }

      return rootItem as unknown as GeoprocessingTask;
    } catch (e: unknown) {
      console.log("TasksModel get threw an error");
      if (e instanceof Error) {
        console.log(e.message);
        console.log(e.stack);
        return undefined;
      }
    }
  }

  async getMeanEstimate(task: GeoprocessingTask): Promise<number> {
    let service = task.service;
    const response = await this.db.send(
      new GetCommand({
        TableName: this.estimatesTable,
        Key: {
          service,
        },
      }),
    );
    let meanEstimate: number = response.Item?.meanEstimate;
    return meanEstimate;
  }

  /**
   * Transform valid JSON object into string and break into pieces no larger than minSplitSizeBytes
   * @param rootResult
   * @param minSplitSizeBytes maximum return substring size in bytes (default 350KB, below 400KB dynamodb limit)
   * @returns array of JSON substrings, in order for re-assembly
   */
  private toJsonStrings(
    rootResult: JSONValue,
    options: { minSplitSizeBytes?: number } = {},
  ): string[] {
    const rootString = JSON.stringify(rootResult, null, 1); // add spaces to string for chunking on
    const minSplitSizeBytes = options.minSplitSizeBytes || 350 * 1024;
    let buf = Buffer.from(rootString);
    const result: string[] = [];
    while (buf.length) {
      // Find last space before minSplitSizeBytes
      let i = buf.lastIndexOf(32, minSplitSizeBytes + 1);
      // If no space found, try forward search
      if (i < 0) i = buf.indexOf(32, minSplitSizeBytes);
      // If there's no space at all, take the whole string
      if (i < 0) i = buf.length;
      // This is a safe cut-off point; never half-way a multi-byte
      const partial = buf.slice(0, i).toString();
      result.push(partial);
      buf = buf.slice(i + 1); // Skip space (if any)
    }
    return result;
  }

  /**
   * Given array of partial JSON strings, joins them together and parses the result
   */
  private fromJsonStrings(jsonStringChunks: string[]): JSONValue {
    const mergedString = jsonStringChunks.join("");

    // const jsonStringsHash = jsonStringChunks.reduce<Record<string, string>>(
    //   (acc, curString, index) => {
    //     return { [index]: curString, ...acc };
    //   },
    //   {}
    // );
    // toJsonFile(jsonStringsHash, "chunk_fromJsonStrings.json");

    let parsedString = "";
    try {
      parsedString = JSON.parse(mergedString);
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error("Error merging JSON string chunks: " + e.message);
      }
    }
    return parsedString;
  }
}
