/**
 * Expects that testValue is equal to expectedValue or optionally within percentage (defaults to .01 or 1%)
 */
export const testWithinPerc = (
  testValue: number,
  expectedValue: number,
  options?: {
    withinPerc?: number;
    debug?: boolean;
  }
) => {
  const { withinPerc, debug } = { withinPerc: 0.01, debug: false, ...options };
  if (expectedValue === 0) {
    if (testValue === 0) {
      if (debug)
        console.log(`test: ${testValue}, expected: ${expectedValue}, skipped`);
      return;
    } else {
      // Get it just up off of 0
      expectedValue = testValue * 0.00000000001;
    }
  }
  const percDiff = Math.abs(testValue - expectedValue) / expectedValue;

  if (debug)
    console.log(
      `test: ${testValue}, expected: ${expectedValue}, percDiff: ${percDiff}`
    );
  expect(percDiff).toBeLessThan(withinPerc);
};
