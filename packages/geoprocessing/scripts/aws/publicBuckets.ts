import { GeoprocessingStack } from "./GeoprocessingStack";
import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, CorsRule } from "aws-cdk-lib/aws-s3";
import { GpProjectFunctions, GpPublicBuckets } from "./types";

export const createPublicBuckets = (
  stack: GeoprocessingStack
): GpPublicBuckets => {
  const result = new Bucket(stack, `GpResultBucket`, {
    bucketName: `gp-${stack.props.projectName}-results`,
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
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  const dataset = new Bucket(stack, `GpDatasetBucket`, {
    bucketName: `gp-${stack.props.projectName}-datasets`,
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
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  return {
    dataset,
    result,
  };
};

/** Setup resource access to buckets */
export const setupFunctionBucketAccess = (stack: GeoprocessingStack) => {
  // Preprocessors don't need access to these resources
  // TODO: so should we be asking for something different?
  stack.getSyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    stack.publicBuckets.result.grantReadWrite(syncFunctionWithMeta.func);
    stack.publicBuckets.dataset.grantRead(syncFunctionWithMeta.func);
  });
};
