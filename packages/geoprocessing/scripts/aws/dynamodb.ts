import { GeoprocessingStack } from "./GeoprocessingStack";
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  GpProjectFunctions,
  getSyncFunctionsWithMeta,
} from "./functionResources";

export interface GpDynamoTables {
  tasks: Table;
  estimates: Table;
}

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

  return {
    tasks,
    estimates,
  };
};

/** Setup resource access to tables */
export const setupTableAccess = (
  stack: GeoprocessingStack,
  tables: GpDynamoTables,
  projectFunctions: GpProjectFunctions
) => {
  // Preprocessors don't need access to these resources
  getSyncFunctionsWithMeta(projectFunctions.processingFunctions).forEach(
    (syncFunctionWithMeta) => {
      tables.tasks.grantReadWriteData(syncFunctionWithMeta.func);
      tables.estimates.grantReadWriteData(syncFunctionWithMeta.func);
    }
  );
};
