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
import { createPublicBuckets, setupBucketFunctionAccess } from "./buckets.js";
import {
  createClientResources,
  setupClientFunctionAccess,
} from "./clientResources.js";
import { createProjectFunctions } from "./functionResources.js";

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
  ProcessingFunctions,
} from "./types.js";
import { genOutputMeta } from "./outputMeta.js";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { LambdaStack } from "./LambdaStack.js";
import { createLambdaStacks } from "./lambdaResources.js";
import { Function } from "aws-cdk-lib/aws-lambda";
import { hasOwnProperty } from "../../client-core.js";

/** StackProps extended with geoprocessing project metadata */
export interface GeoprocessingStackProps extends StackProps {
  projectName: string;
  projectPath: string;
  manifest: Manifest;
  functionsPerStack?: number;
  functionGroups?: string[][];
  workerGroups?: string[][];
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
  projectFunctions: GpProjectFunctions;
  restApi: RestApi;
  socketApi?: WebSocketApi;
  clientBucket?: Bucket;
  clientDistribution?: CloudFrontWebDistribution;
  lambdaStacks: LambdaStack[];

  constructor(scope: Construct, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);
    this.props = props;

    this.lambdaStacks = createLambdaStacks(this, this.props);
    this.projectFunctions = createProjectFunctions(this);
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

  /** aggregate and return sync lambda function meta from lambda stacks */
  getSyncFunctionsWithMeta(): SyncFunctionWithMeta[] {
    return this.lambdaStacks.reduce<SyncFunctionWithMeta[]>((acc, curStack) => {
      const syncFunctions = curStack
        .getProcessingFunctions()
        .filter<SyncFunctionWithMeta>(this.isSyncFunctionWithMeta);

      return [...acc, ...syncFunctions];
    }, []);
  }

  /**
   * @returns run functions across all lambda stacks
   */
  getAsyncRunLambdas(): Function[] {
    return this.lambdaStacks.reduce<Function[]>(
      (acc, curStack) => [...acc, ...curStack.getAsyncRunLambdas()],
      [],
    );
  }

  /**
   * @returns async lambda function meta from all lambda stacks
   */
  getAsyncFunctionsWithMeta(): AsyncFunctionWithMeta[] {
    return this.lambdaStacks.reduce<AsyncFunctionWithMeta[]>(
      (acc, curStack) => {
        const asyncFunctions = curStack
          .getProcessingFunctions()
          .filter<AsyncFunctionWithMeta>(this.isAsyncFunctionWithMeta);

        return [...acc, ...asyncFunctions];
      },
      [],
    );
  }

  /** Returns true if sync function with meta and narrows type */
  isSyncFunctionWithMeta(
    funcWithMeta: any,
  ): funcWithMeta is SyncFunctionWithMeta {
    return (
      hasOwnProperty(funcWithMeta, "func") &&
      hasOwnProperty(funcWithMeta, "meta") &&
      isSyncFunctionMetadata(funcWithMeta.meta)
    );
  }

  /** Returns true if async function with meta and narrows type */
  isAsyncFunctionWithMeta(
    funcWithMeta: any,
  ): funcWithMeta is AsyncFunctionWithMeta {
    return (
      hasOwnProperty(funcWithMeta, "startFunc") &&
      hasOwnProperty(funcWithMeta, "runFunc") &&
      hasOwnProperty(funcWithMeta, "meta") &&
      isAsyncFunctionMetadata(funcWithMeta.meta)
    );
  }

  getProcessingFunctions() {
    return this.lambdaStacks.reduce<ProcessingFunctions>((acc, curStack) => {
      return [...acc, ...curStack.getProcessingFunctions()];
    }, []);
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
