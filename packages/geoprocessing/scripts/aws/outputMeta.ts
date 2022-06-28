import { CfnOutput } from "aws-cdk-lib/core";
import { GeoprocessingStack } from "./GeoprocessingStack";

export function genOutputMeta(stack: GeoprocessingStack) {
  const clientDistributionUrl = stack.clientDistribution
    ? stack.clientDistribution.distributionDomainName
    : undefined;
  const publicDatasetBucketUrl = stack.publicBuckets.dataset.urlForObject();
  // Output notable values
  new CfnOutput(stack, "datasetBucketUrl", {
    value: publicDatasetBucketUrl,
  });
  new CfnOutput(stack, "clientDistributionUrl", {
    value: clientDistributionUrl ? clientDistributionUrl : "undefined",
  });

  if (stack.publicBuckets.result) {
    const publicResultBucketUrl = stack.publicBuckets.result.urlForObject();
    new CfnOutput(stack, "resultBucketUrl", {
      value: publicResultBucketUrl,
    });
  }
}
