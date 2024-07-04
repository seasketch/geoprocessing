import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
  getSyncFunctionMetadata,
  getAsyncFunctionMetadata,
  hasClients,
  isSyncFunctionMetadata,
  isAsyncFunctionMetadata,
} from "../manifest.js";
import {
  createPublicBuckets,
  setupBucketFunctionAccess,
} from "./publicBuckets.js";
import {
  createClientResources,
  setupClientFunctionAccess,
} from "./clientResources.js";
import { createFunctions } from "./functionResources.js";

import { createTables, setupTableFunctionAccess } from "./dynamodb.js";
import { createRestApi } from "./restApiGateway.js";
import {
  createWebSocketApi,
  setupWebSocketFunctionAccess,
} from "./socketApiGateway.js";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import {
  GpPublicBuckets,
  GpProjectFunctions,
  GpDynamoTables,
  SyncFunctionWithMeta,
  AsyncFunctionWithMeta,
} from "./types.js";
import { genOutputMeta } from "./outputMeta.js";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { LambdaStack } from "./LambdaStack.js";

/** StackProps extended with geoprocessing project metadata */
export interface GeoprocessingStackProps extends StackProps {
  projectName: string;
  projectPath: string;
  manifest: Manifest;
}

/**
 * A geoprocessing project is deployed as a single monolithic stack using CloudFormation.
 * The stack inspects the manifest and creates stack resources
 * Supports functions being sync or async in executionMode and preprocessor or geoprocessor in purpose
 * Async + preprocessor combination is not supported
 * Each project gets one API gateway, s3 bucket, and db table for tracking tasks and function run timeestimates
 * If async functions also get a socket subscriptions db table and web socket machinery
 * Each function gets a lambda and rest endpoint for sync mode, or a set of lambdas (start + run) for async mode
 */
export class GeoprocessingStack extends Stack {
  props: GeoprocessingStackProps;

  // Refer to key stack resources using class properties for easy reference, just pass the stack instance around
  // See types for more info on these resources

  publicBuckets: GpPublicBuckets;
  tables: GpDynamoTables;
  functions: GpProjectFunctions;
  restApi: RestApi;
  socketApi?: WebSocketApi;
  clientBucket?: Bucket;
  clientDistribution?: CloudFrontWebDistribution;
  syncLambdaStack: LambdaStack;
  asyncLambdaStack: LambdaStack;

  constructor(scope: Construct, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);
    this.props = props;

    // Create lambda functions
    this.syncLambdaStack = new LambdaStack(this, `sync-fns`, {
      ...props,
      type: "sync",
    });
    this.asyncLambdaStack = new LambdaStack(this, `async-fns`, {
      ...props,
      type: "async",
    });

    // Create other functions root/socket
    this.functions = createFunctions(this);

    this.publicBuckets = createPublicBuckets(this);

    // Create client bundle with bucket deploymentand and Cloudfront distribution
    const { clientBucket, clientDistribution } = createClientResources(this);
    this.clientBucket = clientBucket;
    this.clientDistribution = clientDistribution;

    this.tables = createTables(this);

    // Create rest endpoints for gp lambdas
    this.restApi = createRestApi(this);
    this.socketApi = createWebSocketApi(this);

    // Provide gp lambdas access to other services
    setupTableFunctionAccess(this);
    setupBucketFunctionAccess(this);
    setupWebSocketFunctionAccess(this);
    setupClientFunctionAccess(this);

    genOutputMeta(this);
  }

  hasClients(): boolean {
    return hasClients(this.props.manifest);
  }

  /** Return metadata for all PreprocessingHandlers and sync GeoprocessingHandlers in manifest */
  getSyncFunctionMetas(): ProcessingFunctionMetadata[] {
    return getSyncFunctionMetadata(this.props.manifest);
  }

  /** Return metadata for all async GeoprocessingHandlers in manifest */
  getAsyncFunctionMetas(): GeoprocessingFunctionMetadata[] {
    return getAsyncFunctionMetadata(this.props.manifest);
  }

  /** Returns true if manifest has sync functions metadata for all PreprocessingHandlers and GeoprocessingHandlers in manifest */
  hasSyncFunctions(): boolean {
    return this.getSyncFunctionMetas().length > 0;
  }

  hasAsyncFunctions(): boolean {
    return this.getAsyncFunctionMetas().length > 0;
  }

  /** Given all gp lambda functions with meta for project, returns sync lambda function */
  getSyncFunctionsWithMeta(): SyncFunctionWithMeta[] {
    return this.syncLambdaStack
      .getProcessingFunctions()
      .filter<SyncFunctionWithMeta>(this.isSyncFunctionWithMeta);
  }

  /** Given all gp lambda functions with meta for project, returns async lambda function */
  getAsyncFunctionsWithMeta(): AsyncFunctionWithMeta[] {
    return this.asyncLambdaStack
      .getProcessingFunctions()
      .filter<AsyncFunctionWithMeta>(this.isAsyncFunctionWithMeta);
  }

  /** Returns true if sync function with meta and narrows type */
  isSyncFunctionWithMeta(
    funcWithMeta: any
  ): funcWithMeta is SyncFunctionWithMeta {
    return (
      funcWithMeta.hasOwnProperty("func") &&
      funcWithMeta.hasOwnProperty("meta") &&
      isSyncFunctionMetadata(funcWithMeta.meta)
    );
  }

  /** Returns true if async function with meta and narrows type */
  isAsyncFunctionWithMeta(
    funcWithMeta: any
  ): funcWithMeta is AsyncFunctionWithMeta {
    return (
      funcWithMeta.hasOwnProperty("startFunc") &&
      funcWithMeta.hasOwnProperty("runFunc") &&
      funcWithMeta.hasOwnProperty("meta") &&
      isAsyncFunctionMetadata(funcWithMeta.meta)
    );
  }

  getProcessingFunctions() {
    return [
      ...this.syncLambdaStack.getProcessingFunctions(),
      ...this.asyncLambdaStack.getProcessingFunctions(),
    ];
  }
}

/**
 * Returns root lambda handler method pointer in module.function dot notation
 */
export function getHandlerPointer(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename
    .replace(/\.js$/, "")
    .replace(/\.ts$/, "")}Handler.handler`;
}
