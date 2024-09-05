import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { Function, Code } from "aws-cdk-lib/aws-lambda";

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

/**
 * Create Lambda function constructs core to project
 */
export const createProjectFunctions = (
  stack: GeoprocessingStack,
): GpProjectFunctions => {
  return {
    serviceRootFunction: createRootFunction(stack),
    socketFunctions: createSocketFunctions(stack),
  };
};

const createRootFunction = (stack: GeoprocessingStack): Function => {
  return new Function(stack, "GpServiceRootFunction", {
    runtime: config.NODE_RUNTIME,
    code: Code.fromAsset(
      path.join(stack.props.projectPath, ".build", "serviceHandlers"),
    ),
    functionName: `gp-${stack.props.projectName}-metadata`,
    handler: "serviceHandlers.projectMetadata",
  });
};

export const createSocketFunctions = (
  stack: GeoprocessingStack,
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
        path.join(stack.props.projectPath, ".build", "connect"),
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
        path.join(stack.props.projectPath, ".build", "disconnect"),
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
        path.join(stack.props.projectPath, ".build", "sendmessage"),
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
