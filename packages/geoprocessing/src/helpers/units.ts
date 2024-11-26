/**
 * Converts value from square meters to square miles
 * @param value in square meters
 * @returns value in square miles
 */
export function squareMeterToMile(value: number) {
  return value / 2_589_988.110_336;
}

/**
 * Converts value from square meters to square kilometers
 * @param value in square meters
 * @returns value in square kilometers
 */
export function squareMeterToKilometer(value: number) {
  return value / 1000 ** 2;
}
