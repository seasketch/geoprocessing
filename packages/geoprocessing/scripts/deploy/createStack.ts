import * as core from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import { BucketProps, CorsRule } from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import fs from "fs";
import path from "path";
import { Manifest } from "../manifest";
import dynamodb = require("@aws-cdk/aws-dynamodb");
import slugify from "slugify";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import { CacheControl } from "@aws-cdk/aws-s3-deployment";

if (!process.env.PROJECT_PATH) {
  throw new Error("PROJECT_PATH env var not specified");
}

const PROJECT_PATH = process.env.PROJECT_PATH;

const manifest: Manifest = JSON.parse(
  fs.readFileSync(path.join(PROJECT_PATH, ".build", "manifest.json")).toString()
);

export async function createStack() {
  const projectName = manifest.title;
  const region = manifest.region as string;
  const stackName = `${projectName}-geoprocessing-stack`;

  const app = new core.App();
  const stack = new GeoprocessingCdkStack(app, stackName, {
    env: { region },
    project: projectName,
  });
  core.Tag.add(stack, "Author", slugify(manifest.author.replace(/\<.*\>/, "")));
  core.Tag.add(stack, "Cost Center", "seasketch-geoprocessing");
  core.Tag.add(stack, "Geoprocessing Project", manifest.title);
}

interface GeoprocessingStackProps extends core.StackProps {
  project: string;
}

class GeoprocessingCdkStack extends core.Stack {
  constructor(scope: core.App, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);

    /** Client Assets */
    // client bundle buckets
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: `${props.project}-client-${this.region}`,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    // client bundle cloudfront
    const distribution = new cloudfront.CloudFrontWebDistribution(
      // @ts-ignore
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
    new s3deploy.BucketDeployment(
      // @ts-ignore
      this,
      "DeployWebsiteIndex",
      {
        sources: [s3deploy.Source.asset(path.join(PROJECT_PATH, ".build-web"))],
        destinationBucket: websiteBucket,
        distribution: distribution,
        distributionPaths: ["/*"],
        cacheControl: [
          CacheControl.setPublic(),
          // @ts-ignore
          CacheControl.maxAge(core.Duration.days(365)),
        ],
      }
    );

    /** Lambda Service Assets */

    // Bucket for storing outputs of geoprocessing functions. These resources
    // will be accessible via a public url, though the location will be hidden
    // and cannot be listed by clients.
    const publicBucket = new s3.Bucket(this, `PublicResults`, {
      bucketName: `${props.project}-public-${this.region}`,
      versioned: false,
      publicReadAccess: true,
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: ["HEAD", "GET"],
          allowedHeaders: ["*"],
          id: "my-cors-rule-1",
          maxAge: 3600,
        } as CorsRule,
      ],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    const publicBucketUrl = publicBucket.urlForObject();

    // dynamodb
    const tasksTbl = new dynamodb.Table(this, `gp-${manifest.title}-tasks`, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "service", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${manifest.title}-tasks`,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // project metadata endpoints

    const api = new apigateway.RestApi(
      this,
      `${props.project}-geoprocessing-api`,
      {
        restApiName: `${props.project} geoprocessing service`,
        description: `Serves API requests for ${props.project}.`,
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

    const metadataHandler = new lambda.Function(this, "MetadataHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
      handler: "serviceHandlers.projectMetadata",
      environment: {
        publicBucketUrl,
        clientUrl: distribution.domainName,
      },
    });

    tasksTbl.grantReadData(metadataHandler);

    const getMetadataIntegration = new apigateway.LambdaIntegration(
      metadataHandler,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      }
    );
    api.root.addMethod("GET", getMetadataIntegration); // GET /

    // function endpoints
    const region = manifest.region as string;

    const apigatewaysocket = new apigateway.CfnApiV2(this, "apigatewaysocket", {
      name: `${props.project} async geoprocessing service`,
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.message",
    });

    const socketsTbl = new dynamodb.Table(
      this,
      `gp-${manifest.title}-socketids`,
      {
        partitionKey: {
          name: "connectionId",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        tableName: `gp-${manifest.title}-socketids`,
        removalPolicy: core.RemovalPolicy.DESTROY,
      }
    );
    for (const func of manifest.functions) {
      const stageName = "prod";
      // @ts-ignore
      const filename = path.basename(func.handler);
      let geoprocessingEnvOptions: any = {
        publicBucketUrl,
        TASKS_TABLE: tasksTbl.tableName,
      };

      let asyncHandler: lambda.Function;
      let policies: iam.PolicyStatement[] = [];
      //If its async, we need to make 2 lambda handlers, one that is the async with websockets
      //and one that is sync with http rest
      let funcName = `gp-${manifest.title}-${func.title}-async`;

      geoprocessingEnvOptions.ASYNC_HANDLER_FUNCTION_NAME = funcName;
      if (func.executionMode === "async" && func.purpose === "geoprocessing") {
        //for the asynchronous lambda, set this flag to true so it doesn't look for
        //cached results and always runs it synchronously
        geoprocessingEnvOptions.RUN_AS_SYNC = "true";
        asyncHandler = new lambda.Function(
          this,
          `${func.title}AsynchronousHandler`,
          {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),

            handler: filename.replace(/\.js$/, "") + ".handler",
            functionName: funcName,
            memorySize: func.memory,
            timeout: core.Duration.seconds(func.timeout || 3),
            description: func.description,
            environment: geoprocessingEnvOptions,
          }
        );
        //policy to allow the sync function to call the async function
        const lambdaPolicy = new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          //@ts-ignore
          resources: [asyncHandler.functionArn],
          actions: ["lambda:InvokeFunction"],
        });

        const roleLambda = new iam.Role(this, "roleLambda", {
          assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });
        roleLambda.addToPolicy(lambdaPolicy);
        policies = [lambdaPolicy];
      }

      geoprocessingEnvOptions = {
        publicBucketUrl,
        TASKS_TABLE: tasksTbl.tableName,
        SOCKETS_TABLE: socketsTbl.tableName,
        //for the 'normal' lambda deploy, don't force synchronous, let it be marked as
        //async as needed
        RUN_AS_SYNC: "false",
        ASYNC_HANDLER_FUNCTION_NAME: funcName,
      };
      const syncHandler = new lambda.Function(this, `${func.title}Handler`, {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName: `gp-${manifest.title}-${func.title}`,
        memorySize: func.memory,
        timeout: core.Duration.seconds(func.timeout || 3),
        description: func.description,
        initialPolicy: policies,

        environment:
          func.purpose === "geoprocessing" ? geoprocessingEnvOptions : {},
      });

      if (func.purpose === "geoprocessing") {
        tasksTbl.grantReadWriteData(syncHandler);
        publicBucket.grantReadWrite(syncHandler);
        if (func.executionMode === "async") {
          //@ts-ignore
          tasksTbl.grantReadWriteData(asyncHandler);
          //@ts-ignore
          publicBucket.grantReadWrite(asyncHandler);
        }
      }

      const syncHandlerIntegration = new apigateway.LambdaIntegration(
        syncHandler,
        {
          requestTemplates: { "application/json": '{ "statusCode": "200" }' },
        }
      );

      const resource = api.root.addResource(func.title);
      if (func.executionMode === "async") {
        // access role for the socket api to access the socket lambda
        //give the socket apigateway access to the 3 lambda socket functions

        const apigatewayPolicy = new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          //@ts-ignore
          principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
          actions: ["lambda:InvokeFunction", "sts:AssumeRole"],
        });

        //policy to allow the socket apigateway to call the socket lambdas

        const asyncConnHandler = new lambda.Function(
          this,
          `${func.title}AsyncConnectionHandler`,
          {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
            handler: "connect.handler",
            functionName: funcName + "Connect",
            memorySize: func.memory,
            timeout: core.Duration.seconds(func.timeout || 3),
            description: func.description + ", for connecting sockets",
            environment: geoprocessingEnvOptions,
          }
        );

        const asyncSendHandler = new lambda.Function(
          this,
          `${func.title}AsyncSendHandler`,
          {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
            handler: "sendmessage.handler",
            functionName: funcName + "Send",
            memorySize: func.memory,
            timeout: core.Duration.seconds(func.timeout || 3),
            description: func.description + ", for sending messages on sockets",
            environment: geoprocessingEnvOptions,
          }
        );

        const asyncDisconnectHandler = new lambda.Function(
          this,
          `${func.title}AsyncDisconnectHandler`,
          {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
            handler: "disconnect.handler",
            functionName: funcName + "Disconnect",
            memorySize: func.memory,
            timeout: core.Duration.seconds(func.timeout || 3),
            description: func.description + ", for disconnecting sockets",
            environment: geoprocessingEnvOptions,
          }
        );

        // access role for the socket api to access the socket lambda
        const connPolicy = new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [asyncConnHandler.functionArn],
          actions: ["lambda:InvokeFunction"],
        });

        const connRole = new iam.Role(this, "roleConn", {
          assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        });
        connRole.addToPolicy(connPolicy);

        const apigatewayroutesocketconnect = new apigateway.CfnRouteV2(
          this,
          "apigatewayroutesocketconnect",
          {
            apiId: apigatewaysocket.ref,
            routeKey: "$connect",
            authorizationType: "NONE",
            operationName: "ConnectRoute",

            target:
              "integrations/" +
              new apigateway.CfnIntegrationV2(
                this,
                "apigatewayintegrationsocketconnect",
                {
                  apiId: apigatewaysocket.ref,
                  integrationType: "AWS_PROXY",
                  integrationUri:
                    "arn:aws:apigateway:" +
                    region +
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
          actions: ["lambda:InvokeFunction"],
        });

        const disRole = new iam.Role(this, "roleDis", {
          assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        });
        disRole.addToPolicy(disPolicy);
        // disconnect route
        const apigatewayroutesocketdisconnect = new apigateway.CfnRouteV2(
          this,
          "apigatewayroutesocketdisconnect",
          {
            apiId: apigatewaysocket.ref,
            routeKey: "$disconnect",
            authorizationType: "NONE",
            operationName: "DisconnectRoute",
            target:
              "integrations/" +
              new apigateway.CfnIntegrationV2(
                this,
                "apigatewayintegrationsocketdisconnect",
                {
                  apiId: apigatewaysocket.ref,
                  integrationType: "AWS_PROXY",
                  integrationUri:
                    "arn:aws:apigateway:" +
                    region +
                    ":lambda:path/2015-03-31/functions/" +
                    asyncDisconnectHandler.functionArn +
                    "/invocations",
                  credentialsArn: disRole.roleArn,
                }
              ).ref,
          }
        );

        const sendPolicy = new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [asyncSendHandler.functionArn],
          actions: ["lambda:InvokeFunction"],
        });

        const sendRole = new iam.Role(this, "roleSend", {
          assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        });
        sendRole.addToPolicy(sendPolicy);

        // route for this function
        const apigatewayroutesocketsend = new apigateway.CfnRouteV2(
          this,
          "apigatewayroutesocketsend",
          {
            apiId: apigatewaysocket.ref,
            routeKey: "sendmessage",
            authorizationType: "NONE",
            operationName: "SendRoute",
            target:
              "integrations/" +
              new apigateway.CfnIntegrationV2(
                this,
                "apigatewayintegrationsocketsend",
                {
                  apiId: apigatewaysocket.ref,
                  integrationType: "AWS_PROXY",

                  integrationUri:
                    "arn:aws:apigateway:" +
                    region +
                    ":lambda:path/2015-03-31/functions/" +
                    asyncSendHandler.functionArn +
                    "/invocations",
                  credentialsArn: sendRole.roleArn,
                }
              ).ref,
          }
        );

        // deployment
        const apigatewaydeploymentsocket2 = new apigateway.CfnDeploymentV2(
          this,
          "apigatewaydeploymentsocket2",
          {
            apiId: apigatewaysocket.ref,
          }
        );

        // stage
        const apigatewaystagesocket2 = new apigateway.CfnStageV2(
          this,
          "apigatewaystagesocket2",
          {
            apiId: apigatewaysocket.ref,
            deploymentId: apigatewaydeploymentsocket2.ref,
            stageName: stageName,

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

        resource.addMethod("POST", syncHandlerIntegration);
        if (func.purpose === "geoprocessing") {
          resource.addMethod("GET", syncHandlerIntegration);
        }
      } else {
        resource.addMethod("POST", syncHandlerIntegration);
        if (func.purpose === "geoprocessing") {
          resource.addMethod("GET", syncHandlerIntegration);
        }
      }

      // new core.CfnOutput(this, "ProjectRoot", {
      //   value: api.urlForPath("/"),
      // });
    }
  }
}

createStack();
