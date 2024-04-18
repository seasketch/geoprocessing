// Check if code seems to be currently executing in Lambda environment
const hasProcess = (() => {
  if (!process) return false;
  if (
    process.env &&
    (process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV)
  )
    return true;
  return false;
})();
if (!process) {
}

export default hasProcess;
