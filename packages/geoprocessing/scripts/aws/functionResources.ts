import { GeoprocessingStack } from "./GeoprocessingStack";
import { Duration } from "aws-cdk-lib";
import { Function, Code } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SyncFunctionWithMeta, AsyncFunctionWithMeta } from "./types";
import {
  ProcessingFunctionMetadata,
  GeoprocessingFunctionMetadata,
} from "../manifest";

import config from "./config";
import {
  GpProjectFunctions,
  GpSocketFunctions,
  GpDynamoTables,
  GpPublicBuckets,
} from "./types";

export interface CreateFunctionOptions {
  clientDistributionUrl?: string;
  publicBuckets: GpPublicBuckets;
  tables: GpDynamoTables;
}

/**
 * Create Lambda function constructs
 */
export const createFunctions = (
  stack: GeoprocessingStack
): GpProjectFunctions => {
  return {
    serviceRootFunction: createRootFunction(stack),
    socketFunctions: createSocketFunctions(stack),
    processingFunctions: [
      ...createSyncFunctions(stack),
      ...createAsyncFunctions(stack),
    ],
  };
};

const createRootFunction = (stack: GeoprocessingStack): Function => {
  return new Function(stack, "GpServiceRootFunction", {
    runtime: config.NODE_RUNTIME,
    code: Code.fromAsset(path.join(stack.props.projectPath, ".build")),
    functionName: `gp-${stack.props.projectName}-metadata`,
    handler: "serviceHandlers.projectMetadata",
    // environment: {
    //   ...(clientDistributionUrl ? { clientDistributionUrl } : {}),
    // },
  });
};

const createSocketFunctions = (
  stack: GeoprocessingStack
): GpSocketFunctions => {
  // const environment = {
  //   ...(options.tables.subscriptions
  //     ? { SOCKETS_TABLE: options.tables.subscriptions.tableName }
  //     : {}),
  // };

  const subscribe = new Function(stack, "GpSubscribeHandler", {
    runtime: config.NODE_RUNTIME,
    code: Code.fromAsset(path.join(stack.props.projectPath, ".build/")),
    handler: "connect.connectHandler",
    functionName: `gp-${stack.props.projectName}-subscribe`,
    memorySize: config.SOCKET_HANDLER_MEMORY,
    timeout: config.SOCKET_HANDLER_TIMEOUT,
    description: "Subscribe to messages",
    // environment,
  });

  const unsubscribe = new Function(stack, "GpUnsubscribeHandler", {
    runtime: config.NODE_RUNTIME,
    code: Code.fromAsset(path.join(stack.props.projectPath, ".build/")),
    handler: "disconnect.disconnectHandler",
    functionName: `gp-${stack.props.projectName}-unsubscribe`,
    memorySize: config.SOCKET_HANDLER_MEMORY,
    timeout: config.SOCKET_HANDLER_TIMEOUT,
    description: "Unsubscribe from messages",
    // environment,
  });

  const send = new Function(stack, "GpSendHandler", {
    runtime: config.NODE_RUNTIME,
    code: Code.fromAsset(path.join(stack.props.projectPath, ".build/")),
    handler: "sendmessage.sendHandler",
    functionName: `gp-${stack.props.projectName}-send`,
    memorySize: config.SOCKET_HANDLER_MEMORY,
    timeout: config.SOCKET_HANDLER_TIMEOUT,
    description: " for sending messages on sockets",
    // environment,
  });

  return {
    subscribe,
    unsubscribe,
    send,
  };
};

// MOVE ENVIRONMENT VARIABLE SETTING TO POST FUNCTION
const createSyncFunctions = (
  stack: GeoprocessingStack
): SyncFunctionWithMeta[] => {
  // const { publicBuckets, tables } = options;
  const syncFunctionMetas: ProcessingFunctionMetadata[] = [
    ...stack.props.manifest.preprocessingFunctions,
    ...stack.props.manifest.geoprocessingFunctions.filter(
      (func) => func.executionMode === "sync"
    ),
  ];

  return syncFunctionMetas.map(
    (functionMeta: ProcessingFunctionMetadata, index: number) => {
      const rootPointer = getHandlerPointer(functionMeta);
      const functionName = `gp-${stack.props.projectName}-sync-${functionMeta.title}`;
      const func = new Function(stack, `${functionMeta.title}GpSyncHandler`, {
        runtime: config.NODE_RUNTIME,
        code: Code.fromAsset(path.join(stack.props.projectPath, ".build")),
        handler: rootPointer,
        functionName,
        memorySize: functionMeta.memory,
        timeout: Duration.seconds(
          functionMeta.timeout || config.SYNC_LAMBDA_TIMEOUT
        ),
        description: functionMeta.description,
        // environment: {
        //   publicDatasetBucketUrl: publicBuckets.dataset.urlForObject(),
        //   publicResultBucketUrl: publicBuckets.dataset.urlForObject(),
        //   TASKS_TABLE: tables.tasks.tableName,
        //   ESTIMATES_TABLE: tables.estimates.tableName,
        // },
      });
      return {
        func,
        meta: functionMeta,
      };
    }
  );
};

// MOVE ENVIRONMENT VARIABLE SETTING TO POST FUNCTION
const createAsyncFunctions = (
  stack: GeoprocessingStack
): AsyncFunctionWithMeta[] => {
  const asyncFunctionMetas = stack.props.manifest.geoprocessingFunctions.filter(
    (func) => func.executionMode === "async" && func.purpose !== "preprocessing"
  );

  return asyncFunctionMetas.map(
    (functionMeta: GeoprocessingFunctionMetadata, index: number) => {
      const rootPointer = getHandlerPointer(functionMeta);
      const startFunctionName = `gp-${stack.props.projectName}-async-${functionMeta.title}-start`;
      const runFunctionName = `gp-${stack.props.projectName}-async-${functionMeta.title}-run`;

      /**
       * runHandler Lambda is invoked by startHandler Lambda
       * Used for running GP function and reporting back results async via socket
       */
      const runFunc = new Function(
        stack,
        `${functionMeta.title}GpAsyncHandlerRun`,
        {
          runtime: config.NODE_RUNTIME,
          code: Code.fromAsset(path.join(stack.props.projectPath, ".build")),

          handler: rootPointer,
          functionName: runFunctionName,
          memorySize: functionMeta.memory,
          timeout: Duration.seconds(
            functionMeta.timeout || config.ASYNC_LAMBDA_RUN_TIMEOUT
          ),
          description: functionMeta.description,
          environment: {
            ASYNC_REQUEST_TYPE: "run",
          },
        }
      );

      const asyncLambdaPolicy = new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [runFunc.functionArn],
        actions: ["lambda:InvokeFunction"],
      });

      /**
       * startHandler Lambda is connected to the REST API allowing client to
       * start a GP function task, which invokes the runHandler Lambda
       */
      const startFunc = new Function(
        stack,
        `${functionMeta.title}GpAsyncHandlerStart`,
        {
          runtime: config.NODE_RUNTIME,
          code: Code.fromAsset(path.join(stack.props.projectPath, ".build")),
          handler: rootPointer,
          functionName: startFunctionName,
          memorySize: functionMeta.memory,
          timeout: Duration.seconds(config.ASYNC_LAMBDA_START_TIMEOUT),
          description: functionMeta.description,
          initialPolicy: [asyncLambdaPolicy],
          environment: {
            ASYNC_REQUEST_TYPE: "start",
            RUN_HANDLER_FUNCTION_NAME: runFunctionName,
          },
        }
      );

      return {
        startFunc,
        runFunc,
        meta: functionMeta,
      };
    }
  );
};

/** Setup resource access to tables */
export const setupFunctionEnvironments = (stack: GeoprocessingStack) => {
  // Preprocessors don't need access to these resources
  // TODO: so should we be using different method?
  stack.getSyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    const baseAsyncEnvOptions = {
      TASKS_TABLE: stack.tables.tasks.tableName,
      ESTIMATES_TABLE: stack.tables.estimates.tableName,
      ...(stack.tables.subscriptions
        ? { SOCKETS_TABLE: stack.tables.subscriptions.tableName }
        : {}),
      WSS_REF: stack.socketApi.apiId,
      WSS_REGION: stack.region,
      WSS_STAGE: config.STAGE_NAME,
    };
  });

  // now async
};

/**
 * Returns root lambda handler method pointer in module.function dot notation
 */
export function getHandlerPointer(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename
    .replace(/\.js$/, "")
    .replace(/\.ts$/, "")}Handler.handler`;
}
