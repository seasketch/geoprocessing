import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { Duration } from "aws-cdk-lib";
import { Function, Code } from "aws-cdk-lib/aws-lambda";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { SyncFunctionWithMeta, AsyncFunctionWithMeta } from "./types.js";
import {
  ProcessingFunctionMetadata,
  GeoprocessingFunctionMetadata,
} from "../manifest.js";

import config from "./config.js";
import {
  GpProjectFunctions,
  GpSocketFunctions,
  GpDynamoTables,
  GpPublicBuckets,
} from "./types.js";

export interface CreateFunctionOptions {
  clientDistributionUrl?: string;
  publicBuckets: GpPublicBuckets;
  tables: GpDynamoTables;
}
import path from "path";

const GP_ROOT = process.env.GP_ROOT;

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
    code: Code.fromAsset(
      path.join(stack.props.projectPath, ".build", "serviceHandlers")
    ),
    functionName: `gp-${stack.props.projectName}-metadata`,
    handler: "serviceHandlers.projectMetadata",
  });
};

export const createSocketFunctions = (
  stack: GeoprocessingStack
): GpSocketFunctions => {
  let socketFunctions: GpSocketFunctions = {
    subscribe: undefined,
    unsubscribe: undefined,
    send: undefined,
  };

  if (stack.hasAsyncFunctions()) {
    const subscribe = new Function(stack, "GpSubscribeHandler", {
      runtime: config.NODE_RUNTIME,
      code: Code.fromAsset(
        path.join(stack.props.projectPath, ".build", "connect")
      ),
      handler: "connect.connectHandler",
      functionName: `gp-${stack.props.projectName}-subscribe`,
      memorySize: config.SOCKET_HANDLER_MEMORY,
      timeout: config.SOCKET_HANDLER_TIMEOUT,
      description: "Subscribe to messages",
    });

    const unsubscribe = new Function(stack, "GpUnsubscribeHandler", {
      runtime: config.NODE_RUNTIME,
      code: Code.fromAsset(
        path.join(stack.props.projectPath, ".build", "disconnect")
      ),
      handler: "disconnect.disconnectHandler",
      functionName: `gp-${stack.props.projectName}-unsubscribe`,
      memorySize: config.SOCKET_HANDLER_MEMORY,
      timeout: config.SOCKET_HANDLER_TIMEOUT,
      description: "Unsubscribe from messages",
    });

    const send = new Function(stack, "GpSendHandler", {
      runtime: config.NODE_RUNTIME,
      code: Code.fromAsset(
        path.join(stack.props.projectPath, ".build", "sendmessage")
      ),
      handler: "sendmessage.sendHandler",
      functionName: `gp-${stack.props.projectName}-send`,
      memorySize: config.SOCKET_HANDLER_MEMORY,
      timeout: config.SOCKET_HANDLER_TIMEOUT,
      description: " for sending messages on sockets",
    });

    socketFunctions = {
      subscribe,
      unsubscribe,
      send,
    };
  }

  return socketFunctions;
};

/** Create Lambda function constructs for sync functions that return result immediately */
const createSyncFunctions = (
  stack: GeoprocessingStack
): SyncFunctionWithMeta[] => {
  const syncFunctionMetas: ProcessingFunctionMetadata[] = [
    ...stack.props.manifest.preprocessingFunctions,
    ...stack.props.manifest.geoprocessingFunctions.filter(
      (func) => func.executionMode === "sync"
    ),
  ];

  return syncFunctionMetas.map(
    (functionMeta: ProcessingFunctionMetadata, index: number) => {
      const rootPointer = getHandlerPointer(functionMeta);
      const pkgName = getHandlerPkgName(functionMeta);
      const functionName = `gp-${stack.props.projectName}-sync-${functionMeta.title}`;
      const codePath = path.join(stack.props.projectPath, ".build", pkgName);
      // console.log("codePath", codePath);
      // console.log("rootPointer", rootPointer);

      const func = new Function(stack, `${functionMeta.title}GpSyncHandler`, {
        runtime: config.NODE_RUNTIME,
        code: Code.fromAsset(codePath),
        handler: rootPointer,
        functionName,
        memorySize: functionMeta.memory,
        timeout: Duration.seconds(
          functionMeta.timeout || config.SYNC_LAMBDA_TIMEOUT
        ),
        description: functionMeta.description,
      });
      return {
        func,
        meta: functionMeta,
      };
    }
  );
};

/** Create Lambda function constructs for functions that return result async */
const createAsyncFunctions = (
  stack: GeoprocessingStack
): AsyncFunctionWithMeta[] => {
  const asyncFunctionMetas = stack.props.manifest.geoprocessingFunctions.filter(
    (func) => func.executionMode === "async" && func.purpose !== "preprocessing"
  );

  return asyncFunctionMetas.map(
    (functionMeta: GeoprocessingFunctionMetadata, index: number) => {
      const rootPointer = getHandlerPointer(functionMeta);
      const pkgName = getHandlerPkgName(functionMeta);
      const startFunctionName = `gp-${stack.props.projectName}-async-${functionMeta.title}-start`;
      const runFunctionName = `gp-${stack.props.projectName}-async-${functionMeta.title}-run`;

      /**
       * startHandler Lambda is connected to the REST API allowing client to
       * start a GP function task, which invokes the runHandler Lambda
       */
      const startFunc = new Function(
        stack,
        `${functionMeta.title}GpAsyncHandlerStart`,
        {
          runtime: config.NODE_RUNTIME,
          code: Code.fromAsset(
            path.join(stack.props.projectPath, ".build", pkgName)
          ),
          handler: rootPointer,
          functionName: startFunctionName,
          memorySize: functionMeta.memory,
          timeout: Duration.seconds(config.ASYNC_LAMBDA_START_TIMEOUT),
          description: functionMeta.description,
          environment: {
            ASYNC_REQUEST_TYPE: "start",
            RUN_HANDLER_FUNCTION_NAME: runFunctionName,
          },
        }
      );

      /**
       * runHandler Lambda is invoked by startHandler Lambda
       * Used for running GP function and reporting back results async via socket
       */
      const runFunc = new Function(
        stack,
        `${functionMeta.title}GpAsyncHandlerRun`,
        {
          runtime: config.NODE_RUNTIME,
          code: Code.fromAsset(
            path.join(stack.props.projectPath, ".build", pkgName)
          ),

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

      // Allow start function to invoke run function
      const asyncLambdaPolicy = new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [runFunc.functionArn],
        actions: ["lambda:InvokeFunction"],
      });
      const asyncLambdaRole = new Role(stack, "GpAsyncLambdaRole" + index, {
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      });
      asyncLambdaRole.addToPolicy(asyncLambdaPolicy);
      startFunc.addToRolePolicy(asyncLambdaPolicy);

      return {
        startFunc,
        runFunc,
        meta: functionMeta,
      };
    }
  );
};

/**
 * Returns root lambda handler method pointer in module.function dot notation
 */
export function getHandlerPointer(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename
    .replace(/\.js$/, "")
    .replace(/\.ts$/, "")}Handler.handler`;
}

/**
 * Returns build package name to look for handler
 */
export function getHandlerPkgName(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename
    .replace(/\.js$/, "")
    .replace(/\.ts$/, "")}`;
}
