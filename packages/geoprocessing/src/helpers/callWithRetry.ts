/**
 * Calls given function and if throws error it recursively retries up to maxTry times
 * @param fn the function to call
 * @param args arguments to pass to the function when it is called
 * @param options.maxTry the maximum number of times to try again, defaults to 3
 * @param options.retryCount the current retry count, defaults to 1
 * @param options.logEachFailure whether to console.log each failure, defaults to true
 * @returns the result of calling the function
 */
export async function callWithRetry<T extends (...arg0: any[]) => any>(
  fn: T,
  args: Parameters<T>,
  options: {
    maxTry?: number;
    retryCount?: number;
    logEachFailure?: boolean;
  } = {},
): Promise<Awaited<ReturnType<T>>> {
  const { maxTry = 3, retryCount = 1, logEachFailure = true } = options;
  const currRetry = typeof retryCount === "number" ? retryCount : 1;
  try {
    const result = await fn(...args);
    return result;
  } catch (error) {
    if (logEachFailure) console.log(`Retry ${currRetry} failed.`);
    if (currRetry > maxTry) {
      console.log(`All ${maxTry} retry attempts exhausted`);
      throw error;
    }

    return callWithRetry(fn, args, { maxTry, retryCount: currRetry + 1 });
  }
}
