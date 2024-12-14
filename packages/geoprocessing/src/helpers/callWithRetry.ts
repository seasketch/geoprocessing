/**
 * Calls given function and if error thrown, it recursively retries function up to maxTry times, then just rethrows the error
 * @param fn the function to call
 * @param args arguments to pass to the function when it is called
 * @param options.maxTry the maximum number of times to try again, defaults to 3
 * @param options.retryCount the current retry count, defaults to 1
 * @param options.logEachFailure whether to console.log each failure, defaults to true
 * @param options.ifErrorContains if provided, retries only if error message includes this string, otherwise rethrows immediatly.
 * @returns the result of calling the function
 */
export async function callWithRetry<T extends (...arg0: any[]) => any>(
  fn: T,
  args: Parameters<T>,
  options: {
    maxTry?: number;
    retryCount?: number;
    logEachFailure?: boolean;
    ifErrorMsgContains?: string;
  } = {},
): Promise<Awaited<ReturnType<T>>> {
  const {
    maxTry = 3,
    retryCount = 1,
    logEachFailure = true,
    ifErrorMsgContains: errorFilter,
  } = options;
  const currRetry = typeof retryCount === "number" ? retryCount : 1;
  try {
    const result = await fn(...args);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // if error message does not include errorMsgSubstring, rethrow
      if (errorFilter && !error.message.includes(errorFilter)) {
        throw error;
      }
      if (logEachFailure) {
        console.log(`Retry ${currRetry} failed`);
        console.log(error.message);
      }
      if (currRetry > maxTry) {
        console.log(`All ${maxTry} retry attempts exhausted`);
        throw error;
      }
      return callWithRetry(fn, args, { maxTry, retryCount: currRetry + 1 });
    } else {
      throw error;
    }
  }
}
