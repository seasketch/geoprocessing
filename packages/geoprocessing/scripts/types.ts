import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import {
  PreprocessingHandlerOptions,
  GeoprocessingHandlerOptions,
} from "../src/types";
import { VectorDataSourceDetails } from "../src";

/**
 * Signature for top-level lambda function which invokes the GP function and
 * returns the result
 * TODO: integrate into interface for GeoprocessingHandler and PreprocessingHandler classes
 */
export type LambdaHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

/**
 * Represents assets to package function into a Lambda. Includes
 * root Lambda handler and metadata to bootstrap itself. In an actual build
 * this is represented as a generated Node module on the filesystem.
 */
interface ProcessingBundle {
  /** Root Lambda handler function */
  handler: LambdaHandler;
  /** file name of source GeoprocessingHandler called by root handler */
  handlerFilename: string;
  /** Metadata on vector data sources used by underlying function */
  sources: VectorDataSourceDetails[];
}

/** ProcessingBundle for geoprocessing functions */
export interface GeoprocessingBundle extends ProcessingBundle {
  options: GeoprocessingHandlerOptions;
}

/** ProcessingBundle for preprocessing functions */
export interface PreprocessingBundle extends ProcessingBundle {
  options: PreprocessingHandlerOptions;
}
