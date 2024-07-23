import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest.js";
import {
  ProcessingFunctions,
  AsyncFunctionWithMeta,
  SyncFunctionWithMeta,
} from "./types.js";
import { Duration } from "aws-cdk-lib";
import { Function, Code } from "aws-cdk-lib/aws-lambda";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

import config from "./config.js";
import path from "path";
export interface GeoprocessingNestedStackProps extends NestedStackProps {
  projectName: string;
  projectPath: string;
  manifest: Manifest;
}

// Once sync functions create, contains policies to invoke all sync functions
const invokeSyncLambdaPolicies: PolicyStatement[] = [];

/**
 * Nested stack for Lambda functions.  Can contain sync or async functions
 * Create multiple instances to handle both
 */
export class LambdaStack extends NestedStack {
  props: GeoprocessingNestedStackProps;
  processingFunctions: ProcessingFunctions;

  constructor(
    scope: Construct,
    id: string,
    props: GeoprocessingNestedStackProps
  ) {
    super(scope, id, props);
    this.props = props;
    this.processingFunctions = [];

    // Create lambdas for all functions
    this.createProcessingFunctions();
  }

  getProcessingFunctions() {
    return this.processingFunctions;
  }

  /**
   * Create Lambda function constructs
   */
  createProcessingFunctions = () => {
    this.processingFunctions.push(...this.createSyncFunctions());
    this.processingFunctions.push(...this.createAsyncFunctions());
  };

  /** Create Lambda function constructs for sync functions that return result immediately */
  private createSyncFunctions = (): SyncFunctionWithMeta[] => {
    const syncFunctionMetas: ProcessingFunctionMetadata[] = [
      ...this.props.manifest.preprocessingFunctions,
      ...this.props.manifest.geoprocessingFunctions.filter(
        (func) => func.executionMode === "sync"
      ),
    ];

    return syncFunctionMetas.map(
      (functionMeta: ProcessingFunctionMetadata, index: number) => {
        const rootPointer = getHandlerPointer(functionMeta);
        const pkgName = getHandlerPkgName(functionMeta);
        const functionName = `gp-${this.props.projectName}-sync-${functionMeta.title}`;
        const codePath = path.join(this.props.projectPath, ".build", pkgName);
        console.log("codePath", codePath);
        console.log("rootPointer", rootPointer);

        const func = new Function(this, `${functionMeta.title}GpSyncHandler`, {
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

        // Allow sync functions to invoked by other functions
        const syncInvokeLambdaPolicy = new PolicyStatement({
          effect: Effect.ALLOW,
          resources: [func.functionArn],
          actions: ["lambda:InvokeFunction"],
        });
        invokeSyncLambdaPolicies.push(syncInvokeLambdaPolicy);

        return {
          func,
          meta: functionMeta,
        };
      }
    );
  };

  /** Create Lambda function constructs for functions that return result async */
  private createAsyncFunctions = (): AsyncFunctionWithMeta[] => {
    const asyncFunctionMetas =
      this.props.manifest.geoprocessingFunctions.filter(
        (func) =>
          func.executionMode === "async" && func.purpose !== "preprocessing"
      );

    return asyncFunctionMetas.map(
      (functionMeta: GeoprocessingFunctionMetadata, index: number) => {
        const rootPointer = getHandlerPointer(functionMeta);
        const pkgName = getHandlerPkgName(functionMeta);
        const startFunctionName = `gp-${this.props.projectName}-async-${functionMeta.title}-start`;
        const runFunctionName = `gp-${this.props.projectName}-async-${functionMeta.title}-run`;

        /**
         * startHandler Lambda is connected to the REST API allowing client to
         * start a GP function task, which invokes the runHandler Lambda
         */
        const startFunc = new Function(
          this,
          `${functionMeta.title}GpAsyncHandlerStart`,
          {
            runtime: config.NODE_RUNTIME,
            code: Code.fromAsset(
              path.join(this.props.projectPath, ".build", pkgName)
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
          this,
          `${functionMeta.title}GpAsyncHandlerRun`,
          {
            runtime: config.NODE_RUNTIME,
            code: Code.fromAsset(
              path.join(this.props.projectPath, ".build", pkgName)
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
        const invokeAsyncRunLambdaPolicy = new PolicyStatement({
          effect: Effect.ALLOW,
          resources: [runFunc.functionArn],
          actions: ["lambda:InvokeFunction"],
        });
        const asyncLambdaRole = new Role(this, "GpAsyncLambdaRole" + index, {
          assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        });
        asyncLambdaRole.addToPolicy(invokeAsyncRunLambdaPolicy);
        startFunc.addToRolePolicy(invokeAsyncRunLambdaPolicy);

        // Allow async lambdas to invoke sync lambdas (workers)
        invokeSyncLambdaPolicies.forEach(
          (curInvokeSyncLambdaPolicy, index2) => {
            const syncLambdaRole = new Role(
              this,
              "GpSyncLambdaRole" + index + "_" + index2,
              {
                assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
              }
            );
            syncLambdaRole.addToPolicy(curInvokeSyncLambdaPolicy);
            runFunc.addToRolePolicy(curInvokeSyncLambdaPolicy);
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
}

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
