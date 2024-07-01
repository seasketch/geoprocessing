import { ProcessingFunctionMetadata } from "../manifest.js";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Function } from "aws-cdk-lib/aws-lambda";

// Pairing gp lambda function with their original GeoprocessingHandler meta
// allows the info to be used throughout stack for wiring up the functions
// and setting up fine-grained access controls

/**
 * Building blocks for a sync gp lambda function, handler paired with original user-defined metadata used to configure it
 */
export interface SyncFunctionWithMeta {
  meta: ProcessingFunctionMetadata;
  func: Function;
}

/**
 * Building blocks for an async gp lambda function, handler paired with original user-defined metadata used to configure them
 */
export interface AsyncFunctionWithMeta {
  meta: ProcessingFunctionMetadata;
  startFunc: Function;
  runFunc: Function;
}

export type ProcessingFunctions = (
  | SyncFunctionWithMeta
  | AsyncFunctionWithMeta
)[];

/**
 * Catch-all type for gp function lambda paired with metadata
 */
export type ProcessingFunctionWithMeta =
  | SyncFunctionWithMeta
  | AsyncFunctionWithMeta;

//// PROJECT CDK RESOURCE GROUPS ////

export interface GpDynamoTables {
  /** Tracks gp function run status */
  tasks?: Table;
  /** Tracks estimated time to run a function based on past runs */
  estimates?: Table;
  /** Optional subscriptions table, if there are async gp functions */
  subscriptions?: Table;
}

export interface GpPublicBuckets {
  /**
   * Publicly accessible bucket for large datasets that need to be stored outside of project code assets
   * Location is not published or able to be listed.  Can be read by gp functions whether in Lambda, local, or CI
   */
  dataset: Bucket;
  /**
   * Create publicly accessible bucket for function results that aren't simple JSON serializable
   * Location is not published or able to be listed.
   */
  result?: Bucket;
}

type SocketFunctionKeys = "subscribe" | "unsubscribe" | "send";
export type GpSocketFunctions = Record<
  SocketFunctionKeys,
  Function | undefined
>;

/**
 * Group of all Lambda functions for project
 */
export interface GpProjectFunctions {
  /** Root service index function */
  serviceRootFunction: Function;
  /** Base web socket functions */
  socketFunctions: GpSocketFunctions;
}
