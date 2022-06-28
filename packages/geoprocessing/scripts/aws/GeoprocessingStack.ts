import { Stack, StackProps, Duration } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest";
import {
  createPublicBuckets,
  setupBucketFunctionAccess,
} from "./publicBuckets";
import {
  createClientResources,
  setupClientFunctionAccess,
} from "./clientResources";
import { createFunctions } from "./functionResources";

import { createTables, setupTableFunctionAccess } from "./dynamodb";
import { createRestApi } from "./restApiGateway";
import {
  createWebSocketApi,
  setupWebSocketFunctionAccess,
} from "./socketApiGateway";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { WebSocketApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import {
  GpPublicBuckets,
  GpProjectFunctions,
  GpDynamoTables,
  SyncFunctionWithMeta,
  AsyncFunctionWithMeta,
} from "./types";
import { isAsyncFunctionWithMeta, isSyncFunctionWithMeta } from "./helpers";
import { genOutputMeta } from "./outputMeta";

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
  clientDistribution?: Distribution;

  constructor(scope: Construct, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);
    this.props = props;

    this.publicBuckets = createPublicBuckets(this);

    // Create client bundle with bucket deploymentand and Cloudfront distribution
    const { clientBucket, clientDistribution } = createClientResources(this);
    this.clientDistribution = clientDistribution;

    this.tables = createTables(this);

    // Create lambdas for gp functions
    this.functions = createFunctions(this);

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
    return this.props.manifest.clients.length > 0;
  }

  getSyncFunctionMetas(): ProcessingFunctionMetadata[] {
    return [
      ...this.props.manifest.preprocessingFunctions,
      ...this.props.manifest.geoprocessingFunctions.filter(
        (func) => func.executionMode === "sync"
      ),
    ];
  }

  getAsyncFunctionMetas(): GeoprocessingFunctionMetadata[] {
    return this.props.manifest.geoprocessingFunctions.filter(
      (func) =>
        func.executionMode === "async" && func.purpose !== "preprocessing"
    );
  }

  hasSyncFunctionMetas(): boolean {
    return this.getSyncFunctionMetas().length > 0;
  }

  hasAsyncFunctionMetas(): boolean {
    return this.getAsyncFunctionMetas().length > 0;
  }

  /** Given all gp lambda functions with meta for project, returns sync lambda function */
  getSyncFunctionsWithMeta(): SyncFunctionWithMeta[] {
    return this.functions.processingFunctions.filter<SyncFunctionWithMeta>(
      isSyncFunctionWithMeta
    );
  }

  /** Given all gp lambda functions with meta for project, returns async lambda function */
  getAsyncFunctionsWithMeta(): AsyncFunctionWithMeta[] {
    return this.functions.processingFunctions.filter<AsyncFunctionWithMeta>(
      isAsyncFunctionWithMeta
    );
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
