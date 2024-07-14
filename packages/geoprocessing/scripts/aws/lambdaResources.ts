import { GeoprocessingStack } from "./GeoprocessingStack.js";

import { GpDynamoTables, GpPublicBuckets } from "./types.js";

export interface CreateFunctionOptions {
  clientDistributionUrl?: string;
  publicBuckets: GpPublicBuckets;
  tables: GpDynamoTables;
}

import { GeoprocessingNestedStackProps, LambdaStack } from "./LambdaStack.js";
import { chunk } from "../../src/index.js";
import {
  isGeoprocessingFunctionMetadata,
  isPreprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest.js";

/**
 * Creates lambda sub-stacks, as many as needed so as not to break resource limit
 */
export const createLambdaStacks = (
  stack: GeoprocessingStack,
  props: GeoprocessingNestedStackProps
): LambdaStack[] => {
  // assume can handle 20 functions per stack, even if all async
  const FUNCTIONS_PER_STACK = 20;

  const functions: ProcessingFunctionMetadata[] = [
    ...props.manifest.preprocessingFunctions,
    ...props.manifest.geoprocessingFunctions,
  ];

  const functionGroups = chunk(
    functions.sort((a, b) => a.title.localeCompare(b.title)),
    FUNCTIONS_PER_STACK
  );

  const lambdaStacks = functionGroups.map((funcGroup, i) => {
    const newStack = new LambdaStack(stack, `functions-group-${i}`, {
      ...props,
      manifest: {
        // shave down manifest to just the functions in this group
        ...props.manifest,
        preprocessingFunctions: funcGroup.filter(
          isPreprocessingFunctionMetadata
        ),
        geoprocessingFunctions: funcGroup.filter(
          isGeoprocessingFunctionMetadata
        ),
      },
    });

    return newStack;
  });
  return lambdaStacks;
};
