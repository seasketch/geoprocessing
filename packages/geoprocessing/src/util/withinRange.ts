/**
 * Returns true if input1 is within deviation of input2
 * @param input1
 * @param input2
 * @param deviation
 * @returns true or false
 */
export function withinRange(input1: number, input2: number, deviation: number) {
  console.log("deviations", input1, input2, Math.abs(input1 - input2));
  return Math.abs(input1 - input2) <= deviation;
}
