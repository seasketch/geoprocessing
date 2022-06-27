import { GeoprocessingStack } from "./GeoprocessingStack";
import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { CfnAccount } from "aws-cdk-lib/aws-apigateway";
import config from "./config";
import { CfnStage } from "aws-cdk-lib/aws-apigatewayv2";
import {
  PolicyStatement,
  Effect,
  ServicePrincipal,
  Role,
  ManagedPolicy,
} from "aws-cdk-lib/aws-iam";
import { createSocketFunctions } from "./functionResources";
import { Function } from "aws-cdk-lib/aws-lambda";
import { STAGE_NAME } from "./GeoprocessingStackV1";

/**
 * Create Web Socket API for async functions
 */
export const createWebSocketApi = (stack: GeoprocessingStack): WebSocketApi => {
  const fns = createSocketFunctions(stack);

  // Create web socket with subscribe and unsubscribe routes
  const webSocketApi = new WebSocketApi(stack, "WebSocketApi", {
    apiName: `gp-${stack.props.projectName}-socket`,
    description: `Serves web socket requests for ${stack.props.projectName}.`,
    connectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "OnConnectIntegration",
        fns.subscribe
      ),
    },
    disconnectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "OnDisconnectIntegration",
        fns.unsubscribe
      ),
    },
    routeSelectionExpression: "$request.body.message",
  });

  /**
   * Allow send lambda function to manage socket connections, invoke lambda, and manage socket subscriptions in dynamodb
   * TODO: not sure need all these for dynamodb... need to double check
   * TODO: verify v1 role removed as may not be needed.
   */
  const socketApiSendPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    resources: [fns.send.functionArn],
    principals: [new ServicePrincipal("apigateway.amazonaws.com")],
    actions: [
      "lambda:InvokeFunction",
      "execute-api:ManageConnections",
      "dynamodb:GetItem",
      "dynamodb:DeleteItem",
      "dynamodb:PutItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:BatchGetItem",
      "dynamodb:DescribeTable",
      "dynamodb:ConditionCheckItem",
    ],
  });
  fns.send.addToRolePolicy(socketApiSendPolicy);

  // Is this needed?
  const dynamoSendRole = new Role(stack, "GpDynamoSendRole", {
    assumedBy: new ServicePrincipal("dynamodb.amazonaws.com"),
  });
  dynamoSendRole.addToPolicy(socketApiSendPolicy);

  // Add send message route
  webSocketApi.addRoute("sendMessage", {
    integration: new WebSocketLambdaIntegration(
      `sendMessageIntegration`,
      fns.send
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
  fns.send.addToRolePolicy(socketExecutePolicy);
  fns.subscribe.addToRolePolicy(socketExecutePolicy);
  fns.unsubscribe.addToRolePolicy(socketExecutePolicy);

  // Allow the socket apigateway to call the socket lambdas.  Supposedly RestApi automatically creates this, but not WebSocketApi
  const apigatewayPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    principals: [new ServicePrincipal("apigateway.amazonaws.com")],
    actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
  });

  // Create async function resources
  stack.getAsyncFunctionsWithMeta().forEach((asyncFunctionWithMeta) => {
    const action = `start${asyncFunctionWithMeta.meta.title}`;
    const route = webSocketApi.addRoute(action, {
      integration: new WebSocketLambdaIntegration(
        `${action}Integration`,
        asyncFunctionWithMeta.startFunc
      ),
    });
    // Note assume requestTemplates no longer needed
  });

  /** Create auto-deployed production stage */
  createStage(stack, webSocketApi, config.STAGE_NAME);

  return webSocketApi;
};

const createStage = (
  scope: Stack,
  webSocketApi: WebSocketApi,
  stageName: string
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
  stack.getAsyncFunctionsWithMeta().forEach((asyncFunctionWithMeta) => {
    addAsyncEnv(stack, asyncFunctionWithMeta.startFunc);
    addAsyncEnv(stack, asyncFunctionWithMeta.runFunc);
  });
};

const addAsyncEnv = (stack: GeoprocessingStack, func: Function) => {
  func.addEnvironment("WSS_REF", stack.socketApi.apiId);
  func.addEnvironment("WSS_REGION", stack.region);
  func.addEnvironment("WSS_STAGE", STAGE_NAME);
};
