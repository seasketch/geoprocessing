import { CfnOutput } from "aws-cdk-lib";
import { GeoprocessingStack } from "./GeoprocessingStack.js";

export function genOutputMeta(stack: GeoprocessingStack) {
  // Output notable values

  if (stack.restApi) {
    new CfnOutput(stack, "restApiUrl", {
      value: stack.restApi.url,
    });
  }

  if (stack.socketApi) {
    new CfnOutput(stack, "socketApiUrl", {
      value: stack.socketApi.apiEndpoint,
    });
  }

  const publicDatasetBucketUrl = stack.publicBuckets.dataset.urlForObject();
  new CfnOutput(stack, "datasetBucketUrl", {
    value: publicDatasetBucketUrl,
  });

  if (stack.publicBuckets.result) {
    const publicResultBucketUrl = stack.publicBuckets.result.urlForObject();
    new CfnOutput(stack, "resultBucketUrl", {
      value: publicResultBucketUrl,
    });
  }

  if (stack.clientBucket) {
    const clientBucketUrl = stack.clientBucket.urlForObject();
    // Output notable values
    new CfnOutput(stack, "clientBucketUrl", {
      value: clientBucketUrl,
    });
  }

  const clientDistributionUrl = stack.clientDistribution
    ? stack.clientDistribution.distributionDomainName
    : undefined;
  new CfnOutput(stack, "clientDistributionUrl", {
    value: clientDistributionUrl ? clientDistributionUrl : "undefined",
  });
}
