import { GeoprocessingStack } from "./GeoprocessingStack";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { CfnAccount } from "aws-cdk-lib/aws-apigateway";
import { CfnModel, CfnRoute, CfnStage } from "aws-cdk-lib/aws-apigatewayv2";
import { PolicyStatement, Effect, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { GpProjectFunctions } from "./types";

/**
 * Create REST API for all gp project endpoints
 */
export const createSocketApi = (stack: GeoprocessingStack): WebSocketApi => {
  const socketApi = new WebSocketApi(stack, "WebSocketApi", {
    apiName: `gp-${stack.props.projectName}-socket`,
    description: `Serves web socket requests for ${stack.props.projectName}.`,
    // connectRouteOptions: {
    //   integration: new WebSocketLambdaIntegration(
    //     "OnConnectIntegration",
    //     fns.onConnect
    //   ),
    // },
    // disconnectRouteOptions: {
    //   integration: new WebSocketLambdaIntegration(
    //     "OnDisconnectIntegration",
    //     fns.onDisconnect
    //   ),
    // },
    routeSelectionExpression: "$request.body.message",
  });

  // Policy to allow the socket apigateway to call the socket lambdas
  // Unclear if used but potentially without this the send messages fail
  const apigatewayPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal("apigateway.amazonaws.com")],
    actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
  });

  stack.getAsyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    const syncHandlerIntegration = new LambdaIntegration(
      syncFunctionWithMeta.func,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );
    const resource = restApi.root.addResource(syncFunctionWithMeta.meta.title);
  });

  // add equivalent from tutorial
  // let gatewayArn = `arn:aws:execute-api:${this.region}:${this.account}:${this.apigatewaysocket.ref}/*`;
  // const sendExecutePolicy = new iam.PolicyStatement({
  //   effect: iam.Effect.ALLOW,
  //   resources: [gatewayArn],
  //   actions: ["execute-api:ManageConnections"],
  // });

  return restApi;
};
