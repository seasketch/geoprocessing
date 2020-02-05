import * as core from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { BucketProps, CorsRule } from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import fs from "fs";
import path from "path";
import { Manifest } from "../manifest";

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
  // const functionLocations = (manifest.functions.map((f) => f.handler as string);
  const stackName = `${projectName}-geoprocessing-stack`;
  // console.log("build");
  // try {
  //   await buildLambdaHandlers("location", functionLocations, "./.build");
  // } catch (e) {
  //   console.error(e);
  //   process.exit(-1);
  // }
  // console.log("done building");

  const app = new core.App();
  const stack = new GeoprocessingCdkStack(app, stackName, {
    env: { region },
    project: projectName
  });
}

interface GeoprocessingStackProps extends core.StackProps {
  project: string;
}

class GeoprocessingCdkStack extends core.Stack {
  constructor(scope: core.App, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);

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
          maxAge: 3600
        } as CorsRule
      ]
    });

    const publicBucketUrl = publicBucket.urlForObject();

    // results cloudfront

    // dynamodb
    // project metadata endpoints
    const api = new apigateway.RestApi(
      this,
      `${props.project}-geoprocessing-api`,
      {
        restApiName: "Geoprocessing Service",
        description: `Serves API requests for ${props.project}.`
      }
    );

    const metadataHandler = new lambda.Function(this, "MetadataHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset(path.join(PROJECT_PATH, ".build")),
      handler: "serviceHandlers.projectMetadata",
      environment: {
        publicBucketUrl
      }
    });

    const getMetadataIntegration = new apigateway.LambdaIntegration(
      metadataHandler,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' }
      }
    );

    api.root.addMethod("GET", getMetadataIntegration); // GET /

    // function endpoints

    /** Client Assets */
    // client bundle buckets
    // client bundle cloudfront
  }
}

createStack();
