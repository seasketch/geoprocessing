import { CfnOutput, Stack, StackProps, Duration } from "aws-cdk-lib/core";
import { Construct } from "constructs";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest";
import {
  createPublicBuckets,
  setupFunctionBucketAccess,
} from "./publicBuckets";
import { createClientResources } from "./clientResources";
import {
  createFunctions,
  setupFunctionEnvironments,
} from "./functionResources";

import { createTables, setupTableFunctionAccess } from "./dynamoDb";
import { createRestApi } from "./restApiGateway";
import { createSocketApi } from "./socketApiGateway";
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

/** StackProps extended with geoprocessing project metadata */
export interface GeoprocessingStackProps extends StackProps {
  projectName: string;
  projectPath: string;
  manifest: Manifest;
  env: {
    region: string;
  };
}

export class GeoprocessingStack extends Stack {
  props: GeoprocessingStackProps;
  publicBuckets: GpPublicBuckets;
  tables: GpDynamoTables;
  functions: GpProjectFunctions;
  restApi: RestApi;
  socketApi: WebSocketApi;

  constructor(scope: Construct, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);
    this.props = props;

    this.publicBuckets = createPublicBuckets(this);
    const publicDatasetBucketUrl = this.publicBuckets.dataset.urlForObject();
    const publicResultBucketUrl = this.publicBuckets.result.urlForObject();

    // Bundle clients and deploy to bucket, serve via cloudfront
    const { clientBucket, clientDistribution } = createClientResources(this);

    const clientDistributionUrl = clientDistribution
      ? clientDistribution.distributionDomainName
      : undefined;

    this.tables = createTables(this);

    // Create lambdas for gp functions and provide link to other services
    this.functions = createFunctions(this);

    // Create rest endpoints for gp lambdas
    this.restApi = createRestApi(this);
    this.socketApi = createSocketApi(this);

    // Provide gp lambdas permission to use other services
    setupTableFunctionAccess(this);
    setupFunctionBucketAccess(this);
    // setupFunctionEnvironments();

    // Output notable values
    new CfnOutput(this, "publicDatasetBucketUrl", {
      value: publicDatasetBucketUrl,
    });
    new CfnOutput(this, "publicResultBucketUrl", {
      value: publicResultBucketUrl,
    });
    new CfnOutput(this, "clientDistributionUrl", {
      value: clientDistributionUrl ? clientDistributionUrl : "undefined",
    });
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
