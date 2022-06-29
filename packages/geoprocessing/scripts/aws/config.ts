import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

const config = {
  STAGE_NAME: "prod",
  NODE_RUNTIME: Runtime.NODEJS_16_X,
  SYNC_LAMBDA_TIMEOUT: 10, // seconds
  ASYNC_LAMBDA_START_TIMEOUT: 5,
  ASYNC_LAMBDA_RUN_TIMEOUT: 60,
  SOCKET_HANDLER_TIMEOUT: Duration.seconds(3),
  SOCKET_HANDLER_MEMORY: 1024,
};

export default config;
