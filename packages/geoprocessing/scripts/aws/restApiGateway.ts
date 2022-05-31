import { RestApi, Cors, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { GeoprocessingStack } from "./GeoprocessingStack";

import {
  GpProjectFunctions,
  getSyncFunctionsWithMeta,
} from "./functionResources";

/**
 * Create REST API for all gp project endpoints
 */
export const createRestApi = (
  stack: GeoprocessingStack,
  fns: GpProjectFunctions
) => {
  const restApi = new RestApi(stack, `GpRestApi`, {
    restApiName: `gp-${stack.props.projectName}`,
    description: `Serves API requests for ${stack.props.projectName}.`,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
    deployOptions: {
      throttlingBurstLimit: 20,
      throttlingRateLimit: 40,
    },
  });

  // Register root API call to return project metadata
  const getMetadataIntegration = new LambdaIntegration(
    fns.serviceRootFunction,
    {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    }
  );
  restApi.root.addMethod("GET", getMetadataIntegration);

  getSyncFunctionsWithMeta(fns.processingFunctions).forEach((syncFunction) => {
    const syncHandlerIntegration = new LambdaIntegration(syncFunction.func, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });
    const resource = restApi.root.addResource(syncFunction.meta.title);
  });

  return restApi;
};
