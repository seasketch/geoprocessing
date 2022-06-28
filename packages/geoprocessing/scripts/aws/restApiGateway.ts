import { RestApi, Cors, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { GeoprocessingStack } from "./GeoprocessingStack";

/**
 * Create REST API for all gp project endpoints
 */
export const createRestApi = (stack: GeoprocessingStack) => {
  // Create REST API accessible from other domains (specifically client running in seasketch iframe)
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

  // Add route to return project metadata
  const metadataIntegration = new LambdaIntegration(
    stack.functions.serviceRootFunction,
    {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    }
  );
  restApi.root.addMethod("GET", metadataIntegration);

  // Add route for each sync gp function
  stack.getSyncFunctionsWithMeta().forEach((syncFunction) => {
    const syncHandlerIntegration = new LambdaIntegration(syncFunction.func, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });
    const resource = restApi.root.addResource(syncFunction.meta.title);
    resource.addMethod("POST", syncHandlerIntegration);
    if (syncFunction.meta.purpose === "geoprocessing") {
      resource.addMethod("GET", syncHandlerIntegration);
    }
  });

  // Add route for each async gp start function
  stack.getAsyncFunctionsWithMeta().forEach((asyncFunction) => {
    const asyncHandlerIntegration = new LambdaIntegration(
      asyncFunction.startFunc,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );
    const resource = restApi.root.addResource(asyncFunction.meta.title);
    resource.addMethod("POST", asyncHandlerIntegration);
    if (asyncFunction.meta.purpose === "geoprocessing") {
      resource.addMethod("GET", asyncHandlerIntegration);
    }
  });

  return restApi;
};
