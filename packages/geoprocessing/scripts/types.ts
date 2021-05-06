import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import {
  PreprocessingHandlerOptions,
  GeoprocessingHandlerOptions,
} from "../src/types";
import { VectorDataSourceDetails } from "../src/VectorDataSource";

export interface Package {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  bugs?: {
    url: string;
  };
  repository?: {
    type: "git";
    url: string;
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Signature for top-level lambda function which invokes the GP function and returns the result
 * TODO: integrate into interface for GeoprocessingHandler and PreprocessingHandler classes
 * */
export type LambdaHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

export interface GeoprocessingHandlerModule {
  handler: LambdaHandler;
  options: GeoprocessingHandlerOptions;
  sources: VectorDataSourceDetails[];
}

export interface PreprocessingHandlerModule {
  handler: LambdaHandler;
  options: PreprocessingHandlerOptions;
  sources: VectorDataSourceDetails[];
}
