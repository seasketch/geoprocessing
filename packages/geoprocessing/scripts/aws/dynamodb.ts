import { GeoprocessingStack } from "./GeoprocessingStack";
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { GpDynamoTables } from "./types";
import { Function } from "aws-cdk-lib/aws-lambda";

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
    if (stack.getAsyncFunctionMetas().length > 0) {
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
  // sync
  stack.getSyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    stack.tables.tasks.grantReadWriteData(syncFunctionWithMeta.func);
    syncFunctionWithMeta.func.addEnvironment(
      "TASKS_TABLE",
      stack.tables.tasks.tableName
    );

    stack.tables.estimates.grantReadWriteData(syncFunctionWithMeta.func);
    syncFunctionWithMeta.func.addEnvironment(
      "ESTIMATES_TABLE",
      stack.tables.estimates.tableName
    );
  });

  // async
  stack.getAsyncFunctionsWithMeta().forEach((asyncFunctionWithMeta) => {
    stack.tables.tasks.grantReadWriteData(asyncFunctionWithMeta.startFunc);
    stack.tables.estimates.grantReadWriteData(asyncFunctionWithMeta.startFunc);
    addAsyncEnv(stack, asyncFunctionWithMeta.startFunc);

    stack.tables.tasks.grantReadWriteData(asyncFunctionWithMeta.runFunc);
    stack.tables.estimates.grantReadWriteData(asyncFunctionWithMeta.runFunc);
    addAsyncEnv(stack, asyncFunctionWithMeta.runFunc);
  });

  // socket
  Object.values(stack.functions.socketFunctions).forEach((socketFunction) => {
    if (socketFunction && stack.tables.subscriptions) {
      stack.tables.subscriptions.grantReadWriteData(socketFunction);
      socketFunction.addEnvironment(
        "SUBSCRIPTIONS_TABLE",
        stack.tables.subscriptions.tableName
      );
    }
  });

  if (stack.functions.socketFunctions.send)
    stack.tables.estimates.grantReadWriteData(
      stack.functions.socketFunctions.send
    );
};

const addAsyncEnv = (stack: GeoprocessingStack, func: Function) => {
  func.addEnvironment("TASKS_TABLE", stack.tables.tasks.tableName);
  func.addEnvironment("ESTIMATES_TABLE", stack.tables.estimates.tableName);
  if (stack.tables.subscriptions)
    func.addEnvironment("TASKS_TABLE", stack.tables.subscriptions.tableName);
};
