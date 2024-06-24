import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import {
  PreprocessingHandlerOptions,
  GeoprocessingHandlerOptions,
} from "../src/types/index.js";
import { VectorDataSourceDetails } from "../src/index.js";

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

export interface TemplateMetadata {
  templates: string | string[];
}

const TemplateTypes = ["add-on-template", "starter-template"] as const;
export type TemplateType = (typeof TemplateTypes)[number];
