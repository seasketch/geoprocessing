import { GeoprocessingStack } from "./GeoprocessingStack.js";
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { GpDynamoTables } from "./types.js";
import { Function } from "aws-cdk-lib/aws-lambda";

/**
 * Create database tables
 */
export const createTables = (stack: GeoprocessingStack): GpDynamoTables => {
  let tables: GpDynamoTables = {
    tasks: undefined,
    estimates: undefined,
    subscriptions: undefined,
  };
  if (stack.lambdaStack.getProcessingFunctions().length > 0) {
    tables.tasks = new Table(stack, `GpTasksTable`, {
      partitionKey: { name: "id", type: AttributeType.STRING },
      sortKey: { name: "service", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${stack.props.projectName}-tasks`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    tables.estimates = new Table(stack, `GpEstimatesTable`, {
      partitionKey: {
        name: "service",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${stack.props.projectName}-estimates`,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  if (stack.getAsyncFunctionMetas().length > 0) {
    tables.subscriptions = new Table(stack, "GpSubscriptionsTable", {
      partitionKey: {
        name: "connectionId",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: `gp-${stack.props.projectName}-subscriptions`,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  return tables;
};

/** Setup function access to tables */
export const setupTableFunctionAccess = (stack: GeoprocessingStack) => {
  // sync
  stack.getSyncFunctionsWithMeta().forEach((syncFunctionWithMeta) => {
    if (stack.tables.tasks) {
      stack.tables.tasks.grantReadWriteData(syncFunctionWithMeta.func);
      syncFunctionWithMeta.func.addEnvironment(
        "TASKS_TABLE",
        stack.tables.tasks.tableName
      );
    }

    if (stack.tables.estimates) {
      stack.tables.estimates.grantReadWriteData(syncFunctionWithMeta.func);
      syncFunctionWithMeta.func.addEnvironment(
        "ESTIMATES_TABLE",
        stack.tables.estimates.tableName
      );
    }
  });

  // async
  stack.getAsyncFunctionsWithMeta().forEach((asyncFunctionWithMeta) => {
    if (stack.tables.tasks) {
      stack.tables.tasks.grantReadWriteData(asyncFunctionWithMeta.startFunc);
      stack.tables.tasks.grantReadWriteData(asyncFunctionWithMeta.runFunc);
    }
    if (stack.tables.estimates) {
      stack.tables.estimates.grantReadWriteData(
        asyncFunctionWithMeta.startFunc
      );
      stack.tables.estimates.grantReadWriteData(asyncFunctionWithMeta.runFunc);
    }

    addAsyncEnv(stack, asyncFunctionWithMeta.startFunc);
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

  if (stack.functions.socketFunctions.send && stack.tables.estimates)
    stack.tables.estimates.grantReadWriteData(
      stack.functions.socketFunctions.send
    );
};

const addAsyncEnv = (stack: GeoprocessingStack, func: Function) => {
  if (stack.tables.tasks)
    func.addEnvironment("TASKS_TABLE", stack.tables.tasks.tableName);
  if (stack.tables.estimates)
    func.addEnvironment("ESTIMATES_TABLE", stack.tables.estimates.tableName);
  if (stack.tables.subscriptions)
    func.addEnvironment(
      "SUBSCRIPTIONS_TABLE",
      stack.tables.subscriptions.tableName
    );
};
