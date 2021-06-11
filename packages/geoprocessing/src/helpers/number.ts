/** Rounds a number to a fixed precision  */
export function roundDecimal(value: number, places: number) {
  return +value.toFixed(places);
}
