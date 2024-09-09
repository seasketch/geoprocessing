import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { RemovalPolicy } from "aws-cdk-lib";
import { BlockPublicAccess, Bucket, CorsRule } from "aws-cdk-lib/aws-s3";
import { GpPublicBuckets } from "./types.js";

export const createPublicBuckets = (
  stack: GeoprocessingStack,
): GpPublicBuckets => {
  const buckets: GpPublicBuckets = {
    result: undefined,
    dataset: new Bucket(stack, `GpDatasetBucket`, {
      bucketName: `gp-${stack.props.projectName}-datasets`,
      versioned: false,
      blockPublicAccess: new BlockPublicAccess({
        blockPublicPolicy: false,
        blockPublicAcls: false,
        restrictPublicBuckets: false,
        ignorePublicAcls: false,
      }),
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
    }),
  };

  if (stack.getProcessingFunctions().length > 0) {
    buckets.result = new Bucket(stack, `GpResultBucket`, {
      bucketName: `gp-${stack.props.projectName}-results`,
      versioned: false,
      publicReadAccess: false,
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
  }

  return buckets;
};

/** Setup resource access to buckets */
export const setupBucketFunctionAccess = (stack: GeoprocessingStack) => {
  // sync
  stack.getSyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    if (stack.publicBuckets.result) {
      stack.publicBuckets.result.grantReadWrite(syncFunctionWithMeta.func);
      syncFunctionWithMeta.func.addEnvironment(
        "resultBucketUrl",
        stack.publicBuckets.result.urlForObject(),
      );
    }

    stack.publicBuckets.dataset.grantRead(syncFunctionWithMeta.func);
    syncFunctionWithMeta.func.addEnvironment(
      "datasetBucketUrl",
      stack.publicBuckets.dataset.urlForObject(),
    );
  });

  // async
  stack.getAsyncFunctionsWithMeta().forEach((asyncFunctionWithMeta) => {
    if (stack.publicBuckets.result) {
      stack.publicBuckets.result.grantReadWrite(
        asyncFunctionWithMeta.startFunc,
      );
      stack.publicBuckets.result.grantReadWrite(asyncFunctionWithMeta.runFunc);
      asyncFunctionWithMeta.runFunc.addEnvironment(
        "resultBucketUrl",
        stack.publicBuckets.result.urlForObject(),
      );
    }

    stack.publicBuckets.dataset.grantRead(asyncFunctionWithMeta.runFunc);
    asyncFunctionWithMeta.runFunc.addEnvironment(
      "datasetBucketUrl",
      stack.publicBuckets.dataset.urlForObject(),
    );
  });
};
