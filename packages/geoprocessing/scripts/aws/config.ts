import { Runtime } from "aws-cdk-lib/aws-lambda";

const config = {
  NODE_RUNTIME: Runtime.NODEJS_16_X,
  SYNC_LAMBDA_TIMEOUT: 10, // seconds
  ASYNC_LAMBDA_START_TIMEOUT: 5,
  ASYNC_LAMBDA_RUN_TIMEOUT: 60,
};

export default config;
