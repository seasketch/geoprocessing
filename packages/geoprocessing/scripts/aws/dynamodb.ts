import { GeoprocessingStack } from "./GeoprocessingStack";
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { GpDynamoTables } from "./types";

/**
 * Create database tables
 */
export const createTables = (stack: GeoprocessingStack): GpDynamoTables => {
  const tasks = new Table(stack, `GpTasksTable`, {
    partitionKey: { name: "id", type: AttributeType.STRING },
    sortKey: { name: "service", type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
    tableName: `gp-${stack.props.projectName}-tasks`,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const estimates = new Table(stack, `GpEstimatesTable`, {
    partitionKey: {
      name: "service",
      type: AttributeType.STRING,
    },
    billingMode: BillingMode.PAY_PER_REQUEST,
    tableName: `gp-${stack.props.projectName}-estimates`,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const subscriptions = (() => {
    if (stack.getAsyncFunctionMetas.length > 0) {
      return new Table(stack, "GpSubscriptionsTable", {
        partitionKey: {
          name: "connectionId",
          type: AttributeType.STRING,
        },
        billingMode: BillingMode.PAY_PER_REQUEST,
        tableName: `gp-${stack.props.projectName}-subscriptions`,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    }
  })();

  return {
    tasks,
    estimates,
    subscriptions,
  };
};

/** Setup function access to tables */
export const setupTableFunctionAccess = (stack: GeoprocessingStack) => {
  // Preprocessors don't need access to these resources
  stack.getSyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    stack.tables.tasks.grantReadWriteData(syncFunctionWithMeta.func);
    stack.tables.estimates.grantReadWriteData(syncFunctionWithMeta.func);
  });
};
