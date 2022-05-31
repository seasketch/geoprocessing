import { GeoprocessingStack } from "./GeoprocessingStack";
import { Duration } from "aws-cdk-lib";
import { Function, Code } from "aws-cdk-lib/aws-lambda";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
  isGeoprocessingFunctionMetadata,
  isPreprocessingFunctionMetadata,
  isSyncFunctionMetadata,
  isAsyncFunctionMetadata,
} from "../manifest";
import config from "./config";

/**
 * Group of all Lambda functions for project
 */
export interface GpProjectFunctions {
  serviceRootFunction: Function;
  processingFunctions: FunctionWithMeta[];
}

/**
 * A lambda function paired with original user-defined metadata used to configure it
 */
export interface FunctionWithMeta {
  meta: ProcessingFunctionMetadata;
  func: Function;
}

type SyncEnvironmentRequiredKeys =
  | "publicDatasetBucketUrl"
  | "publicResultBucketUrl"
  | "TASKS_TABLE"
  | "ESTIMATES_TABLE";
/**
 * Environment variables for sync function to access external resources
 */
type SyncEnvironmentRecord = Record<SyncEnvironmentRequiredKeys, string>;

/**
 * Create Lambda function constructs
 */
export const createFunctions = (
  stack: GeoprocessingStack,
  options: {
    /** Url endpoint to access clients */
    clientUrl?: string;
    /** Environment variables to passing into sync functions */
    syncEnvironment: SyncEnvironmentRecord;
  }
): GpProjectFunctions => {
  const { clientUrl, syncEnvironment } = options;
  const serviceRootFunction = new Function(stack, "GpServiceRootFunction", {
    runtime: config.NODE_RUNTIME,
    code: Code.fromAsset(path.join(stack.props.projectPath, ".build")),
    functionName: `gp-${stack.props.projectName}-metadata`,
    handler: "serviceHandlers.projectMetadata",
    environment: {
      ...(clientUrl ? { clientUrl } : {}),
    },
  });

  // Create sync lambda functions
  const syncFunctionMetas: ProcessingFunctionMetadata[] = [
    ...stack.props.manifest.preprocessingFunctions,
    ...stack.props.manifest.geoprocessingFunctions.filter(
      (func) => func.executionMode === "sync"
    ),
  ];

  let syncFunctionsWithMeta: FunctionWithMeta[] = syncFunctionMetas.map(
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
        environment: syncEnvironment,
      });
      return {
        func,
        meta: functionMeta,
      };
    }
  );

  // Create async lambda functions
  let asyncFunctionsWithMeta: FunctionWithMeta[] = [];

  return {
    serviceRootFunction,
    processingFunctions: [...syncFunctionsWithMeta, ...asyncFunctionsWithMeta],
  };
};

/** Returns geoprocessing lambda functions for project */
export const getGeoprocessingFunctionsWithMeta = (
  processingFunctions: FunctionWithMeta[]
) => {
  return processingFunctions.filter((funcWithMeta) =>
    isGeoprocessingFunctionMetadata(funcWithMeta.meta)
  );
};

/** Returns preprocessing lambda functions for project */
export const getPreprocessingFunctionsWithMeta = (
  processingFunctions: FunctionWithMeta[]
) => {
  return processingFunctions.filter((funcWithMeta) =>
    isPreprocessingFunctionMetadata(funcWithMeta.meta)
  );
};

/** Returns sync lambda functions for project */
export const getSyncFunctionsWithMeta = (
  processingFunctions: FunctionWithMeta[]
) => {
  return processingFunctions.filter((funcWithMeta) =>
    isSyncFunctionMetadata(funcWithMeta.meta)
  );
};

/** Returns async lambda functions for project */
export const getAsyncFunctionsWithMeta = (
  processingFunctions: FunctionWithMeta[]
) => {
  return processingFunctions.filter((funcWithMeta) =>
    isSyncFunctionMetadata(funcWithMeta.meta)
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
