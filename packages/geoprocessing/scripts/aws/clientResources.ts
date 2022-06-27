import path from "path";
import { GeoprocessingStack } from "./GeoprocessingStack";
import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import {
  BucketDeployment,
  Source,
  CacheControl,
} from "aws-cdk-lib/aws-s3-deployment";
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

/**
 * Create client bucket and deploy client build into it.  Serve via Cloudfront
 */
export const createClientResources = (stack: GeoprocessingStack) => {
  let clientBucket: Bucket | undefined;
  let clientDistribution: Distribution | undefined;

  if (stack.hasClients()) {
    /** Client bundle bucket. Public access is via Cloudfront */
    clientBucket = new Bucket(stack, "GpClientBucket", {
      bucketName: `gp-${stack.props.projectName}-client`,
      websiteIndexDocument: "index.html",
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Give permission for cloudfront to serve files from the bucket.
    const originAccessIdentity = new OriginAccessIdentity(
      stack,
      "OriginAccessIdentity"
    );
    clientBucket.grantRead(originAccessIdentity);

    clientDistribution = new Distribution(stack, "GpClientDistribution", {
      comment: `gp-${stack.props.projectName}`,
      defaultBehavior: {
        origin: new S3Origin(clientBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    /**
     * Sync local client bundle to bucket. Deploys an additional Lambda to do it.
     * Runs cloudfront invalidation on changes
     */
    new BucketDeployment(stack, "ClientBucketDeploy", {
      sources: [Source.asset(path.join(stack.props.projectPath, ".build-web"))],
      destinationBucket: clientBucket,
      distribution: clientDistribution,
      distributionPaths: ["/*"],
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(Duration.days(365)),
      ],
    });
  }

  return {
    clientBucket,
    clientDistribution,
  };
};

export const setupClientFunctionAccess = (stack: GeoprocessingStack) => {
  if (stack.clientDistribution) {
    stack.functions.serviceRootFunction.addEnvironment(
      "clientDistributionUrl",
      stack.clientDistribution.distributionDomainName
    );
  }
};
