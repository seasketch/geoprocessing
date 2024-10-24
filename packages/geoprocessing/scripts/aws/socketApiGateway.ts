import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { WebSocketApi, WebSocketStage } from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Stack } from "aws-cdk-lib";
import config from "./config.js";
import { CfnStage } from "aws-cdk-lib/aws-apigatewayv2";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { Function } from "aws-cdk-lib/aws-lambda";

/**
 * Create Web Socket API for async functions
 */
export const createWebSocketApi = (
  stack: GeoprocessingStack,
): WebSocketApi | undefined => {
  if (
    !stack.projectFunctions.socketFunctions.subscribe ||
    !stack.projectFunctions.socketFunctions.unsubscribe ||
    !stack.projectFunctions.socketFunctions.send
  )
    return undefined;

  // Create web socket with subscribe and unsubscribe routes
  const webSocketApi = new WebSocketApi(stack, "WebSocketApi", {
    apiName: `gp-${stack.props.projectName}-socket`,
    description: `Serves web socket requests for ${stack.props.projectName}.`,
    connectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "OnConnectIntegration",
        stack.projectFunctions.socketFunctions.subscribe,
      ),
    },
    disconnectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "OnDisconnectIntegration",
        stack.projectFunctions.socketFunctions.unsubscribe,
      ),
    },
    routeSelectionExpression: "$request.body.message",
  });

  // Add sendmessage route
  webSocketApi.addRoute("sendmessage", {
    integration: new WebSocketLambdaIntegration(
      `OnSendIntegration`,
      stack.projectFunctions.socketFunctions.send,
    ),
  });

  // Allow socket lambda functions to manage socket connections
  const socketExecutePolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["execute-api:ManageConnections"],
    resources: [
      `arn:aws:execute-api:${stack.region}:${stack.account}:${webSocketApi.apiId}/*`,
    ],
  });
  stack.projectFunctions.socketFunctions.send.addToRolePolicy(
    socketExecutePolicy,
  );
  stack.projectFunctions.socketFunctions.subscribe.addToRolePolicy(
    socketExecutePolicy,
  );
  stack.projectFunctions.socketFunctions.unsubscribe.addToRolePolicy(
    socketExecutePolicy,
  );

  /** Create auto-deployed production stage */
  createStage(stack, webSocketApi, config.STAGE_NAME);

  return webSocketApi;
};

const createStage = (
  scope: Stack,
  webSocketApi: WebSocketApi,
  stageName: string,
): WebSocketStage => {
  // Unlike RestApi, you don't get a default `prod` stage automatically.
  const stage = new WebSocketStage(scope, "GpSocketApiStage", {
    autoDeploy: true,
    stageName,
    webSocketApi,
  });
  // Manage the log group
  // new LogGroup(scope, 'ExecutionLogs', {
  //   logGroupName: `/aws/apigateway/${webSocketApi.apiId}/${config.STAGE_NAME}`,
  //   removalPolicy: RemovalPolicy.DESTROY,
  //   retention: RetentionDays.ONE_WEEK,
  // });
  // const log = new LogGroup(scope, 'AccessLogs', {
  //   removalPolicy: RemovalPolicy.DESTROY,
  //   retention: RetentionDays.ONE_WEEK,
  // });
  const cfnStage = stage.node.defaultChild as CfnStage;
  // cfnStage.accessLogSettings = {
  //   destinationArn: log.logGroupArn,
  //   format: `$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId`,
  // };
  cfnStage.defaultRouteSettings = {
    dataTraceEnabled: true,
    loggingLevel: "INFO",
    throttlingBurstLimit: 500,
    throttlingRateLimit: 1000,
  };

  /*
   * This role is automatically created by the RestApi construct but not by WebSocketApi.
   * CfnAccount isn't even available in the `aws-cdk-lib/aws-apigatewayv2` lib so we must import `aws-cdk-lib/aws-apigateway`
   * to create the CloudWatch role.
   */
  // const cwRole = new Role(scope, "CWRole", {
  //   assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
  //   managedPolicies: [
  //     ManagedPolicy.fromAwsManagedPolicyName(
  //       "service-role/AmazonAPIGatewayPushToCloudWatchLogs"
  //     ),
  //   ],
  // });

  // const account = new CfnAccount(scope, "Account", {
  //   cloudWatchRoleArn: cwRole.roleArn,
  // });

  // webSocketApi.node.addDependency(account);

  return stage;
};

/** Setup function access to web socket */
export const setupWebSocketFunctionAccess = (stack: GeoprocessingStack) => {
  if (!stack.socketApi) return;

  for (const asyncFunctionWithMeta of stack.getAsyncFunctionsWithMeta()) {
    addAsyncEnv(stack, asyncFunctionWithMeta.startFunc);
    addAsyncEnv(stack, asyncFunctionWithMeta.runFunc);
  }
};

const addAsyncEnv = (stack: GeoprocessingStack, func: Function) => {
  if (stack.socketApi) {
    func.addEnvironment("WSS_REF", stack.socketApi.apiId);
    func.addEnvironment("WSS_REGION", stack.region);
    func.addEnvironment("WSS_STAGE", config.STAGE_NAME);
  }
};
