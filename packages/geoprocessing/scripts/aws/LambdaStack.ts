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
  /** Name of the geoprocessing project */
  projectName: string;
  /** Path to top-level of geoprocessing project */
  projectPath: string;
  /** Manifest used to figure out what resources should be created for this stack */
  manifest: Manifest;
  /** maximum number of functions to allow per LambdaStack */
  functionsPerStack?: number;
  /** State of function stacks if already deployed (by function title) */
  existingFunctionStacks?: string[][];
  /** State of worker stacks if already deployed (by function title) */
  existingWorkerStacks?: string[][];
}

/**
 * Nested stack for Lambda functions.  Can contain sync or async functions
 * Create multiple instances to handle both
 */
export class LambdaStack extends NestedStack {
  props: GeoprocessingNestedStackProps;

  /**
   * Once stack created, this array will contain all processing functions
   */
  private processingFunctions: ProcessingFunctions;

  /**
   * Once stack created, this array will contain all sync function ARNs
   */
  private syncLambdaArns: string[];

  /**
   * Once stack created, this array will contain all async run lambda functions
   */
  private asyncRunLambdas: Function[];

  constructor(
    scope: Construct,
    id: string,
    props: GeoprocessingNestedStackProps,
  ) {
    super(scope, id, props);
    this.props = props;
    this.processingFunctions = [];
    this.asyncRunLambdas = [];
    this.syncLambdaArns = [];

    // Create lambdas for all functions
    this.createProcessingFunctions();
  }

  getProcessingFunctions() {
    return this.processingFunctions;
  }

  getAsyncRunLambdas() {
    return this.asyncRunLambdas;
  }

  getSyncLambdaArns() {
    return this.syncLambdaArns;
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
        (func) => func.executionMode === "sync",
      ),
    ];

    return syncFunctionMetas.map((functionMeta: ProcessingFunctionMetadata) => {
      const rootPointer = getHandlerPointer(functionMeta);
      const pkgName = getHandlerPkgName(functionMeta);
      const functionName = `gp-${this.props.projectName}-sync-${functionMeta.title}`;
      const codePath = path.join(this.props.projectPath, ".build", pkgName);
      // console.log("codePath", codePath);
      // console.log("rootPointer", rootPointer);

      const func = new Function(this, `${functionMeta.title}GpSyncHandler`, {
        runtime: config.NODE_RUNTIME,
        code: Code.fromAsset(codePath),
        handler: rootPointer,
        functionName,
        memorySize: functionMeta.memory,
        timeout: Duration.seconds(
          functionMeta.timeout || config.SYNC_LAMBDA_TIMEOUT,
        ),
        description: functionMeta.description,
      });

      this.syncLambdaArns.push(func.functionArn);

      return {
        func,
        meta: functionMeta,
      };
    });
  };

  /** Create Lambda function constructs for functions that return result async */
  private createAsyncFunctions = (): AsyncFunctionWithMeta[] => {
    const asyncFunctionMetas =
      this.props.manifest.geoprocessingFunctions.filter(
        (func) =>
          func.executionMode === "async" && func.purpose !== "preprocessing",
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
              path.join(this.props.projectPath, ".build", pkgName),
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
          },
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
              path.join(this.props.projectPath, ".build", pkgName),
            ),

            handler: rootPointer,
            functionName: runFunctionName,
            memorySize: functionMeta.memory,
            timeout: Duration.seconds(
              functionMeta.timeout || config.ASYNC_LAMBDA_RUN_TIMEOUT,
            ),
            description: functionMeta.description,
            environment: {
              ASYNC_REQUEST_TYPE: "run",
            },
          },
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

        this.asyncRunLambdas.push(runFunc);

        return {
          startFunc,
          runFunc,
          meta: functionMeta,
        };
      },
    );
  };

  /**
   * Given run lambda functions across all lambda stacks, creates policies allowing them to invoke sync lambdas within this lambda stack
   */
  createLambdaSyncPolicies(runLambdas: Function[]) {
    // Create invoke policy for each worker function in this lambda stack
    const invokeSyncLambdaPolicies = this.syncLambdaArns.map((arn) => {
      return new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [arn],
        actions: ["lambda:InvokeFunction"],
      });
    });

    // Allow all async run lambdas to invoke sync functions in this lambda stack using this policy
    runLambdas.forEach((runLambda, index) => {
      invokeSyncLambdaPolicies.forEach((curInvokeSyncLambdaPolicy, index2) => {
        const syncLambdaRole = new Role(
          this,
          "GpSyncLambdaRole" + index + "_" + index2,
          {
            assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
          },
        );
        syncLambdaRole.addToPolicy(curInvokeSyncLambdaPolicy);
        runLambda.addToRolePolicy(curInvokeSyncLambdaPolicy);
      });
    });
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

/**
 * Returns build package name to look for handler
 */
export function getHandlerPkgName(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename
    .replace(/\.js$/, "")
    .replace(/\.ts$/, "")}`;
}
