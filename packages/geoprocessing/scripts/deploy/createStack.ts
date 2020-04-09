import * as core from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as apigateway from "@aws-cdk/aws-apigateway";
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
    for (const func of manifest.functions) {
      // @ts-ignore
      const filename = path.basename(func.handler);
      const handler = new lambda.Function(this, `${func.title}Handler`, {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
        handler: filename.replace(/\.js$/, "") + ".handler",
        functionName: `gp-${manifest.title}-${func.title}`,
        memorySize: func.memory,
        timeout: core.Duration.seconds(func.timeout || 3),
        description: func.description,
        environment:
          func.purpose === "geoprocessing"
            ? {
                publicBucketUrl,
                TASKS_TABLE: tasksTbl.tableName,
              }
            : {},
      });

      if (func.purpose === "geoprocessing") {
        tasksTbl.grantReadWriteData(handler);
        publicBucket.grantReadWrite(handler);
      }

      const handlerIntegration = new apigateway.LambdaIntegration(handler, {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      });

      const resource = api.root.addResource(func.title);
      resource.addMethod("POST", handlerIntegration);
      if (func.purpose === "geoprocessing") {
        resource.addMethod("GET", handlerIntegration);
      }

      new core.CfnOutput(this, "ProjectRoot", {
        value: api.urlForPath("/"),
      });
    }
  }
}

createStack();
