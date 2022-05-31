import { CfnOutput, Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Manifest,
  GeoprocessingFunctionMetadata,
  ProcessingFunctionMetadata,
} from "../manifest";
import { createPublicBuckets, setupBucketAccess } from "./publicBuckets";
import { createClientResources } from "./clientResources";
import { createFunctions } from "./functionResources";
import { createTables, setupTableAccess } from "./dynamoDb";
import { createRestApi } from "./restApiGateway";
import { getApiGateway } from "./WebSocket";

// GeoprocessingStack adapted from multiple sources including https://github.com/elthrasher/planetstack

const SOCKET_HANDLER_TIMEOUT = Duration.seconds(3);
const SOCKET_HANDLER_MEMORY = 1024;

interface GeoprocessingStackProps extends StackProps {
  projectName: string;
  projectPath: string;
  manifest: Manifest;
  env: {
    region: string;
  };
}

export class GeoprocessingStack extends Stack {
  props: GeoprocessingStackProps;

  constructor(scope: Construct, id: string, props: GeoprocessingStackProps) {
    super(scope, id, props);
    this.props = props;

    const publicBuckets = createPublicBuckets(this);
    const publicDatasetBucketUrl = publicBuckets.dataset.urlForObject();
    const publicResultBucketUrl = publicBuckets.result.urlForObject();

    const { clientBucket, clientDistribution } = createClientResources(this);

    const clientDistributionUrl = clientDistribution
      ? clientDistribution.distributionDomainName
      : undefined;

    const tables = createTables(this);

    const projectFunctions = createFunctions(this, {
      syncEnvironment: {
        publicDatasetBucketUrl,
        publicResultBucketUrl,
        TASKS_TABLE: tables.tasks.tableName,
        ESTIMATES_TABLE: tables.estimates.tableName,
      },
      clientUrl: clientDistributionUrl,
    });

    const restApi = createRestApi(this, projectFunctions);

    setupTableAccess(this, tables, projectFunctions);
    setupBucketAccess(this, publicBuckets, projectFunctions);

    new CfnOutput(this, "publicDatasetBucketUrl", {
      value: publicDatasetBucketUrl,
    });
    new CfnOutput(this, "publicResultBucketUrl", {
      value: publicResultBucketUrl,
    });
    new CfnOutput(this, "clientDistributionUrl", {
      value: clientDistributionUrl ? clientDistributionUrl : "undefined",
    });
  }
}

/**
 * Returns root lambda handler method pointer in module.function dot notation
 */
export function getHandlerPointer(funcMeta: ProcessingFunctionMetadata) {
  return `${funcMeta.handlerFilename
    .replace(/\.js$/, "")
    .replace(/\.ts$/, "")}Handler.handler`;
}
