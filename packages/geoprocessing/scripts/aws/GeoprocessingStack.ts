import path from "path";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest";
import * as core from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import { CorsRule } from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import { CacheControl } from "@aws-cdk/aws-s3-deployment";

export const NODE_RUNTIME = lambda.Runtime.NODEJS_14_X;
export const STAGE_NAME = "prod";
const SYNC_LAMBDA_TIMEOUT = 10; // seconds
const ASYNC_LAMBDA_START_TIMEOUT = 5;
const ASYNC_LAMBDA_RUN_TIMEOUT = 60;
const SOCKET_HANDLER_TIMEOUT = core.Duration.seconds(3);
const SOCKET_HANDLER_MEMORY = 1024;

interface GeoprocessingStackProps extends core.StackProps {
  projectName: string;
  projectPath: string;
  manifest: Manifest;
}

/**
 * Design is a single CloudFormation app with a single stack for ease of management
 * Supports functions being sync or async in executionMode and preprocessor or geoprocessor in purpose
 * Async + preprocessor combination is not supported
 * Each project gets one API gateway, s3 bucket, and db table for tracking tasks and function run timeestimates
 * Each async project also gets a sockets db table and web socket machinery
 * Each function gets a lambda for sync mode, or a set of lambdas for async mode
 */
export default class GeoprocessingStack extends core.Stack {
  /** The project name */
  props: GeoprocessingStackProps;

  // class properties below exist because they are referenced between resource groups (and their create methods)

  /** Cloudfront distribution for client bundles */
  clientCloudfront: cloudfront.CloudFrontWebDistribution | undefined;
  /** Table for tracking status of project function calls, aka Tasks */
  tasksTbl: dynamodb.Table | undefined;
  /** Table for storing project function run times for estimating future runs */
  estimatesTbl: dynamodb.Table | undefined;
  /** Table storing task result subscriptions */
  subscriptionsTbl: dynamodb.Table | undefined;
  /** Public S3 bucket for storing additional geoprocessing output other than JSON results */
  publicBucket: s3.Bucket | undefined;
  /** URL to public bucket */
  publicBucketUrl: string | undefined;
  api: apigateway.RestApi | undefined;
  /** API gateway for web socket */
  apigatewaysocket: apigateway.CfnApiV2 | undefined;

  constructor(scope: core.App, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);
    this.props = props;

    const hasClients = this.props.manifest.clients.length > 0;
    // sync - preprocessors and sync geoprocessors
    const syncFunctions: ProcessingFunctionMetadata[] = [
      ...this.props.manifest.preprocessingFunctions,
      ...this.props.manifest.geoprocessingFunctions.filter(
        (func) => func.executionMode === "sync"
      ),
    ];
    // async - geoprocessors only, async preprocessors not supported
    const asyncFunctions = this.props.manifest.geoprocessingFunctions.filter(
      (func) =>
        func.executionMode === "async" && func.purpose !== "preprocessing"
    );
    const hasAsync = asyncFunctions.length > 0;

    this.createSharedResources();
    if (hasClients) this.createClientResources();
    if (hasAsync) this.createSharedAsyncFunctionResources();
    syncFunctions.forEach(this.createSyncFunctionResources, this);
    asyncFunctions.forEach(this.createAsyncFunctionResources, this);
  }

  createSharedResources() {
    /**
     * Publicly accessible bucket for results that aren't simple JSON serializable
     * Location is not published or able to be listed.
     */
    this.publicBucket = new s3.Bucket(this, `GpPublicBucket`, {
      bucketName: `gp-${this.props.projectName}-public`,
      versioned: false,
      publicReadAccess: true,
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: ["HEAD", "GET"],
          allowedHeaders: ["*"],
          id: "cors-rule",
          maxAge: 3600,
        } as CorsRule,
      ],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    this.publicBucketUrl = this.publicBucket.urlForObject();

    this.tasksTbl = new dynamodb.Table(this, `GpTasksTable`, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "service", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${this.props.projectName}-tasks`,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    if (!this.tasksTbl) throw new Error("Error creating tasks table");

    this.estimatesTbl = new dynamodb.Table(this, `GpEstimatesTable`, {
      partitionKey: {
        name: "service",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${this.props.projectName}-estimates`,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    if (!this.estimatesTbl) throw new Error("Error creating estimates table");

    /**
     * REST API for all gp project endpoints
     */
    this.api = new apigateway.RestApi(this, `GpRestApi`, {
      restApiName: `gp-${this.props.projectName}`,
      description: `Serves API requests for ${this.props.projectName}.`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      deployOptions: {
        throttlingBurstLimit: 20,
        throttlingRateLimit: 40,
      },
    });

    // Create lambda to return project metadata
    const metadataHandler = new lambda.Function(this, "GpMetadataHandler", {
      runtime: NODE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(this.props.projectPath, ".build")),
      functionName: `gp-${this.props.projectName}-metadata`,
      handler: "serviceHandlers.projectMetadata",
      environment: {
        ...(this.clientCloudfront
          ? { clientUrl: this.clientCloudfront.distributionDomainName }
          : {}),
      },
    });
    // TODO: this grant doesn't appear to be used, remove
    this.tasksTbl.grantReadData(metadataHandler);

    // Register root API call to return project metadata
    const getMetadataIntegration = new apigateway.LambdaIntegration(
      metadataHandler,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );
    this.api.root.addMethod("GET", getMetadataIntegration);
  }

  createClientResources() {
    /** Client bundle bucket */
    const websiteBucket = new s3.Bucket(this, "ClientBucket", {
      bucketName: `gp-${this.props.projectName}-client`,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    /** Single cloudfront for stack */
    this.clientCloudfront = new cloudfront.CloudFrontWebDistribution(
      this,
      "ClientDistribution",
      {
        comment: `gp-${this.props.projectName}`,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    /** Sync local client bundle directory to bucket. Deploys a Lambda to do this.
     * Runs cloudfront invalidation on changes
     */
    new s3deploy.BucketDeployment(this, "ClientBucketDeploy", {
      sources: [
        s3deploy.Source.asset(path.join(this.props.projectPath, ".build-web")),
      ],
      destinationBucket: websiteBucket,
      distribution: this.clientCloudfront,
      distributionPaths: ["/*"],
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(core.Duration.days(365)),
      ],
    });
  }

  createSharedAsyncFunctionResources() {
    // Socket interface for running async functions
    this.apigatewaysocket = new apigateway.CfnApiV2(this, `SocketApi`, {
      name: `gp-${this.props.projectName}-socket`,
      protocolType: "WEBSOCKET",
      description: `Serves web socket requests for ${this.props.projectName}.`,
      routeSelectionExpression: "$request.body.message",
    });

    let gatewayArn = `arn:aws:execute-api:${this.region}:${this.account}:${this.apigatewaysocket.ref}/*`;
    const sendExecutePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [gatewayArn],
      actions: ["execute-api:ManageConnections"],
    });

    /** Track subscriptions - tasks and possibly more */
    this.subscriptionsTbl = new dynamodb.Table(this, "GpSubscriptionsTable", {
      partitionKey: {
        name: "connectionId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${this.props.projectName}-subscriptions`,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    //policy to allow the socket apigateway to call the socket lambdas
    //without this the send messages fail
    //TODO: remove, this is never used?
    const apigatewayPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
      actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
    });

    const subscribeHandler = new lambda.Function(this, "GpSubscribeHandler", {
      runtime: NODE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(this.props.projectPath, ".build/")),
      handler: "connect.connectHandler",
      functionName: `gp-${this.props.projectName}-subscribe`,
      memorySize: SOCKET_HANDLER_MEMORY,
      timeout: SOCKET_HANDLER_TIMEOUT,
      description: "Subscribe to messages",
      environment: {
        SOCKETS_TABLE: this.subscriptionsTbl.tableName,
      },
      initialPolicy: [sendExecutePolicy],
    });

    const unsubscribeHandler = new lambda.Function(
      this,
      "GpUnsubscribeHandler",
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build/")
        ),
        handler: "disconnect.disconnectHandler",
        functionName: `gp-${this.props.projectName}-unsubscribe`,
        memorySize: SOCKET_HANDLER_MEMORY,
        timeout: SOCKET_HANDLER_TIMEOUT,
        description: "Unsubscribe from messages",
        environment: {
          SOCKETS_TABLE: this.subscriptionsTbl.tableName,
        },
        initialPolicy: [sendExecutePolicy],
      }
    );

    /**
     * access role for the socket api to access the socket lambda
     * TODO: not sure need all these...need to double check
     */
    const socketApiSubscribePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [subscribeHandler.functionArn],
      actions: [
        "lambda:InvokeFunction",
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
      ],
    });

    const socketApiSubscribeRole = new iam.Role(
      this,
      "GpSocketApiSubscribeRole",
      {
        assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      }
    );
    socketApiSubscribeRole.addToPolicy(socketApiSubscribePolicy);
    const dynamoSubscribeRole = new iam.Role(this, "GpDynamoSubscribeRole", {
      assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
    });
    dynamoSubscribeRole.addToPolicy(socketApiSubscribePolicy);

    const socketApiSubscribeRoute = new apigateway.CfnRouteV2(
      this,
      "GpSocketApiSubscribeRoute",
      {
        apiId: this.apigatewaysocket.ref,
        routeKey: "$connect",
        authorizationType: "NONE",
        operationName: "SubscribeRoute",

        target:
          "integrations/" +
          new apigateway.CfnIntegrationV2(
            this,
            "GpSocketApiSubscribeHandlerIntegration",
            {
              apiId: this.apigatewaysocket.ref,
              integrationType: "AWS_PROXY",
              integrationUri:
                "arn:aws:apigateway:" +
                this.region +
                ":lambda:path/2015-03-31/functions/" +
                subscribeHandler.functionArn +
                "/invocations",
              credentialsArn: socketApiSubscribeRole.roleArn,
            }
          ).ref,
      }
    );

    const socketApiDisconnectPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [unsubscribeHandler.functionArn],
      actions: [
        "lambda:InvokeFunction",
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
      ],
    });

    const socketApiUnsubscribeRole = new iam.Role(
      this,
      "GpSocketApiUnsubscribeRole",
      {
        assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      }
    );
    const dynamoUnsubscribeRole = new iam.Role(
      this,
      "GpDynamoUnsubscribeRole",
      {
        assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
      }
    );
    dynamoUnsubscribeRole.addToPolicy(socketApiDisconnectPolicy);
    socketApiUnsubscribeRole.addToPolicy(socketApiDisconnectPolicy);

    const socketApiUnsubscribeRoute = new apigateway.CfnRouteV2(
      this,
      "GpSocketApiUnsubscribeRoute",
      {
        apiId: this.apigatewaysocket.ref,
        routeKey: "$disconnect",
        authorizationType: "NONE",
        operationName: "UnsubscribeRoute",
        target:
          "integrations/" +
          new apigateway.CfnIntegrationV2(
            this,
            "GpSocketApiUnsubscribeHandlerIntegration",
            {
              apiId: this.apigatewaysocket.ref,
              integrationType: "AWS_PROXY",
              integrationUri:
                "arn:aws:apigateway:" +
                this.region +
                ":lambda:path/2015-03-31/functions/" +
                unsubscribeHandler.functionArn +
                "/invocations",
              credentialsArn: socketApiUnsubscribeRole.roleArn,
            }
          ).ref,
      }
    );

    /** Send message to subscribed clients */
    const sendHandler = new lambda.Function(this, "GpSendHandler", {
      runtime: NODE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(this.props.projectPath, ".build/")),
      handler: "sendmessage.sendHandler",
      functionName: `gp-${this.props.projectName}-send`,
      memorySize: SOCKET_HANDLER_MEMORY,
      timeout: SOCKET_HANDLER_TIMEOUT,
      description: " for sending messages on sockets",
      environment: {
        SOCKETS_TABLE: this.subscriptionsTbl.tableName,
      },
      initialPolicy: [sendExecutePolicy],
    });
    const socketApiSendRole = new iam.Role(this, "GpSocketApiSendRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });
    const socketApiSendPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [sendHandler.functionArn],
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

    socketApiSendRole.addToPolicy(socketApiSendPolicy);
    const dynamoSendRole = new iam.Role(this, "GpDynamoSendRole", {
      assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
    });
    dynamoSendRole.addToPolicy(socketApiSendPolicy);

    const socketApiSendRoute = new apigateway.CfnRouteV2(
      this,
      "GpSocketApiSendRoute",
      {
        apiId: this.apigatewaysocket.ref,
        routeKey: "sendmessage",
        authorizationType: "NONE",
        operationName: "SendRoute",
        target:
          "integrations/" +
          new apigateway.CfnIntegrationV2(
            this,
            "GpSocketApiSendHandlerIntegration",
            {
              apiId: this.apigatewaysocket.ref,
              integrationType: "AWS_PROXY",

              integrationUri:
                "arn:aws:apigateway:" +
                this.region +
                ":lambda:path/2015-03-31/functions/" +
                sendHandler.functionArn +
                "/invocations",
              credentialsArn: socketApiSendRole.roleArn,
            }
          ).ref,
      }
    );

    this.subscriptionsTbl.grantReadWriteData(subscribeHandler);
    this.subscriptionsTbl.grantReadWriteData(unsubscribeHandler);
    this.subscriptionsTbl.grantReadWriteData(sendHandler);
    this.estimatesTbl?.grantReadWriteData(sendHandler);

    // deployment
    const socketApiDeployment = new apigateway.CfnDeploymentV2(
      this,
      "GpSocketApiDeployment",
      {
        apiId: this.apigatewaysocket.ref,
      }
    );

    // stage
    const socketApiStage = new apigateway.CfnStageV2(this, "GpSocketApiStage", {
      apiId: this.apigatewaysocket.ref,
      deploymentId: socketApiDeployment.ref,
      stageName: STAGE_NAME,

      defaultRouteSettings: {
        throttlingBurstLimit: 500,
        throttlingRateLimit: 1000,
      },
    });

    // all the routes are dependencies of the deployment
    const routes = new core.ConcreteDependable();
    routes.add(socketApiSubscribeRoute);
    routes.add(socketApiUnsubscribeRoute);
    routes.add(socketApiSendRoute);

    // Add the dependency
    socketApiDeployment.node.addDependency(routes);
  }

  createSyncFunctionResources(func: ProcessingFunctionMetadata, index: number) {
    const filename = path.basename(func.handlerFilename);
    let policies: iam.PolicyStatement[] = [];
    let functionName = `gp-${this.props.projectName}-sync-${func.title}`;

    if (!this.publicBucket || !this.publicBucketUrl)
      throw new Error(
        "createSyncFunctionResources - Public bucket not defined"
      );
    if (!this.tasksTbl)
      throw new Error("createSyncFunctionResources - Tasks table not defined");
    if (!this.estimatesTbl)
      throw new Error(
        "createSyncFunctionResources - Estimates table not defined"
      );
    if (!this.api)
      throw new Error("createSyncFunctionResources - API not defined");

    const syncHandler = new lambda.Function(
      this,
      `GpSyncHandler-${func.title}`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build")
        ),
        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName,
        memorySize: func.memory,
        timeout: core.Duration.seconds(func.timeout || SYNC_LAMBDA_TIMEOUT),
        description: func.description,
        initialPolicy: policies,
        environment: {
          publicBucketUrl: this.publicBucketUrl,
          TASKS_TABLE: this.tasksTbl.tableName,
          ESTIMATES_TABLE: this.estimatesTbl.tableName,
        },
      }
    );

    if (func.purpose === "geoprocessing") {
      this.tasksTbl.grantReadWriteData(syncHandler);
      this.estimatesTbl.grantReadWriteData(syncHandler);
      this.publicBucket.grantReadWrite(syncHandler);
    } // Preprocessors don't need access to these resources

    // Wire up the sync function lambda to the API gateway
    const syncHandlerIntegration = new apigateway.LambdaIntegration(
      syncHandler,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );
    const resource = this.api.root.addResource(func.title);

    // TODO: remove due to unused? does it do anything?
    const apigatewayPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
      actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
    });
    resource.addMethod("POST", syncHandlerIntegration);
    if (func.purpose === "geoprocessing") {
      resource.addMethod("GET", syncHandlerIntegration);
    }
  }

  createAsyncFunctionResources(
    func: GeoprocessingFunctionMetadata,
    index: number
  ) {
    const filename = path.basename(func.handlerFilename);
    let policies: iam.PolicyStatement[] = [];
    const startFunctionName = `gp-${this.props.projectName}-async-${func.title}-start`;
    const runFunctionName = `gp-${this.props.projectName}-async-${func.title}-run`;

    if (!this.publicBucket || !this.publicBucketUrl)
      throw new Error(
        "createAsyncFunctionResources - Public bucket not defined"
      );
    if (!this.tasksTbl)
      throw new Error("createAsyncFunctionResources - Tasks table not defined");
    if (!this.estimatesTbl)
      throw new Error(
        "createAsyncFunctionResources - Estimates table not defined"
      );
    if (!this.subscriptionsTbl)
      throw new Error(
        "createAsyncFunctionResources - Subscriptions table not defined"
      );
    if (!this.api)
      throw new Error("createAsyncFunctionResources - API not defined");
    if (!this.apigatewaysocket)
      throw new Error(
        "createAsyncFunctionResources - apigatewaysocket not defined"
      );
    if (!this.api)
      throw new Error("createSyncFunctionResources - API not defined");

    const baseAsyncEnvOptions = {
      TASKS_TABLE: this.tasksTbl?.tableName,
      ESTIMATES_TABLE: this.estimatesTbl?.tableName,
      SOCKETS_TABLE: this.subscriptionsTbl?.tableName,
      WSS_REF: this.apigatewaysocket.ref,
      WSS_REGION: this.region,
      WSS_STAGE: STAGE_NAME,
    };

    // First Lambda is for starting GP function with http rest interface
    const asyncStartHandler = new lambda.Function(
      this,
      `GpAsyncHandler-${func.title}-start`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build")
        ),
        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName: startFunctionName,
        memorySize: func.memory,
        timeout: core.Duration.seconds(ASYNC_LAMBDA_START_TIMEOUT),
        description: func.description,
        initialPolicy: policies,
        environment: {
          ...baseAsyncEnvOptions,
          ASYNC_REQUEST_TYPE: "start",
          RUN_HANDLER_FUNCTION_NAME: runFunctionName,
        },
      }
    );

    this.tasksTbl.grantReadWriteData(asyncStartHandler);
    this.estimatesTbl.grantReadWriteData(asyncStartHandler);
    this.publicBucket.grantReadWrite(asyncStartHandler);

    const asyncStartHandlerIntegration = new apigateway.LambdaIntegration(
      asyncStartHandler,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );

    const resource = this.api.root.addResource(func.title);
    //TODO: remove, this is never used?
    const apigatewayPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
      actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
    });
    resource.addMethod("POST", asyncStartHandlerIntegration);
    resource.addMethod("GET", asyncStartHandlerIntegration);

    // Second Lambda is for running GP function and communicating results with web socket interface
    const asyncRunHandler = new lambda.Function(
      this,
      `GpAsyncHandler-${func.title}-run`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build")
        ),

        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName: runFunctionName,
        memorySize: func.memory,
        timeout: core.Duration.seconds(
          func.timeout || ASYNC_LAMBDA_RUN_TIMEOUT
        ),
        description: func.description,
        environment: {
          ...baseAsyncEnvOptions,
          ASYNC_REQUEST_TYPE: "run",
        },
      }
    );

    // Policy to allow the async start handler to call the async run handler (or any other)
    const asyncLambdaPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [asyncRunHandler.functionArn],
      actions: ["lambda:InvokeFunction"],
    });

    const asyncLambdaRole = new iam.Role(this, "GpAsyncLambdaRole" + index, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    asyncLambdaRole.addToPolicy(asyncLambdaPolicy);
    policies = [asyncLambdaPolicy];

    this.tasksTbl.grantReadWriteData(asyncRunHandler);
    this.estimatesTbl.grantReadWriteData(asyncRunHandler);
    this.publicBucket.grantReadWrite(asyncRunHandler);
  }
}
