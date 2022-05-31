import { GeoprocessingStack } from "./GeoprocessingStack";
import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, CorsRule } from "aws-cdk-lib/aws-s3";
import {
  getSyncFunctionsWithMeta,
  GpProjectFunctions,
} from "./functionResources";

export interface GpPublicBuckets {
  /**
   * Publicly accessible bucket for large datasets that need to be stored outside of project code assets
   * Location is not published or able to be listed.  Can be read by gp functions whether in Lambda, local, or CI
   */
  dataset: Bucket;
  /**
   * Create publicly accessible bucket for function results that aren't simple JSON serializable
   * Location is not published or able to be listed.
   */
  result: Bucket;
}

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
export const setupBucketAccess = (
  stack: GeoprocessingStack,
  buckets: GpPublicBuckets,
  projectFunctions: GpProjectFunctions
) => {
  // Preprocessors don't need access to these resources
  getSyncFunctionsWithMeta(projectFunctions.processingFunctions).forEach(
    (syncFunctionWithMeta) => {
      buckets.result.grantReadWrite(syncFunctionWithMeta.func);
      buckets.dataset.grantRead(syncFunctionWithMeta.func);
    }
  );
};
