import path from "path";
import {
  Manifest,
  PreprocessingFunctionMetadata,
  GeoprocessingFunctionMetadata,
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

const NODE_RUNTIME = lambda.Runtime.NODEJS_14_X;
const STAGE_NAME = "prod";
const SYNC_LAMBDA_TIMEOUT = 10; // seconds
const ASYNC_LAMBDA_START_TIMEOUT = 5;
const ASYNC_LAMBDA_RUN_TIMEOUT = 60;

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
  /** Table storing socket status */
  socketsTbl: dynamodb.Table | undefined;
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
    const syncFunctions: (
      | PreprocessingFunctionMetadata
      | GeoprocessingFunctionMetadata
    )[] = [
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

    if (hasClients) this.createClientResources();
    this.createSharedResources();
    if (hasAsync) this.createSharedAsyncFunctionResources();
    syncFunctions.forEach(this.createSyncFunctionResources, this);
    asyncFunctions.forEach(this.createAsyncFunctionResources, this);
  }

  createClientResources() {
    // client bundle bucket
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: `${this.props.projectName}-client-${this.region}`,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    // client bundle cloudfront
    this.clientCloudfront = new cloudfront.CloudFrontWebDistribution(
      this,
      "ClientDistribution",
      {
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

    // Will run cloudfront invalidation on changes
    new s3deploy.BucketDeployment(this, "DeployWebsiteIndex", {
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

  createSharedResources() {
    /**
     * Bucket resources will be accessible via a public url
     * Location should not be published and cannot be listed by clients.
     */
    this.publicBucket = new s3.Bucket(this, `PublicResults`, {
      bucketName: `${this.props.projectName}-public-${this.region}`,
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

    this.tasksTbl = new dynamodb.Table(
      this,
      `gp-${this.props.manifest.title}-tasks`,
      {
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "service", type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        tableName: `gp-${this.props.manifest.title}-tasks`,
        removalPolicy: core.RemovalPolicy.DESTROY,
      }
    );
    if (!this.tasksTbl) throw new Error("Error creating tasks table");

    this.estimatesTbl = new dynamodb.Table(
      this,
      `gp-${this.props.manifest.title}-estimates`,
      {
        partitionKey: {
          name: "service",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        tableName: `gp-${this.props.manifest.title}-estimates`,
        removalPolicy: core.RemovalPolicy.DESTROY,
      }
    );
    if (!this.estimatesTbl) throw new Error("Error creating estimates table");

    /**
     * REST API for all gp project endpoints
     */
    this.api = new apigateway.RestApi(
      this,
      `${this.props.projectName}-geoprocessing-api`,
      {
        restApiName: `${this.props.projectName} geoprocessing service`,
        description: `Serves API requests for ${this.props.projectName}.`,
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: apigateway.Cors.ALL_METHODS,
        },
        deployOptions: {
          throttlingBurstLimit: 20,
          throttlingRateLimit: 40,
        },
      }
    );

    // Create lambda to return project metadata
    const metadataHandler = new lambda.Function(this, "MetadataHandler", {
      runtime: NODE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(this.props.projectPath, ".build")),
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

  createSharedAsyncFunctionResources() {
    // Socket interface for running async functions
    this.apigatewaysocket = new apigateway.CfnApiV2(this, "apigatewaysocket", {
      name: ` async-gp-service-${this.props.projectName}`,
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.message",
    });

    let gatewayArn = `arn:aws:execute-api:${this.region}:${this.account}:${this.apigatewaysocket.ref}/*`;
    const sendExecutePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [gatewayArn],
      actions: ["execute-api:ManageConnections"],
    });

    // Table for tracking socket status
    this.socketsTbl = new dynamodb.Table(
      this,
      `gp-${this.props.manifest.title}-websocketids`,
      {
        partitionKey: {
          name: "connectionId",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        tableName: `gp-${this.props.manifest.title}-websocketids`,
        removalPolicy: core.RemovalPolicy.DESTROY,
      }
    );

    //policy to allow the socket apigateway to call the socket lambdas
    //without this the send messages fail

    //TODO: remove, this is never used?
    const apigatewayPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
      actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
    });

    let projectName = `${this.props.manifest.title}`;
    const asyncConnHandler = new lambda.Function(
      this,
      `${projectName}AsyncConnectionHandler`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build/")
        ),
        handler: "connect.connectHandler",
        functionName: projectName + "-Connect",
        memorySize: 1024,
        timeout: core.Duration.seconds(3),
        description: " for connecting sockets",
        environment: {
          SOCKETS_TABLE: this.socketsTbl.tableName,
        },
        initialPolicy: [sendExecutePolicy],
      }
    );

    const asyncDisconnectHandler = new lambda.Function(
      this,
      `${projectName}AsyncDisconnectHandler`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build/")
        ),
        handler: "disconnect.disconnectHandler",
        functionName: projectName + "-Disconnect",
        memorySize: 1024,
        timeout: core.Duration.seconds(3),
        description: " for disconnecting sockets",
        environment: {
          SOCKETS_TABLE: this.socketsTbl.tableName,
        },
        initialPolicy: [sendExecutePolicy],
      }
    );

    /**
     * access role for the socket api to access the socket lambda
     * TODO: not sure need all these...need to double check
     */
    const connPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [asyncConnHandler.functionArn],
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

    const connRole = new iam.Role(this, "roleConn", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });
    connRole.addToPolicy(connPolicy);
    const connDRole = new iam.Role(this, "roleConnDynamo", {
      assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
    });
    connDRole.addToPolicy(connPolicy);
    const apigatewayroutesocketconnect = new apigateway.CfnRouteV2(
      this,
      "apigatewayroutesocketconnect",
      {
        apiId: this.apigatewaysocket.ref,
        routeKey: "$connect",
        authorizationType: "NONE",
        operationName: "ConnectRoute",

        target:
          "integrations/" +
          new apigateway.CfnIntegrationV2(
            this,
            "apigatewayintegrationsocketconnect",
            {
              apiId: this.apigatewaysocket.ref,
              integrationType: "AWS_PROXY",
              integrationUri:
                "arn:aws:apigateway:" +
                this.region +
                ":lambda:path/2015-03-31/functions/" +
                asyncConnHandler.functionArn +
                "/invocations",
              credentialsArn: connRole.roleArn,
            }
          ).ref,
      }
    );

    const disPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [asyncDisconnectHandler.functionArn],
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

    const disRole = new iam.Role(this, "roleDis", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });
    const disDRole = new iam.Role(this, "roleDisDynamo", {
      assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
    });
    disDRole.addToPolicy(disPolicy);
    disRole.addToPolicy(disPolicy);

    // disconnect route
    const apigatewayroutesocketdisconnect = new apigateway.CfnRouteV2(
      this,
      "apigatewayroutesocketdisconnect",
      {
        apiId: this.apigatewaysocket.ref,
        routeKey: "$disconnect",
        authorizationType: "NONE",
        operationName: "DisconnectRoute",
        target:
          "integrations/" +
          new apigateway.CfnIntegrationV2(
            this,
            "apigatewayintegrationsocketdisconnect",
            {
              apiId: this.apigatewaysocket.ref,
              integrationType: "AWS_PROXY",
              integrationUri:
                "arn:aws:apigateway:" +
                this.region +
                ":lambda:path/2015-03-31/functions/" +
                asyncDisconnectHandler.functionArn +
                "/invocations",
              credentialsArn: disRole.roleArn,
            }
          ).ref,
      }
    );
    const asyncSendHandler = new lambda.Function(
      this,
      `${projectName}AsyncSendHandler2`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build/")
        ),
        handler: "sendmessage.sendHandler",
        functionName: projectName + "-SendMessage",
        memorySize: 1024,
        timeout: core.Duration.seconds(3),
        description: " for sending messages on sockets",
        environment: {
          SOCKETS_TABLE: this.socketsTbl.tableName,
        },
        initialPolicy: [sendExecutePolicy],
      }
    );
    const sendRole = new iam.Role(this, "roleSend", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
    });
    const sendPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [asyncSendHandler.functionArn],
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

    sendRole.addToPolicy(sendPolicy);
    const sendDRole = new iam.Role(this, "roleSendDynamo", {
      assumedBy: new iam.ServicePrincipal("dynamodb.amazonaws.com"),
    });
    sendDRole.addToPolicy(sendPolicy);

    const apigatewayroutesocketsend = new apigateway.CfnRouteV2(
      this,
      "apigatewayroutesocketsend",
      {
        apiId: this.apigatewaysocket.ref,
        routeKey: "sendmessage",
        authorizationType: "NONE",
        operationName: "SendRoute",
        target:
          "integrations/" +
          new apigateway.CfnIntegrationV2(
            this,
            "apigatewayintegrationsocketsend",
            {
              apiId: this.apigatewaysocket.ref,
              integrationType: "AWS_PROXY",

              integrationUri:
                "arn:aws:apigateway:" +
                this.region +
                ":lambda:path/2015-03-31/functions/" +
                asyncSendHandler.functionArn +
                "/invocations",
              credentialsArn: sendRole.roleArn,
            }
          ).ref,
      }
    );

    this.socketsTbl.grantReadWriteData(asyncConnHandler);
    this.socketsTbl.grantReadWriteData(asyncDisconnectHandler);
    this.socketsTbl.grantReadWriteData(asyncSendHandler);
    this.estimatesTbl?.grantReadWriteData(asyncSendHandler);

    // deployment
    const apigatewaydeploymentsocket2 = new apigateway.CfnDeploymentV2(
      this,
      "apigatewaydeploymentsocket",
      {
        apiId: this.apigatewaysocket.ref,
      }
    );

    // stage
    const apigatewaystagesocket2 = new apigateway.CfnStageV2(
      this,
      "apigatewaystagesocket2",
      {
        apiId: this.apigatewaysocket.ref,
        deploymentId: apigatewaydeploymentsocket2.ref,
        stageName: STAGE_NAME,

        defaultRouteSettings: {
          throttlingBurstLimit: 500,
          throttlingRateLimit: 1000,
        },
      }
    );

    // all the routes are dependencies of the deployment
    const routes = new core.ConcreteDependable();
    routes.add(apigatewayroutesocketconnect);
    routes.add(apigatewayroutesocketdisconnect);
    routes.add(apigatewayroutesocketsend);

    // Add the dependency
    apigatewaydeploymentsocket2.node.addDependency(routes);
  }

  createSyncFunctionResources(
    func: PreprocessingFunctionMetadata | GeoprocessingFunctionMetadata,
    index: number
  ) {
    // @ts-ignore
    const filename = path.basename(func.handler);
    let policies: iam.PolicyStatement[] = [];
    let funcName = `gp-${this.props.manifest.title}-${func.title}-sync`;

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

    const syncHandler = new lambda.Function(this, `${func.title}Handler`, {
      runtime: NODE_RUNTIME,
      code: lambda.Code.fromAsset(path.join(this.props.projectPath, ".build")),
      handler: filename.replace(/\.js$/, "") + ".handler",
      functionName: funcName,
      memorySize: func.memory,
      timeout: core.Duration.seconds(func.timeout || SYNC_LAMBDA_TIMEOUT),
      description: func.description,
      initialPolicy: policies,
      environment: {
        publicBucketUrl: this.publicBucketUrl,
        TASKS_TABLE: this.tasksTbl.tableName,
        ESTIMATES_TABLE: this.estimatesTbl.tableName,
      },
    });

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
    // @ts-ignore
    const filename = path.basename(func.handler);
    let policies: iam.PolicyStatement[] = [];
    let functionName = `gp-${this.props.manifest.title}-${func.title}-async`;

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
    if (!this.socketsTbl)
      throw new Error(
        "createAsyncFunctionResources - Sockets table not defined"
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
      SOCKETS_TABLE: this.socketsTbl?.tableName,
      ASYNC_HANDLER_FUNCTION_NAME: functionName,
      WSS_REF: this.apigatewaysocket.ref,
      WSS_REGION: this.region,
      WSS_STAGE: STAGE_NAME,
    };

    // First Lambda is for starting GP function with http rest interface
    const asyncStartHandler = new lambda.Function(
      this,
      `${func.title}Handler`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build")
        ),
        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName,
        memorySize: func.memory,
        timeout: core.Duration.seconds(ASYNC_LAMBDA_START_TIMEOUT),
        description: func.description,
        initialPolicy: policies,
        environment: {
          ...baseAsyncEnvOptions,
          ASYNC_REQUEST_TYPE: "start",
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
      `${func.title}AsyncRunHandler`,
      {
        runtime: NODE_RUNTIME,
        code: lambda.Code.fromAsset(
          path.join(this.props.projectPath, ".build")
        ),

        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName,
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

    const roleLambda = new iam.Role(this, "roleLambda" + index, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    roleLambda.addToPolicy(asyncLambdaPolicy);
    policies = [asyncLambdaPolicy];

    this.tasksTbl.grantReadWriteData(asyncRunHandler);
    this.estimatesTbl.grantReadWriteData(asyncRunHandler);
    this.publicBucket.grantReadWrite(asyncRunHandler);
  }
}
