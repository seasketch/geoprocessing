import { CfnOutput } from "aws-cdk-lib/core";
import { GeoprocessingStack } from "./GeoprocessingStack";

export function genOutputMeta(stack: GeoprocessingStack) {
  const clientDistributionUrl = stack.clientDistribution
    ? stack.clientDistribution.distributionDomainName
    : undefined;
  const publicDatasetBucketUrl = stack.publicBuckets.dataset.urlForObject();
  const publicResultBucketUrl = stack.publicBuckets.result.urlForObject();

  // Output notable values
  new CfnOutput(stack, "datasetBucketUrl", {
    value: publicDatasetBucketUrl,
  });
  new CfnOutput(stack, "resultBucketUrl", {
    value: publicResultBucketUrl,
  });
  new CfnOutput(stack, "clientDistributionUrl", {
    value: clientDistributionUrl ? clientDistributionUrl : "undefined",
  });
}
