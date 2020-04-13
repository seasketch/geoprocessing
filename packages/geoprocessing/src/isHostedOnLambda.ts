export default !!(
  process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV
);
